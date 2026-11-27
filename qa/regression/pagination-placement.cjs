const fs = require('node:fs/promises');
const path = require('node:path');
const { assert, baseURL, chromium, localQA, liveQA } = require('./runtime.cjs');
const checkDownloads = require('./download-matrix.cjs');
const { searchResponse } = require('./demo-fixture.cjs');
const { endpoint } = require('../../public/config/searchlabpilot.json');

const starter = process.env.QA_STARTER_URL;
const label = 'Pagination placement';
const position = name => '[data-pager-position="' + name + '"]';
const pager = (scope, name) => scope.locator(position(name));
const range = (scope, name) => pager(scope, name).locator('[data-page-range]');

async function configure(work, kit, mode) {
  const filename = mode === 'ordinary' && kit === 'javascript' ? 'search.js' : 'src/config.js';
  const file = path.join(work, filename);
  const source = await fs.readFile(file, 'utf8');
  const address = mode === 'ordinary' ? 'searchURL' : 'endpoint';
  const auth = mode === 'ordinary' ? 'searchAuth' : 'token';
  const config = source.replace(new RegExp('"' + address + '":\\s*"[^"]*"', 'g'), '"' + address + '": "' + endpoint + '"')
    .replace(new RegExp('"' + auth + '":\\s*"[^"]*"'), '"' + auth + '": "fixture-only"');
  assert.match(config, new RegExp('"' + auth + '": "fixture-only"'));
  await fs.writeFile(file, config);
}

async function fixture(page, address = endpoint) {
  const offsets = [];
  await page.route(address + '*', route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('q') === 'campus' && url.searchParams.get('rows') === '10') {
      offsets.push(Number(url.searchParams.get('start')));
    }
    return route.fulfill({ json: searchResponse(url) });
  });
  return offsets;
}

async function shown(scope, name, value) {
  await range(scope, name).getByText(value + ' of 37 results', { exact: true }).waitFor();
}

async function both(scope, text) {
  await Promise.all(['above', 'below'].map(name => shown(scope, name, text)));
}

async function turn(page, scope, name, direction, start, expected, offsets, fresh) {
  const before = offsets.length;
  await pager(scope, name).locator('button[data-page-step="' + direction + '"]').press('Enter');
  await both(scope, expected);
  await page.waitForFunction(({ container, direction }) => {
    const host = [...document.querySelectorAll(container)].find(element => element.getClientRects().length);
    const button = host?.querySelector('button[data-page-step="' + direction + '"]');
    const target = button?.getClientRects().length && !button.disabled ? button : host?.querySelector('[data-page-range]');
    return target && document.activeElement === target;
  }, { container: position(name), direction });
  const sent = offsets.slice(before);
  if (fresh) assert.deepEqual(sent, [start], 'One search for the new page.');
  else assert.ok(sent.length <= 1 && sent.every(offset => offset === start), 'A previously fetched page can be reused.');
}

async function checkPaging(page, scope, offsets) {
  await both(scope, '1–10');
  await turn(page, scope, 'above', 'next', 10, '11–20', offsets, true);
  await turn(page, scope, 'below', 'previous', 0, '1–10', offsets, false);
  await turn(page, scope, 'below', 'next', 10, '11–20', offsets, false);
  await turn(page, scope, 'below', 'next', 20, '21–30', offsets, true);
  await turn(page, scope, 'above', 'next', 30, '31–37', offsets, true);
}

async function submit(scope) {
  const search = scope.getByRole('searchbox', { name: 'Search the website', exact: true });
  await search.fill('campus');
  await search.press('Enter');
}

async function openSettings(page, name) {
  await page.getByRole('tab', { name: 'Features', exact: true }).click();
  const section = page.locator('summary').filter({ hasText: new RegExp('^' + name + '$') });
  if (!(await section.evaluate(el => el.parentElement.open))) await section.click();
}

async function exportStarters(page, mode) {
  await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
  for (const kit of ['javascript', 'react', 'vue', 'angular']) {
    const dir = path.join(process.env.QA_ARTIFACT_DIR, mode, kit);
    await fs.mkdir(dir, { recursive: true });
    const [file] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + kit + '"]').click()]);
    await file.saveAs(path.join(dir, 'starter.zip'));
  }
  await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
}

async function checkBuild(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const offsets = await fixture(page);
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Start designing' }).click();
  const demo = page.locator('[data-lab-demo-output]');
  await submit(page);
  await shown(demo, 'below', '1–10');
  assert.equal(await pager(demo, 'above').isVisible(), false);
  await openSettings(page, 'Advanced Options');
  const control = page.getByLabel(label, { exact: true });
  await control.selectOption({ label: 'Above results' });
  await shown(demo, 'above', '1–10');
  assert.equal(await pager(demo, 'below').isVisible(), false);
  await control.selectOption({ label: 'Both' });
  await checkPaging(page, demo, offsets);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
  await page.getByRole('button', { name: 'Share Design', exact: true }).click();
  await page.getByRole('button', { name: 'Copy design link' }).click();
  const shared = await page.getByLabel('Design link', { exact: true }).inputValue();
  assert.equal(new URL(shared).searchParams.get('lab_pagination_placement'), 'both');
  await page.reload();
  assert.equal(await control.inputValue(), 'both');

  const recipient = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const profileOffsets = await fixture(recipient);
  await recipient.goto(shared);
  await submit(recipient);
  await both(recipient.locator('[data-lab-demo-output]'), '1–10');
  await exportStarters(recipient, 'ordinary');
  await openSettings(recipient, 'Advanced Options');
  await recipient.getByLabel('Show profile tabs').check();
  const profile = recipient.locator('#lab-experiences');
  await checkPaging(recipient, profile, profileOffsets);
  await exportStarters(recipient, 'profile');
  await openSettings(recipient, 'Pagination');
  await recipient.getByLabel('How visitors see more results').selectOption('loadMore');
  assert.equal(await recipient.getByLabel(label, { exact: true }).isVisible(), false);
  assert.equal(await pager(profile, 'above').isVisible(), false);
  await pager(profile, 'below').getByRole('button', { name: 'Load more' }).waitFor();
  await recipient.close();

  const endpointFixture = 'https://review.searchstax.com/pager-fixture/emselect';
  const connectedOffsets = await fixture(page, endpointFixture);
  await page.goto(shared);
  await page.getByRole('button', { name: 'Preview with your Search App' }).click();
  await page.locator('#lab-customer-endpoint').fill(endpointFixture);
  await page.locator('#lab-customer-token').fill('local-fixture');
  await page.locator('#lab-customer-query').fill('campus');
  await page.locator('[data-customer-options] summary').click();
  await page.locator('#lab-customer-profile').fill('SearchLabBuild');
  await page.locator('#lab-customer-language').fill('en');
  await page.locator('[data-customer-submit]').click();
  await checkPaging(page, page.locator('[data-customer-preview]'), connectedOffsets);
  await page.close();
  console.log('Build passed placement, shared designs, keyboard focus, and synchronized pages in all three previews.');
}

async function checkStarter(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const offsets = await fixture(page);
  await page.goto(starter);
  const scope = page.locator(process.env.QA_PAGER_MODE === 'profile' ? '.lab-experiences' : '.search-starter');
  await submit(scope);
  await checkPaging(page, scope, offsets);
  await page.close();
}

async function run() {
  assert.ok(localQA && !liveQA);
  if (!starter && !process.env.QA_ARTIFACT_DIR) {
    process.env.SEARCH_LAB_BASE_URL = baseURL;
    return checkDownloads('pagination-placement', __filename,
      ['ordinary', 'profile'].map(mode => [mode, { QA_PAGER_MODE: mode }]), configure);
  }
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    if (starter) await checkStarter(browser);
    else await checkBuild(browser);
  } finally { await browser.close(); }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
