const fs = require('node:fs');
const path = require('node:path');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium, webkit } = require('./runtime.cjs');

const designs = { tabs: ['on', 'off'], language: ['off', 'on'], both: ['on', 'on'] };
const formats = ['javascript', 'react', 'vue', 'angular'];
const source = process.env.QA_STARTER_URL;
const visibleList = panel => panel.locator('.experience-results li a');

async function submit(panel, term) {
  const input = panel.locator('input[type=search]');
  await input.fill(term);
  await input.press('Enter');
  await panel.locator('[data-exp-summary]').filter({ hasText: '“' + term + '”' }).waitFor();
}

async function preserve(page, first, second) {
  await page.goto('about:blank');
  await page.goto(baseURL + '#lab-design');
  const ordinary = page.locator('#lab-query');
  await ordinary.fill('orthopedics');
  await ordinary.press('Enter');
  await page.locator('[data-lab-summary]').filter({ hasText: /results for “orthopedics”/ }).waitFor();
  await ordinary.fill('unfinished spelling');
  await page.locator('#lab-advanced > summary').click();
  await page.getByLabel(first).check();
  const panel = page.locator('#lab-experiences');
  const input = panel.locator('input[type=search]');
  await panel.getByRole('link', { name: 'Orthopedics', exact: true }).waitFor();
  assert.equal(await input.inputValue(), 'unfinished spelling');
  await page.getByLabel(second).check();
  assert.equal(await input.inputValue(), 'unfinished spelling');
  await page.getByLabel(first).uncheck();
  assert.equal(await input.inputValue(), 'unfinished spelling');
  await submit(panel, 'unmatched-123');
  await input.fill('the next draft');
  await page.getByLabel(second).uncheck();
  assert.equal(await ordinary.inputValue(), 'the next draft');
  await page.locator('[data-lab-summary]').filter({ hasText: /0 results for “unmatched-123”/ }).waitFor();
  await page.getByLabel(first).check();
  assert.equal(await input.inputValue(), 'the next draft');
  assert.match(await panel.locator('[data-exp-summary]').innerText(), /unmatched-123/);
  console.log('Preserved submitted query, draft and zero matches, starting with', first);
}

function designURL(mode) {
  const [tabs, language] = designs[mode];
  const url = new URL(baseURL);
  url.hash = 'lab-design';
  url.search = new URLSearchParams({
    lab_profile_tabs: tabs, lab_languages: language, lab_layout: 'list', lab_font: 'georgia',
    lab_corners: 'rounded', lab_background: '21354b',
    lab_page_size: '5', lab_sorting: 'on', lab_promotions: 'both', lab_suggestions: 'on',
    lab_thumbnails: 'on', lab_underline: 'on', lab_dividers: 'off', lab_spacing: 'roomy',
    lab_filter_placement: 'top', lab_top_filters: 'row', lab_related: 'above',
    lab_field_text: 'Find a clinic', lab_button_text: 'Find pages', lab_no_results_text: 'Try another clinic.',
  });
  return url.href;
}

async function checkSelectStyle(select, height) {
  const style = await select.evaluate(el => {
    const css = getComputedStyle(el);
    return { height: el.offsetHeight, radius: css.borderRadius, padding: css.padding,
      font: css.fontFamily.split(',')[0], background: css.backgroundColor, color: css.color };
  });
  assert.deepEqual(style, { height, radius: '14px', padding: '4px 28px 4px 8px', font: 'Georgia',
    background: 'rgb(33, 53, 75)', color: 'rgb(255, 255, 255)' });
}

async function checkFeatures(page, mode) {
  const panel = page.locator('.lab-experiences:visible');
  const input = panel.locator('input[type=search]');
  const language = panel.locator('[data-exp-language] select');
  assert.equal(await language.isVisible(), mode !== 'tabs');
  assert.equal(await panel.getByRole('tablist').isVisible(), mode !== 'language');
  if (mode !== 'language') assert.deepEqual(await panel.getByRole('tab').allTextContents(), ['Programs', 'Locations']);
  const sort = panel.locator('[data-exp-sort] select');
  await sort.waitFor();
  await checkSelectStyle(sort, 36);
  if (mode !== 'tabs') await checkSelectStyle(language, 44);
  const summaryBox = await panel.locator('[data-exp-summary]').boundingBox();
  const sortBox = await sort.boundingBox();
  assert.ok(summaryBox.y < sortBox.y + sortBox.height && sortBox.y < summaryBox.y + summaryBox.height,
    'Summary and sort share the desktop results header');
  assert.equal(await input.getAttribute('placeholder'), 'Find a clinic');
  assert.equal(await panel.locator('button[type=submit]').innerText(), 'Find pages');

  await input.fill('reh');
  await panel.getByRole('option', { name: 'rehabilitation', exact: true }).waitFor();
  await input.press('ArrowDown');
  await input.press('Enter');
  const list = visibleList(panel);
  await list.first().waitFor();
  assert.equal(await input.inputValue(), 'rehabilitation');
  const image = panel.locator('.mapped-result-thumbnail:visible').first();
  await image.waitFor();
  assert.ok(await image.evaluate(el => el.decode().then(() => el.naturalWidth > 0)));
  const related = panel.getByRole('region', { name: 'Related searches' });
  const link = related.getByRole('button', { name: 'physical therapy' });
  assert.ok(await link.isVisible());
  assert.ok(await related.evaluate(el => Boolean(el.compareDocumentPosition(el.parentElement.querySelector('#lab-exp-results')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  await link.click();
  assert.equal(await input.inputValue(), 'physical therapy');
  await panel.locator('.smart-answers-sample summary').click();
  assert.ok(await panel.locator('.smart-answers-sample__card a').isVisible());
  const style = await list.first().evaluate(el => ({
    title: getComputedStyle(el).textDecorationLine, font: getComputedStyle(el).fontFamily,
    border: getComputedStyle(el.closest('li')).borderBottomColor,
  }));
  assert.equal(style.title, 'underline');
  assert.match(style.font, /Georgia/i);
  assert.equal(style.border, 'rgba(0, 0, 0, 0)');
  assert.equal(await panel.getAttribute('data-filter-style'), 'row');

  await submit(panel, 'campus flu clinic');
  await panel.getByText('Sample indexed promotion', { exact: true }).waitFor();
  assert.match(await list.first().innerText(), /2026/);
  assert.ok(await panel.getByRole('link', { name: /fictional flu shot appointment/ }).isVisible());
  await sort.selectOption('url asc');
  assert.match(await list.first().innerText(), /2024/);
  await sort.selectOption('url desc');
  assert.match(await list.first().innerText(), /2026/);
  await submit(panel, 'zxq-no-matches');
  await panel.getByText('Try another clinic.', { exact: true }).waitFor();
  if (mode !== 'tabs') {
    await language.selectOption('es');
    if (mode === 'both') assert.deepEqual(await panel.getByRole('tab').allTextContents(), ['Programas', 'Ubicaciones']);
    assert.equal(await input.inputValue(), 'zxq-no-matches');
    assert.equal(await input.getAttribute('placeholder'), 'Find a clinic');
    assert.equal(await panel.locator('button[type=submit]').innerText(), 'Find pages');
    await submit(panel, 'rehabilitación');
    await panel.getByRole('button', { name: 'terapia física' }).waitFor();
  }
}

async function saveStarters(page, mode, dir) {
  await page.getByRole('button', { name: 'Get starter code' }).click();
  for (const format of formats) {
    const [file] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + format + '"]').click()]);
    const root = path.resolve(dir, mode, format);
    for (const [name, bytes] of Object.entries(unzipSync(fs.readFileSync(await file.path())))) {
      const target = path.resolve(root, name);
      assert.ok(target.startsWith(root + path.sep));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, bytes);
    }
  }
}

async function editFeatures(page) {
  await page.goto('about:blank');
  await page.goto(designURL('both'));
  const panel = page.locator('#lab-experiences');
  const control = async id => {
    const field = page.locator('#lab-' + id);
    const group = field.locator('xpath=ancestor::details[1]');
    if (await group.getAttribute('open') === null) await group.locator('summary').first().click();
    return field;
  };
  await submit(panel, 'campus flu clinic');
  await (await control('sample-promotions')).selectOption('off');
  assert.equal(await panel.getByText('Sample indexed promotion', { exact: true }).isVisible(), false);
  assert.equal(await panel.getByRole('link', { name: /fictional flu shot appointment/ }).isVisible(), false);
  await (await control('smart-answers-sample')).uncheck();
  assert.equal(await panel.locator('.smart-answers-sample').isVisible(), false);
  await (await control('sorting')).uncheck();
  assert.equal(await panel.locator('[data-exp-sort]').isVisible(), false);
  await submit(panel, 'rehabilitation');
  await panel.locator('.mapped-result-thumbnail:visible').first().waitFor();
  assert.equal(await page.getByLabel('Show sample thumbnails').isVisible(), false);
  await (await control('descriptions')).uncheck();
  assert.equal(await panel.locator('.search-lab__result-description:visible').count(), 0);
  assert.ok(await panel.locator('.mapped-result-thumbnail:visible').count());
  await (await control('related-toggle')).uncheck();
  assert.equal(await panel.getByRole('region', { name: 'Related searches' }).isVisible(), false);
  await (await control('suggestions')).uncheck();
  assert.equal(await panel.locator('input[type=search]').getAttribute('aria-autocomplete'), null);
  const buttonText = await control('button-text');
  await buttonText.fill('Search again');
  await buttonText.press('Tab');
  assert.equal(await panel.locator('button[type=submit]').innerText(), 'Search again');
  await (await control('sorting')).check();
  await page.setViewportSize({ width: 320, height: 844 });
  const previewButton = page.getByRole('button', { name: 'Preview', exact: true });
  if (await previewButton.isVisible()) await previewButton.click();
  await checkSelectStyle(panel.locator('[data-exp-sort] select'), 36);
  await checkSelectStyle(panel.locator('[data-exp-language] select'), 44);
  assert.ok(await panel.evaluate(el => el.scrollWidth <= el.clientWidth), 'Controls fit at 320px');
  const filterToggle = panel.locator('[data-exp-filter-toggle]');
  assert.equal(await filterToggle.evaluate(el => getComputedStyle(el).borderRadius), '14px');
  await filterToggle.click();
  assert.equal(await filterToggle.getAttribute('aria-expanded'), 'true');
  assert.ok(await panel.locator('[data-exp-facets] input').first().isVisible());
  assert.equal(await panel.locator('[data-exp-facets] input').first().evaluate(el => el.offsetWidth), 24);
  await filterToggle.click();
  assert.equal(await panel.locator('[data-exp-facets] input').first().isVisible(), false);
  console.log('Passed live editor changes and phone filters');
}

async function run() {
  const browser = process.env.QA_BROWSER === 'webkit' ? await webkit.launch() : await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    if (source) {
      await page.goto(source);
      await page.locator('.lab-experiences').getByRole('link', { name: 'Orthopedics', exact: true }).waitFor();
      assert.equal(await page.locator('.lab-experiences input[type=search]').inputValue(), 'orthopedics');
      await checkFeatures(page, process.env.QA_PROFILE_MODE || 'both');
    } else {
      await preserve(page, 'Show profile tabs', 'Show language picker');
      await preserve(page, 'Show language picker', 'Show profile tabs');
      const ordinaryURL = new URL(designURL('both'));
      ordinaryURL.searchParams.set('lab_profile_tabs', 'off');
      ordinaryURL.searchParams.set('lab_languages', 'off');
      await page.goto(ordinaryURL.href);
      const ordinarySort = page.locator('#lab-sort-order');
      await ordinarySort.waitFor();
      await checkSelectStyle(ordinarySort, 36);
      for (const mode of Object.keys(designs)) {
        await page.goto(designURL(mode));
        await checkFeatures(page, mode);
        if (process.env.QA_PROFILE_EXPORT_DIR) {
          if (mode !== 'tabs') await page.locator('[data-exp-language] select').selectOption('en');
          await submit(page.locator('#lab-experiences'), 'orthopedics');
          await saveStarters(page, mode, process.env.QA_PROFILE_EXPORT_DIR);
        }
        console.log('Passed feature and appearance settings in', mode);
      }
      await editFeatures(page);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
