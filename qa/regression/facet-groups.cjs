const fs = require('node:fs/promises');
const path = require('node:path');
const { assert, baseURL, chromium, localQA, liveQA } = require('./runtime.cjs');
const checkDownloads = require('./download-matrix.cjs');
const { searchResponse } = require('./demo-fixture.cjs');
const { endpoint } = require('../../public/config/searchlabpilot.json');

const type = 'demo_content_type_s';
const area = 'demo_campus_area_s';
const profile = 'SearchLabBuild';
const modes = ['ordinary', 'profile'];
const designs = ['ordered', 'selected'];
const starter = process.env.QA_STARTER_URL;
const defaultOrder = ['Content type', 'Campus area'];
const customOrder = ['Campus area', 'Content type'];
const subset = ['Content type'];

async function configureRecording(work, kit, variant) {
  const directory = kit === 'javascript' && variant.startsWith('ordinary') ? work : path.join(work, 'src');
  const recording = model => Object.fromEntries(['rehabilitation', 'campus'].map(q => {
    const url = new URL(endpoint);
    url.search = new URLSearchParams({ q, model, language: 'en', rows: '50' });
    return [q, searchResponse(url)];
  }));
  await fs.writeFile(path.join(directory, 'recorded-searches.js'), 'export default ' + JSON.stringify({
    [profile]: recording(profile), 'Main Profile': recording('Main Profile'),
  }));
}

async function search(scope, output = scope) {
  const input = scope.getByRole('searchbox', { name: 'Search the website', exact: true });
  await input.fill('campus');
  await input.press('Enter');
  await count(output, 37);
}

async function count(scope, total) {
  await scope.getByText(new RegExp('^' + total + ' results?(?: for “campus”)?$')).first().waitFor();
}

async function groups(scope, order) {
  const rendered = scope.locator('fieldset[data-facet]:visible > legend');
  await rendered.first().waitFor();
  assert.deepEqual(await rendered.allTextContents(), order);
}

const group = (scope, field) => scope.locator('fieldset[data-facet="' + field + '"]');
const location = scope => group(scope, type).getByRole('checkbox', { name: /^location\b/i });
const north = scope => group(scope, area).getByRole('checkbox', { name: /^North\b/ });

async function checkFiltering(scope) {
  await north(scope).click();
  await count(scope, 13);
  await location(scope).click();
  await count(scope, 3);
  assert.ok(await north(scope).isChecked());
  assert.ok(await location(scope).isChecked());
}

async function settings(page) {
  await page.getByRole('tab', { name: 'Features', exact: true }).click();
  const section = page.locator('summary').filter({ hasText: /^Filters and sorting$/ });
  if (!(await section.evaluate(el => el.parentElement.open))) await section.click();
}

async function checkEditorReflow(page) {
  const viewport = page.viewportSize();
  const styles = await page.addStyleTag({ content: 'html { font-size: 200% !important; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
  try {
    for (const width of [320, 851]) {
      await page.setViewportSize({ ...viewport, width });
      const overflow = await page.locator('#lab-facet-group-editor').evaluate(editor => {
        const boundary = editor.getBoundingClientRect();
        return [...editor.querySelectorAll('input, select, button')].filter(control => {
          const bounds = control.getBoundingClientRect();
          return bounds.left < boundary.left - 1 || bounds.right > boundary.right + 1;
        }).map(control => control.id);
      });
      assert.deepEqual(overflow, [], width + 'px facet controls fit with 200% text and increased spacing');
    }
  } finally {
    await styles.evaluate(el => el.remove());
    await page.setViewportSize(viewport);
  }
}

async function enableProfileTabs(page) {
  const section = page.locator('summary').filter({ hasText: /^Advanced Options$/ });
  if (!(await section.evaluate(el => el.parentElement.open))) await section.click();
  await page.getByLabel('Show profile tabs').check();
}

async function share(page) {
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
  await page.getByRole('button', { name: 'Share Design', exact: true }).click();
  await page.getByRole('button', { name: 'Copy design link' }).click();
  const url = await page.getByLabel('Design link', { exact: true }).inputValue();
  assert.ok(new URL(url).searchParams.has('lab_facet_groups'));
  return url;
}

async function exportStarters(page, variant) {
  await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
  for (const kit of ['javascript', 'react', 'vue', 'angular']) {
    const directory = path.join(process.env.QA_ARTIFACT_DIR, variant, kit);
    await fs.mkdir(directory, { recursive: true });
    const [file] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + kit + '"]').click()]);
    await file.saveAs(path.join(directory, 'starter.zip'));
  }
  await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
}

async function checkBuild(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const requests = [];
  await page.route(endpoint + '*', route => {
    const url = new URL(route.request().url());
    requests.push(url);
    return route.fulfill({ json: searchResponse(url) });
  });
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Start designing' }).click();
  const ordinary = page.locator('[data-lab-demo-output]');
  await search(page, ordinary);
  await groups(ordinary, defaultOrder);
  await settings(page);
  await checkEditorReflow(page);
  await page.getByLabel('Match selected filter values').selectOption('and');
  await page.getByLabel('Filter group', { exact: true }).selectOption(area);
  const before = requests.length;
  await page.locator('#lab-facet-group-up').click();
  await groups(ordinary, customOrder);
  assert.equal(requests.length, before, 'Reordering should reuse the current search.');
  const ordered = await share(page);
  await checkFiltering(ordinary);
  const beforeHide = requests.length;
  await page.getByRole('checkbox', { name: 'Show this group' }).uncheck();
  await count(ordinary, 8);
  await groups(ordinary, subset);
  assert.ok(await location(ordinary).isChecked(), 'Only the hidden group’s filter should clear.');
  assert.ok(requests.slice(beforeHide).some(url => {
    const filters = url.searchParams.getAll('fq').join(' ');
    return filters.includes(type) && !filters.includes(area);
  }), 'The new request contains only the visible filter.');
  await page.getByRole('button', { name: 'Share Design', exact: true }).click();
  const selected = await share(page);
  await page.reload();
  await search(page, ordinary);
  await groups(ordinary, subset);
  await settings(page);
  await page.getByRole('button', { name: 'Use profile defaults' }).click();
  await groups(ordinary, defaultOrder);

  for (const [variant, url, expected] of [['ordered', ordered, customOrder], ['selected', selected, subset]]) {
    const recipient = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await recipient.goto(url);
    const single = recipient.locator('[data-lab-demo-output]');
    await search(recipient, single);
    await groups(single, expected);
    await exportStarters(recipient, 'ordinary-' + variant);
    await enableProfileTabs(recipient);
    const profilePreview = recipient.locator('#lab-experiences');
    await count(profilePreview, 37);
    await groups(profilePreview, expected);
    await exportStarters(recipient, 'profile-' + variant);
    if (variant === 'ordered') {
      await checkFiltering(profilePreview);
      await settings(recipient);
      await recipient.getByLabel('Filter group', { exact: true }).selectOption(area);
      await recipient.getByRole('checkbox', { name: 'Show this group' }).uncheck();
      await count(profilePreview, 8);
      await groups(profilePreview, subset);
      assert.ok(await location(profilePreview).isChecked());
      await recipient.getByLabel('Filter group', { exact: true }).selectOption(type);
      await recipient.getByRole('checkbox', { name: 'Show this group' }).uncheck();
      await count(profilePreview, 37);
      assert.equal(await profilePreview.locator('fieldset[data-facet]:visible').count(), 0);
      await profilePreview.getByRole('tab', { name: 'Main Profile', exact: true }).click();
      await count(profilePreview, 37);
      await groups(profilePreview, subset);
      await profilePreview.getByRole('tab', { name: profile, exact: true }).click();
      await count(profilePreview, 37);
      assert.equal(await profilePreview.locator('fieldset[data-facet]:visible').count(), 0);
    }
    await recipient.close();
  }
  await checkConnected(page, ordered);
  await page.close();
  console.log('Build passed default and custom order, clearing hidden filters, reload, shared links, profile tabs and connected preview.');
}

async function checkConnected(page, ordered) {
  const target = 'https://review.searchstax.com/facet-fixture/emselect';
  await page.route(target + '*', route => route.fulfill({ json: searchResponse(new URL(route.request().url())) }));
  await page.goto(ordered);
  await page.getByRole('button', { name: 'Preview with your Search App' }).click();
  await page.locator('#lab-customer-endpoint').fill(target);
  await page.locator('#lab-customer-token').fill('local-fixture');
  await page.locator('#lab-customer-query').fill('campus');
  await page.locator('[data-customer-options] summary').click();
  await page.locator('#lab-customer-profile').fill(profile);
  await page.locator('#lab-customer-language').fill('en');
  await page.locator('[data-customer-submit]').click();
  const connected = page.locator('[data-customer-preview]');
  await count(connected, 37);
  await groups(connected, customOrder);
  await checkFiltering(connected);
  await settings(page);
  await page.getByLabel('Filter group', { exact: true }).selectOption(area);
  await page.getByRole('checkbox', { name: 'Show this group' }).uncheck();
  await count(connected, 8);
  await groups(connected, subset);
  assert.ok(await location(connected).isChecked());
}

async function checkStarter(browser) {
  const [mode, variant] = process.env.QA_FACET_VARIANT.split('-');
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto(starter);
  const scope = mode === 'profile' ? page.locator('.lab-experiences') : page.locator('.search-starter');
  await search(scope);
  await groups(scope, variant === 'ordered' ? customOrder : subset);
  if (variant === 'ordered') {
    await checkFiltering(scope);
    await north(scope).click();
    await count(scope, 8);
  } else assert.equal(await group(scope, area).count(), 0);
  await page.close();
}

async function run() {
  assert.ok(localQA && !liveQA);
  if (!starter && !process.env.QA_ARTIFACT_DIR) {
    process.env.SEARCH_LAB_BASE_URL = baseURL;
    const variants = modes.flatMap(mode => designs.map(design => {
      const name = mode + '-' + design;
      return [name, { QA_FACET_VARIANT: name }];
    }));
    return checkDownloads('facet-groups', __filename, variants, configureRecording);
  }
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    if (starter) await checkStarter(browser);
    else await checkBuild(browser);
  } finally { await browser.close(); }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
