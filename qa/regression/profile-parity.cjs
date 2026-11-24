const fs = require('node:fs');
const path = require('node:path');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium, webkit, localQA } = require('./runtime.cjs');

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

async function checkBuiltInFeatures(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
  const url = new URL(baseURL);
  url.hash = 'lab-design';
  const endpoint = 'https://review.searchstax.com/qa/emselect';
  const featureHost = new URL(endpoint).origin;
  let snapshot;
  const requested = [];
  const searches = [];
  let releaseSnapshot;
  try {
    await page.route(u => u.pathname === url.pathname && u.origin === url.origin, async route => {
      const html = await (await route.fetch()).text();
      const body = html.replace(/data-search-url="[^"]+"/, 'data-search-url="' + endpoint + '"')
        .replace(/data-search-credential="[^"]+"/, 'data-search-credential="test-only" data-discovery-key="test-only"')
        .replace('data-before-profile=', 'data-answer-endpoint="' + featureHost + '/api/v1/answer" data-related-endpoint="' + featureHost + '/qa/related-search" data-before-profile=');
      await route.fulfill({ contentType: 'text/html', body });
    });
    await page.route('**/config/searchlabdemo.json', async route => {
      if (releaseSnapshot) await releaseSnapshot;
      await route.fulfill({ json: snapshot });
    });
    await page.route(featureHost + '/**', async route => {
      const u = new URL(route.request().url());
      if (u.pathname.endsWith('/emselect')) {
        const params = Object.fromEntries(u.searchParams);
        searches.push([params.model, params.language, params.q]);
        const fields = [{ name: 'heading', result_card: 'title' }];
        const metadata = params.q === 'missing fields' ? {} : { results: params.q === 'empty fields' ? [] : fields, facets: [] };
        return route.fulfill({ json: { responseHeader: { params: { ...params, uniqueId: 'id', hl: true } },
          response: { start: 0, numFound: 1, docs: [{ id: 'one', heading: 'Campus' }] }, metadata,
          highlighting: { one: { heading: ['<em>Campus</em>'] } }, facet_counts: { facet_fields: {} } } });
      }
      requested.push(u.pathname);
      if (u.pathname.endsWith('/answer')) assert.equal(u.searchParams.get('model'), 'Main Profile');
      else assert.deepEqual([...u.searchParams.keys()].sort(), ['language', 'search']);
      assert.equal(u.searchParams.get('language'), 'en');
      if (u.pathname === '/api/v1/answer') return route.fulfill({ contentType: 'text/event-stream', body: 'data: App answer\n\ndata: CLOSE\n\n' });
      assert.equal(u.pathname, '/qa/related-search');
      return route.fulfill({ json: { response: { docs: [{ related_search: 'App suggestion' }] } } });
    });
    const summary = page.locator('[data-app-settings-summary]');
    const live = page.locator('[data-single-experience]');
    for (const [relatedSearches, smartAnswers, wrongApp] of [[false, false], [true, false], [false, true], [true, true], [true, true, true]]) {
      requested.length = 0;
      snapshot = { endpoint: wrongApp ? endpoint + '-other' : endpoint, entitlements: { relatedSearches: true, smartAnswers: true },
        relatedSearchesByLanguage: { en: relatedSearches }, profiles: [{ language: 'en', profile: 'Main Profile', smartAnswers }] };
      await page.goto('about:blank');
      await page.goto(url.href);
      await page.locator('[data-lab-summary]').filter({ hasText: /results? for/ }).waitFor();
      await summary.filter({ hasText: 'Related Searches — ' + (wrongApp ? 'Unknown' : relatedSearches ? 'On' : 'Off') }).waitFor();
      assert.match(await summary.innerText(), new RegExp('Smart Answers — ' + (wrongApp ? 'Unknown' : smartAnswers ? 'On' : 'Off')));
      if (relatedSearches && !wrongApp) await live.getByRole('button', { name: 'App suggestion' }).waitFor();
      if (smartAnswers && !wrongApp) await live.getByText('App answer', { exact: true }).waitFor();
      assert.equal(await live.locator('.search-related-terms:visible').count(), Number(relatedSearches && !wrongApp));
      assert.equal(await live.locator('[data-customer-answer]:visible').count(), Number(smartAnswers && !wrongApp));
      assert.equal(await live.locator('.smart-answers-sample').count(), 0);
      assert.equal(requested.includes('/qa/related-search'), Boolean(relatedSearches && !wrongApp));
      assert.equal(requested.includes('/api/v1/answer'), Boolean(smartAnswers && !wrongApp));
      if (relatedSearches && smartAnswers && !wrongApp) {
        const toggle = page.getByLabel('Show profile tabs');
        await page.locator('#lab-related-toggle').locator('xpath=ancestor::details[1]').locator('summary').click();
        await page.getByRole('button', { name: 'Change related search placement' }).click();
        assert.equal(await page.locator('#lab-related-placement').evaluate(el => el === document.activeElement && el.closest('details').open), true);
        await toggle.check();
        const fixture = page.locator('#lab-experiences');
        await fixture.getByRole('tab', { name: 'Main Profile', exact: true }).waitFor();
        await fixture.getByText('App answer', { exact: true }).waitFor();
        assert.equal(await fixture.locator('.smart-answers-sample:visible').count(), 0);
        assert.equal(await page.locator('#lab-advanced #lab-related-placement').count(), 1);
        await page.getByLabel('Preview source').selectOption('fictional');
        await fixture.getByRole('button', { name: 'physical therapy' }).waitFor();
        await fixture.locator('.smart-answers-sample summary').waitFor();
        assert.equal(await live.locator('.search-related-terms').count(), 0);
        assert.equal(await live.locator('[data-customer-answer-content]').textContent(), '');
        await page.getByLabel('Preview source').selectOption('app');
        await toggle.uncheck();
        await live.getByRole('button', { name: 'App suggestion' }).waitFor();
        await live.getByText('App answer', { exact: true }).waitFor();
        assert.equal(await fixture.isVisible(), false);
      }
    }
    snapshot = { endpoint, entitlements: { smartAnswers: true, relatedSearches: true }, relatedSearchesByLanguage: { en: false },
      profiles: [{ language: 'en', profile: 'Main Profile', highlighting: false }, { language: 'en', profile: 'Second', highlighting: true }] };
    let finishSnapshot;
    releaseSnapshot = new Promise(resolve => { finishSnapshot = resolve; });
    await page.goto('about:blank');
    const delayedRequest = page.waitForRequest('**/config/searchlabdemo.json');
    await page.goto(url.href, { waitUntil: 'domcontentloaded' });
    const cards = page.locator('#lab-results-list');
    await delayedRequest;
    await cards.locator('mark').waitFor();
    assert.match(await summary.innerText(), /Hit highlighting — On/);
    const snapshotResponse = page.waitForResponse('**/config/searchlabdemo.json');
    finishSnapshot();
    assert.ok((await snapshotResponse).ok());
    await summary.filter({ hasText: 'Hit highlighting — Off' }).waitFor();
    assert.equal(await cards.locator('mark').count(), 0);
    const query = page.locator('#lab-query');
    for (const [term, notice] of [['missing fields', 'Results Fields are unknown for this profile.'],
      ['empty fields', 'No configured Results Fields have a displayable value on this page.']]) {
      await query.fill(term);
      await query.press('Enter');
      await page.locator('[data-lab-summary]').filter({ hasText: notice }).waitFor();
      assert.equal(await cards.locator('article').count(), 0);
      assert.equal(await live.getByRole('button', { name: 'Retry search' }).count(), 0);
    }
    await query.fill('normal');
    await query.press('Enter');
    await cards.getByText('Campus', { exact: true }).waitFor();
    assert.doesNotMatch(await page.locator('[data-lab-summary]').innerText(), /unknown|displayable/);
    await page.locator('#lab-advanced > summary').click();
    await page.getByLabel('Show profile tabs').check();
    const panel = page.locator('#lab-experiences');
    assert.deepEqual(await panel.getByRole('tab').allTextContents(), ['Main Profile', 'Second']);
    await panel.getByRole('tab', { name: 'Second', exact: true }).click();
    await panel.locator('li mark').waitFor();
    assert.deepEqual(searches.at(-1), ['Second', 'en', 'normal']);
    assert.match(await summary.innerText(), /Hit highlighting — On/);
    await page.getByLabel('Preview source').selectOption('fictional');
    assert.deepEqual(await panel.getByRole('tab').allTextContents(), ['Programs', 'Locations']);
    await page.getByLabel('Preview source').selectOption('app');
    await panel.getByRole('heading', { name: 'Campus' }).waitFor();
    assert.deepEqual(searches.at(-1), ['Main Profile', 'en', 'normal']);
    assert.equal(await panel.locator('li mark, .smart-answers-sample:visible').count(), 0);
    const olderLink = new URL(url);
    olderLink.search = new URLSearchParams({ lab_layout: 'list', lab_font: 'georgia', lab_color: '123456',
      lab_filters: 'on', lab_profile_tabs: 'on' });
    await page.goto(olderLink.href);
    await panel.getByRole('tab', { name: 'Main Profile', exact: true }).waitFor();
    assert.equal(await page.getByLabel('Preview source').inputValue(), 'app');
    console.log('Passed missing and empty field mappings, delayed highlighting settings and live/fictional source switching');
    console.log('Passed independent live service gates and endpoint-mismatched metadata');
  } finally { await page.close(); }
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
  await panel.getByRole('link', { name: /^Orthopedics/ }).first().waitFor();
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
  await panel.locator('[data-exp-summary]').filter({ hasText: 'unmatched-123' }).waitFor();
  console.log('Preserved submitted query, draft and zero matches, starting with', first);
}

function designURL(mode) {
  const [tabs, language] = designs[mode];
  const url = new URL(baseURL);
  url.hash = 'lab-design';
  url.search = new URLSearchParams({
    lab_source: 'fictional', lab_profile_tabs: tabs, lab_languages: language, lab_layout: 'list', lab_font: 'georgia',
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

  await submit(panel, 'nursing');
  await panel.getByText('Open for enrollment: true', { exact: true }).waitFor();
  assert.equal(await panel.locator('time').getAttribute('datetime'), '2026-03-16');
  await input.fill('reh');
  await panel.getByRole('option', { name: 'rehabilitation', exact: true }).waitFor();
  await input.press('ArrowDown');
  await input.press('Enter');
  const list = visibleList(panel);
  await list.first().waitFor();
  assert.equal(await input.inputValue(), 'rehabilitation');
  const ribbon = panel.locator('.searchstax-search-result-ribbon').first();
  assert.equal(await ribbon.innerText(), 'Programs');
  assert.ok(await ribbon.evaluate(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'));
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
  assert.deepEqual((await panel.locator('time').allTextContents()).sort(), ['2024-09-15', '2026-09-15']);
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
      if (localQA) await checkBuiltInFeatures(browser);
      await preserve(page, 'Show profile tabs', 'Show language picker');
      await preserve(page, 'Show language picker', 'Show profile tabs');
      const ordinaryURL = new URL(designURL('both'));
      ordinaryURL.searchParams.set('lab_source', 'app');
      ordinaryURL.searchParams.set('lab_profile_tabs', 'off');
      ordinaryURL.searchParams.set('lab_languages', 'off');
      await page.goto(ordinaryURL.href);
      const ordinarySort = page.locator('#lab-sort-order');
      await ordinarySort.waitFor();
      await checkSelectStyle(ordinarySort, 36);
      for (const mode of localQA ? Object.keys(designs) : []) {
        await page.goto(designURL(mode));
        await checkFeatures(page, mode);
        if (process.env.QA_PROFILE_EXPORT_DIR) {
          if (mode !== 'tabs') await page.locator('[data-exp-language] select').selectOption('en');
          await submit(page.locator('#lab-experiences'), 'orthopedics');
          await saveStarters(page, mode, process.env.QA_PROFILE_EXPORT_DIR);
        }
        console.log('Passed feature and appearance settings in', mode);
      }
      if (localQA) await editFeatures(page);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
