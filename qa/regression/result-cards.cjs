const fs = require('node:fs/promises');
const path = require('node:path');
const { assert, baseURL, chromium, localQA, liveQA } = require('./runtime.cjs');
const checkDownloads = require('./download-matrix.cjs');
const { searchResponse } = require('./demo-fixture.cjs');
const { endpoint } = require('../../public/config/searchlabpilot.json');

const site = 'https://mw-searchstax.github.io/university-health-search-demo/';
const photo = site + 'fixture-card.jpg';
const missingPhoto = site + 'missing-card.jpg';
const samples = [
  { title: 'Complete card', url: site + 'card-0/', photo },
  { title: 'Missing image', url: site + 'care/services/rehabilitation/' },
  { title: 'Missing URL', photo },
  { title: 'Text only' },
  { title: 'Unavailable image', url: site + 'card-4/', photo: missingPhoto },
  { title: 'Invalid addresses', url: 'relative/path', photo: 'relative/image.jpg' },
];
const modes = ['ordinary', 'profile'];
const starter = process.env.QA_STARTER_URL;

function fixture(url) {
  const data = searchResponse(url);
  const docs = samples.map((sample, index) => ({
    id: 'card-' + index, ...sample, description: 'Original description', kind: 'resource',
    ...(index !== 3 ? { owner_s: 'Library', level_s: 0 } : {}),
  }));
  data.metadata.results = [
    { name: 'title', result_card: 'title' }, { name: 'url', result_card: 'url' },
    { name: 'description', result_card: 'description' }, { name: 'photo', result_card: 'thumbnail' },
    { name: 'kind', result_card: 'ribbon' }, { name: 'owner_s', title: 'Owner' }, { name: 'level_s', title: 'Level' },
  ];
  data.response = { numFound: docs.length, start: 0, docs };
  data.highlighting = Object.fromEntries(docs.map(doc => [doc.id, { description: ['The <em>rehabilitation</em> passage.'] }]));
  return data;
}

async function configureRecording(work, kit, mode) {
  const config = path.join(work, kit === 'javascript' && mode === 'ordinary' ? '' : 'src', 'recorded-searches.js');
  const sample = fixture(new URL(endpoint + '?q=rehabilitation&model=SearchLabBuild&language=en'));
  await fs.writeFile(config, 'export default ' + JSON.stringify({ SearchLabBuild: { rehabilitation: sample } }));
}

async function verify(page, mode, customized = false) {
  const panels = { profile: '#lab-experiences', ordinary: '[data-lab-demo-output]', connected: '[data-customer-preview]' };
  const scope = starter ? page : page.locator(panels[mode]);
  const cards = scope.locator(mode === 'profile' ? '.experience-results li.mapped-result-card' : 'article.searchstax-search-result');
  await cards.first().getByRole('heading', { name: samples[0].title }).waitFor();
  const actual = await cards.evaluateAll(nodes => nodes.map(card => ({
    title: card.querySelector('h2,h4').textContent.trim(),
    link: card.querySelector('h2 a,h4 a')?.href || '',
    image: card.querySelector('img')?.getAttribute('src') || '',
    passage: card.querySelector('mark')?.parentElement.textContent.trim(),
  })));
  assert.deepEqual(actual, samples.map(sample => ({
    title: sample.title, link: sample.url?.startsWith(site) ? sample.url : '',
    image: sample.photo?.startsWith(site) ? sample.photo : '', passage: 'The rehabilitation passage.',
  })));
  await cards.nth(4).scrollIntoViewIfNeeded();
  await cards.nth(4).locator('img[data-unavailable]').waitFor({ state: 'attached' });
  assert.equal(await cards.nth(4).locator('img').isVisible(), false);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    if (!starter && width === 390) await page.locator('button[data-lab-design-mode="preview"]').click();
    const rendered = await cards.first().evaluate(async node => {
      const img = node.querySelector('img');
      await img.decode();
      const image = img.getBoundingClientRect();
      const heading = node.querySelector('h2,h4');
      const title = document.createRange();
      title.selectNodeContents(heading.querySelector('a,span') || heading);
      const ribbon = node.querySelector('.searchstax-search-result-ribbon');
      const badgeStyle = getComputedStyle(ribbon);
      return {
        width: image.width, ratio: image.width / image.height, natural: img.naturalWidth / img.naturalHeight,
        beside: image.right <= title.getBoundingClientRect().left && title.getBoundingClientRect().top < image.bottom,
        alt: img.alt, color: badgeStyle.backgroundColor, radius: badgeStyle.borderRadius,
        notchRoom: parseFloat(badgeStyle.paddingRight) - parseFloat(badgeStyle.paddingLeft),
        ribbon: ribbon.textContent.trim(), metadata: [...node.querySelectorAll('p')].slice(1).map(p => p.textContent.trim()),
      };
    });
    assert.equal(rendered.alt, '');
    assert.ok(Math.abs(rendered.ratio - rendered.natural) < .02, JSON.stringify({ mode, width, rendered }));
    assert.equal(rendered.ribbon, 'resource');
    assert.equal(rendered.beside, customized, JSON.stringify(rendered));
    if (customized) {
      assert.ok(rendered.width > 0 && rendered.width <= 96, JSON.stringify(rendered));
      assert.equal(rendered.color, 'rgb(21, 89, 64)');
    }
    const pill = customized && mode !== 'ordinary';
    assert.equal(rendered.radius, pill ? '999px' : '0px');
    assert.equal(rendered.notchRoom > 0, !pill);
    assert.deepEqual(rendered.metadata, customized ? ['Level: 0', 'Team & area: Library'] : ['Owner: Library', 'Level: 0']);
    assert.equal(await cards.nth(3).locator('p').count(), 1);
    assert.equal(await cards.nth(3).getByRole('link').count(), 0);
    const plainTitle = cards.nth(3).locator('h2,h4');
    await plainTitle.hover();
    const decoration = await plainTitle.evaluate(el => getComputedStyle(el.querySelector('span') || el).textDecorationLine);
    assert.equal(decoration, 'none');
  }
  await page.setViewportSize({ width: 1440, height: 950 });
}

async function openSettings(page, tab, group) {
  await page.getByRole('tab', { name: tab, exact: true }).click();
  const summary = page.locator('summary').filter({ hasText: new RegExp('^' + group + '$') }).first();
  if (!(await summary.evaluate(el => el.parentElement.open))) await summary.click();
}

async function customize(page, finalShape) {
  await openSettings(page, 'Appearance', 'Result cards');
  const sampleImages = page.getByLabel('Show sample thumbnails');
  if (await sampleImages.isVisible()) await sampleImages.check();
  await page.getByLabel('Underline result titles').check();
  await page.getByLabel('Thumbnail size').selectOption('small');
  const shape = page.getByLabel('Ribbon shape');
  const inherit = page.getByRole('checkbox', { name: 'Use accent color' });
  const custom = page.getByLabel('Custom ribbon color');
  const accent = page.getByLabel('Accent color', { exact: true });
  const ribbon = page.locator('.searchstax-search-result-ribbon:visible').first();
  const shapes = {};
  for (const option of ['ribbon', 'square', 'pill']) {
    await shape.selectOption(option);
    await ribbon.scrollIntoViewIfNeeded();
    shapes[option] = await ribbon.evaluate(el => {
      const { left, right, top, height } = el.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(el);
      const containsPoint = (x, y) => document.elementsFromPoint(x, y).some(node => el.contains(node));
      return {
        textStart: range.getBoundingClientRect().left - left,
        rightMiddle: containsPoint(right - 2, top + height / 2),
        leftCorner: containsPoint(left + 1, top + 1),
      };
    });
  }
  assert.equal(shapes.ribbon.textStart, shapes.square.textStart, 'Ribbon and Square align their text.');
  assert.deepEqual([shapes.ribbon, shapes.square, shapes.pill].map(s => [s.rightMiddle, s.leftCorner]),
    [[false, true], [true, true], [true, false]], 'The ribbon has a notch, the square has straight edges, and the pill has rounded ends.');
  await shape.selectOption(finalShape);
  const ribbonColor = () => ribbon.evaluate(el => getComputedStyle(el).backgroundColor);
  assert.equal(await inherit.isChecked(), true);
  assert.equal(await custom.isVisible(), false);
  await accent.fill('#345678');
  assert.equal(await ribbonColor(), 'rgb(52, 86, 120)');
  await inherit.uncheck();
  assert.equal(await custom.inputValue(), '#345678');
  await custom.fill('#155940');
  await accent.fill('#263f58');
  assert.equal(await ribbonColor(), 'rgb(21, 89, 64)');
  await inherit.press('Space');
  assert.equal(await custom.isVisible(), false);
  assert.equal(await ribbonColor(), 'rgb(38, 63, 88)');
  await inherit.press('Space');
  assert.equal(await custom.inputValue(), '#155940');
  await page.getByLabel('Metadata field').selectOption('owner_s');
  await page.getByLabel('Metadata label').fill('Team & area');
  await openSettings(page, 'Features', 'Advanced Options');
  await page.getByLabel('Thumbnail placement').selectOption('leading');
  await page.getByLabel('Metadata order').selectOption('level_s');
  await page.getByRole('button', { name: 'Move earlier' }).click();
  assert.equal(await page.getByRole('button', { name: 'Move earlier' }).isDisabled(), true);
}

async function verifyPersistence(page, mode) {
  await page.reload();
  await verify(page, mode, true);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
  await page.getByRole('button', { name: 'Share Design', exact: true }).click();
  await page.getByRole('button', { name: 'Copy design link' }).click();
  const url = await page.getByLabel('Design link', { exact: true }).inputValue();
  assert.ok(new URL(url).searchParams.has('lab_card_metadata'));
  await page.goto(url);
  await verify(page, mode, true);
  await openSettings(page, 'Appearance', 'Result cards');
  assert.equal(await page.getByRole('checkbox', { name: 'Use accent color' }).isChecked(), false);
  assert.equal(await page.getByLabel('Custom ribbon color').inputValue(), '#155940');
}

async function checkConnectedPreview(page) {
  const target = 'https://review.searchstax.com/card-fixture/emselect';
  let searches = 0;
  await page.route(target + '*', route => {
    searches++;
    return route.fulfill({ json: fixture(new URL(route.request().url())) });
  });
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Start designing' }).click();
  await page.getByRole('button', { name: 'Preview with your Search App' }).click();
  await page.locator('#lab-customer-endpoint').fill(target);
  await page.locator('#lab-customer-token').fill('local-fixture');
  await page.locator('#lab-customer-query').fill('rehabilitation');
  await page.locator('[data-customer-options] summary').click();
  await page.locator('#lab-customer-profile').fill('SearchLabBuild');
  await page.locator('#lab-customer-language').fill('en');
  await page.locator('[data-customer-submit]').click();
  await verify(page, 'connected');
  const before = searches;
  await customize(page, 'pill');
  await verify(page, 'connected', true);
  assert.equal(searches, before, 'Editing a card should reuse the current response.');
}

async function main() {
  assert.ok(localQA && !liveQA);
  if (!starter && !process.env.QA_ARTIFACT_DIR) {
    process.env.SEARCH_LAB_BASE_URL = baseURL;
    return checkDownloads('result-cards', __filename, modes.map(mode => [mode, { QA_CARD_MODE: mode }]), configureRecording);
  }
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const mode of starter ? [process.env.QA_CARD_MODE] : modes) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
      await page.route(endpoint + '*', route => route.fulfill({ json: fixture(new URL(route.request().url())) }));
      await page.route(photo, route => route.fulfill({ path: path.join(__dirname, '../../assets/demo-thumbnails/rehabilitation-design.jpg') }));
      await page.route(missingPhoto, route => route.fulfill({ status: 404, body: '' }));
      await page.goto(starter || baseURL);
      if (!starter) {
        await page.getByRole('link', { name: 'Start designing' }).click();
        if (mode === 'profile') {
          await page.getByRole('tab', { name: 'Features' }).click();
          await page.getByText('Advanced Options', { exact: true }).click();
          await page.getByLabel('Show profile tabs').check();
        }
      }
      await verify(page, mode, Boolean(starter));
      if (!starter) {
        await customize(page, mode === 'ordinary' ? 'ribbon' : 'pill');
        await verify(page, mode, true);
        await verifyPersistence(page, mode);
        if (mode === 'ordinary') {
          await page.getByRole('button', { name: 'Reset design', exact: true }).click();
          await verify(page, mode);
          await page.getByRole('button', { name: 'Undo reset' }).click();
          await verify(page, mode, true);
        }
        if (mode === 'profile') {
          const panel = page.locator('#lab-experiences');
          await panel.getByRole('tab', { name: 'Main Profile', exact: true }).click();
          await panel.getByText('Owner: Library', { exact: true }).first().waitFor();
          assert.equal(await panel.getByText('Team & area: Library', { exact: true }).count(), 0);
          await panel.getByRole('tab', { name: 'SearchLabBuild', exact: true }).click();
          await verify(page, mode, true);
        }
        await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
        for (const kit of ['javascript', 'react', 'vue', 'angular']) {
          const dir = path.join(process.env.QA_ARTIFACT_DIR, mode, kit);
          await fs.mkdir(dir, { recursive: true });
          const [file] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + kit + '"]').click()]);
          await file.saveAs(path.join(dir, 'starter.zip'));
        }
      }
      if (!starter && mode === 'ordinary') await checkConnectedPreview(page);
      await page.close();
    }
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
