const fs = require('node:fs');
const path = require('node:path');
const snapshot = path.join(__dirname, '../../public/examples/search-lab-configuration.json');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium, webkit } = require('./runtime.cjs');

async function run() {
  const browser = process.env.QA_BROWSER === 'webkit' ? await webkit.launch() : await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(baseURL).origin ? route.continue() : route.abort());
    const origin = 'https://review.searchstax.com';
    const query = 'qa-private-query';
    const selectToken = 'qa-select-sentinel';
    const discoveryToken = 'qa-related-sentinel';
    const requests = [];
    await page.route(origin + '/**', async route => {
      const url = new URL(route.request().url());
      const kind = url.pathname.split('/').pop();
      const term = url.searchParams.get('q') || url.searchParams.get('search');
      const lang = url.searchParams.get('language');
      const profile = url.searchParams.get('model');
      requests.push({ kind, term, lang, profile, sort: url.searchParams.get('sort') });
      if (kind === 'emselect') {
        const directory = profile === 'Directory';
        const title = lang + '/' + profile + ' ' + term;
        const doc = { uid_s: 'first', caption_s: title, address_s: 'https://example.org/result', image_s: 'https://example.org/thumb.jpg',
          staff_s: title, topics_ss: ['One', 'Two'], category_s: 'Community program', published_dt: '2026-09-15',
          path_ss: ['Education', 'Programs'], openForEnrollment_b: false, openings_i: 0,
          private_search_t: 'never display this', '[elevated]': true };
        return route.fulfill({ json: {
          response: { numFound: 1, docs: [doc] }, responseHeader: { params: { uniqueId: 'uid_s', qf: 'private_search_t' } },
          highlighting: { first: { caption_s: ['<em>' + title + '</em>'], staff_s: ['<em>Wrong highlight</em>'] } },
          externalLinks: [{ name: 'Featured fixture', url: 'https://example.org/featured' }],
          metadata: { results: directory ? [{ name: 'staff_s', result_card: 'title' }, { name: 'missing_link', result_card: 'url' }, { name: 'missing_photo', result_card: 'thumbnail' }] : [
            { name: 'caption_s', result_card: 'title' }, { name: 'address_s', result_card: 'url' },
            { name: 'image_s', result_card: 'thumbnail' }, { name: 'topics_ss', result_card: '', title: 'Topics' },
            { name: 'category_s', result_card: 'ribbon' }, { name: 'published_dt', result_card: 'date' },
            { name: 'path_ss', result_card: 'paths' }, { name: 'openForEnrollment_b', result_card: '', title: 'Enrollment status' },
            { name: 'openings_i', title: 'Openings' },
          ], facets: [{ name: 'type', label: 'Content type' }], sorts: [{ name: 'title', order: 'asc', label: 'Title' }] },
          facet_counts: { facet_fields: { type: ['Library', 1] } },
        } });
      }
      if (kind === 'emsuggest') return route.fulfill({ json: { suggest: { terms: { prefix: { suggestions: [{ term: 'Suggested ' + term }] } } } } });
      if (kind === 'related-search') {
        assert.deepEqual([...url.searchParams.keys()].sort(), ['language', 'search']);
        return route.fulfill({ json: { response: { docs: [{ related_search: 'Related ' + lang + ' ' + term }] } } });
      }
      if (kind === 'answer') return route.fulfill({ contentType: 'text/event-stream', body: 'data: Answer ' + lang + '/' + profile + ' ' + term + '\n\ndata: CLOSE\n\n' });
      return route.abort();
    });
    // Connect while SearchLabDemo is still waiting for its first response.
    await page.route(url => url.origin !== origin && url.pathname.endsWith('/emselect'), () => {});
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Start designing' }).click();
    await page.getByText('Advanced Options', { exact: true }).click();
    assert.equal(await page.locator('#lab-advanced #lab-page-size').count(), 1);
    await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await page.locator('[data-customer-options] summary').click();
    const fields = {
      'lab-customer-endpoint': origin + '/qa/emselect', 'lab-customer-token': selectToken,
      'lab-customer-query': query, 'lab-customer-profile': 'Main', 'lab-customer-language': 'en',
      'lab-customer-answer-endpoint': origin + '/api/v1/answer', 'lab-customer-suggest-endpoint': origin + '/qa/emsuggest',
      'lab-related-endpoint': origin + '/qa/related-search', 'lab-discovery-key': discoveryToken,
    };
    for (const [id, value] of Object.entries(fields)) await page.locator('#' + id).fill(value);
    await page.locator('#lab-app-configuration').setInputFiles(snapshot);
    await page.locator('[data-customer-submit]').click();
    const single = page.locator('[data-customer-grid]');
    async function checkMappedFields(container) {
      const ribbon = container.locator('.searchstax-search-result-ribbon');
      assert.equal(await ribbon.innerText(), 'Community program');
      assert.ok(await ribbon.evaluate(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'));
      assert.equal(await container.locator('time').getAttribute('datetime'), '2026-09-15');
      assert.equal(await container.locator('.mapped-result-paths').innerText(), 'Education / Programs');
      await container.getByText('Enrollment status: false', { exact: true }).waitFor();
      await container.getByText('Openings: 0', { exact: true }).waitFor();
    }
    await single.getByRole('link', { name: 'en/Main ' + query }).waitFor();
    assert.equal(await single.locator('mark').innerText(), 'en/Main ' + query);
    assert.equal(await single.locator('img').getAttribute('src'), 'https://example.org/thumb.jpg');
    await single.getByText('Topics: One, Two').waitFor();
    await checkMappedFields(single);
    assert.doesNotMatch(await single.innerText(), /never display this/);
    await page.getByLabel('Show profile tabs').check();
    const panel = page.locator('#lab-experiences');
    const tabs = panel.getByRole('tab');
    const choices = page.locator('[data-profile-choices] label');
    const picker = panel.locator('[data-exp-language] select');
    await panel.getByRole('link', { name: 'en/Main ' + query }).waitFor();
    await checkMappedFields(panel);
    assert.equal(await page.locator('[data-lab-demo-output]').getAttribute('data-searching'), null);
    assert.equal(await panel.locator('[data-exp-sort] select option:checked').textContent(), 'Relevance');
    assert.equal(await page.getByLabel('Show language picker').isChecked(), false);
    assert.equal(await panel.locator('[data-exp-language] select').isVisible(), false);
    assert.deepEqual(await tabs.allTextContents(), ['Main', 'Directory']);
    assert.deepEqual((await choices.allTextContents()).map(text => text.trim()), ['Main (en)', 'Directory (en)']);
    await page.getByLabel('Show language picker').check();
    await panel.getByRole('tab', { name: 'Directory', exact: true }).click();
    await panel.locator('li h4').filter({ hasText: 'en/Directory ' + query }).waitFor();
    assert.equal(await panel.locator('li a, li img, li mark, [data-customer-answer]:visible').count(), 0);
    assert.equal(await panel.locator('.searchstax-search-result-ribbon, time, .mapped-result-paths').count(), 0);
    assert.doesNotMatch(await panel.innerText(), /Enrollment status|Openings/);
    await panel.getByRole('button', { name: 'Related en ' + query }).waitFor();
    assert.equal(requests.some(r => r.profile === 'Directory' && r.kind === 'answer'), false);
    // Change profile again before the previous profile's search can complete.
    let releaseSlow;
    let startedSlow;
    const pendingSearch = new Promise(resolve => { startedSlow = resolve; });
    const releaseSearch = new Promise(resolve => { releaseSlow = resolve; });
    await page.route(url => url.origin === origin && url.searchParams.get('q') === 'slow-switch' && url.searchParams.get('model') === 'Directory',
      async route => {
        startedSlow();
        await releaseSearch;
        await route.fulfill({ json: { response: { numFound: 1, docs: [{ title: 'Late Directory result' }] },
          metadata: { results: [{ name: 'title', result_card: 'title' }] } } });
      });
    const profileQuery = panel.locator('input[type=search]');
    await profileQuery.fill('slow-switch');
    await profileQuery.press('Enter');
    await pendingSearch;
    await panel.getByRole('tab', { name: 'Main', exact: true }).click();
    await panel.getByRole('link', { name: 'en/Main slow-switch' }).waitFor();
    releaseSlow();
    await profileQuery.fill(query);
    await profileQuery.press('Enter');
    await panel.getByRole('link', { name: 'en/Main ' + query }).waitFor();
    assert.doesNotMatch(await panel.innerText(), /Late Directory result/);
    await page.getByRole('checkbox', { name: 'Directory (en)', exact: true }).uncheck();
    assert.equal(await panel.getByRole('tab', { name: 'Directory', exact: true }).count(), 0);
    await panel.locator('[data-exp-language] select').selectOption('es');
    assert.deepEqual(await tabs.allTextContents(), ['Directorio']);
    assert.deepEqual((await choices.allTextContents()).map(text => text.trim()), ['Directorio (es)']);
    await panel.getByRole('link', { name: 'es/Directorio ' + query }).waitFor();
    await panel.getByRole('button', { name: 'Related es ' + query }).waitFor();
    await panel.locator('[data-customer-answer-content]').filter({ hasText: 'Answer es/Directorio ' + query }).waitFor();
    await panel.getByRole('link', { name: 'Featured fixture' }).waitFor();
    await panel.getByText('Promocionado', { exact: true }).waitFor();
    await page.getByLabel('Show language picker').uncheck();
    await panel.getByRole('link', { name: 'en/Main ' + query }).waitFor();
    assert.deepEqual(await tabs.allTextContents(), ['Main']);
    assert.equal(await page.getByLabel('Directory (en)', { exact: true }).isChecked(), false);
    await page.getByLabel('Main (en)', { exact: true }).uncheck();
    await panel.getByText('No profiles are included for English.').waitFor();
    assert.deepEqual(await tabs.allTextContents(), []);
    assert.equal(await panel.locator('li a, [data-customer-answer]:visible').count(), 0);
    await page.getByLabel('Main (en)', { exact: true }).check();
    await page.getByLabel('Show language picker').check();
    await picker.selectOption('es');
    await panel.locator('[data-exp-sort] select').selectOption('title asc');
    await panel.getByRole('link', { name: 'es/Directorio ' + query }).waitFor();
    assert.ok(requests.some(r => r.kind === 'emselect' && r.sort === 'title asc' && r.lang === 'es' && r.profile === 'Directorio'));
    const input = panel.locator('input[type=search]');
    await input.fill('private-draft');
    await panel.getByRole('option', { name: 'Suggested private-draft' }).waitFor();
    assert.ok(requests.some(r => r.kind === 'emsuggest' && r.lang === 'es'));
    await input.press('Escape');
    assert.equal(await panel.locator('.smart-answers-sample').isVisible(), false);
    await page.getByRole('button', { name: 'Get starter code' }).click();
    for (const format of ['javascript', 'react', 'vue', 'angular']) {
      const [file] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + format + '"]').click()]);
      const files = unzipSync(fs.readFileSync(await file.path()));
      const settings = Buffer.from(files['src/config.js']).toString();
      assert.match(settings, /"Directorio"/);
      assert.match(settings, /"defaultLanguage": "en"/);
      assert.doesNotMatch(settings, /"Directory"/);
      for (const content of Object.values(files)) {
        for (const value of [selectToken, discoveryToken, origin, query, 'private-draft']) assert.equal(Buffer.from(content).includes(value), false);
      }
    }
    await page.getByLabel('Show profile tabs').uncheck();
    await page.getByLabel('Show language picker').uncheck();
    assert.equal(await page.locator('#lab-query').inputValue(), 'private-draft');
    await page.locator('[data-single-experience] [data-customer-answer-content]').filter({ hasText: 'Answer en/Main ' + query }).waitFor();
    const singleSort = page.locator('#lab-customer-sort');
    await singleSort.waitFor();
    assert.equal(await singleSort.locator('option:checked').textContent(), 'Relevance');
    for (const [order, act] of [
      ['title asc', () => singleSort.selectOption('title asc')],
      ['', () => page.getByRole('button', { name: 'Reset design', exact: true }).click()],
      ['title asc', () => page.getByRole('button', { name: 'Undo reset', exact: true }).click()],
    ]) {
      const completed = page.waitForResponse(response => {
        const url = new URL(response.url());
        return url.origin === origin && url.pathname.endsWith('/emselect') && (url.searchParams.get('sort') || '') === order;
      });
      await act();
      assert.ok((await completed).ok());
      await page.waitForFunction(value => !document.querySelector('[data-searching]') && document.querySelector('#lab-customer-sort').value === value, order);
    }
    await page.locator('[data-customer-disconnect]').click();
    await page.route(origin + '/second/emselect**', route => route.fulfill({ json: {
      response: { numFound: 1, docs: [{ title: 'should not appear', url: 'https://example.org/leak' }] },
    } }));
    if (!await page.locator('[data-customer-connect]').isVisible()) await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await page.locator('#lab-customer-endpoint').fill(origin + '/second/emselect');
    await page.locator('#lab-customer-token').fill(selectToken);
    await page.locator('#lab-customer-query').fill('second-app');
    await page.locator('[data-customer-options] summary').click();
    const fileInput = page.locator('#lab-app-configuration');
    await fileInput.setInputFiles(snapshot);
    await page.locator('[data-customer-submit]').click();
    await page.getByText(/snapshot’s Select endpoint must match/).waitFor();
    await fileInput.setInputFiles([]);
    await page.locator('[data-customer-submit]').click();
    await page.getByText('Results Fields are unknown for this profile.', { exact: true }).waitFor();
    assert.equal(await page.getByLabel('Show profile tabs').isDisabled(), true);
    assert.equal(await page.locator('[data-profile-choices] input, [data-customer-grid] a, [data-customer-grid] img').count(), 0);
    assert.match(await page.locator('[data-app-settings-summary]').innerText(), /Smart Answers — Unknown/);
    const featureRequests = requests.filter(r => ['related-search', 'answer'].includes(r.kind)).length;
    await page.locator('[data-customer-disconnect]').click();
    if (!await page.locator('[data-customer-connect]').isVisible()) await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await page.locator('[data-customer-options] summary').click();
    for (const [id, value] of Object.entries(fields)) await page.locator('#' + id).fill(value);
    const limited = JSON.parse(fs.readFileSync(snapshot, 'utf8'));
    limited.entitlements = { smartAnswers: false };
    await fileInput.setInputFiles({ name: 'limited.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(limited)) });
    await page.locator('[data-customer-submit]').click();
    await single.getByRole('link', { name: 'en/Main ' + query }).waitFor();
    const featureSummary = await page.locator('[data-app-settings-summary]').innerText();
    assert.match(featureSummary, /Smart Answers — Unavailable \(entitled: no, configured: yes\)/);
    assert.match(featureSummary, /Related Searches — Unknown \(entitled: unknown, configured: yes\)/);
    assert.equal(requests.filter(r => ['related-search', 'answer'].includes(r.kind)).length, featureRequests);
    assert.equal(await page.locator('.search-related-terms:visible, [data-customer-answer]:visible').count(), 0);
    await page.locator('[data-customer-disconnect]').click();
    if (!await page.locator('[data-customer-connect]').isVisible()) await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    const endpoint = page.locator('#lab-customer-endpoint');
    const token = page.locator('#lab-customer-token');
    const connect = page.locator('[data-customer-submit]');
    let releaseConnection;
    const slowConnection = new Promise(resolve => { releaseConnection = resolve; });
    await page.route(origin + '/slow/emselect**', async route => {
      await slowConnection;
      await route.fulfill({ json: { response: { numFound: 0, docs: [] } } });
    });
    await endpoint.fill(origin + '/slow/emselect');
    await token.fill(selectToken);
    await page.locator('#lab-customer-query').fill('default profile');
    const started = page.waitForRequest(request => request.url().startsWith(origin + '/slow/emselect'));
    await connect.click();
    await started;
    await endpoint.fill(origin + '/qa/emselect');
    assert.equal(await token.inputValue(), '');
    await token.fill(selectToken);
    await page.locator('[data-customer-options] summary').click();
    const reordered = JSON.parse(fs.readFileSync(snapshot, 'utf8'));
    reordered.profiles.unshift(reordered.profiles.pop());
    await fileInput.setInputFiles({ name: 'profiles.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(reordered)) });
    let defaultParams = { model: 'Directory' };
    await page.route(origin + '/qa/emselect**', route => {
      const url = new URL(route.request().url());
      if (url.searchParams.has('model')) return route.fallback();
      return route.fulfill({ json: { response: { numFound: 1, docs: [{ person_s: 'Default directory' }] },
        responseHeader: { params: defaultParams },
        metadata: { results: [{ name: 'person_s', result_card: 'title' }] } } });
    });
    await connect.click();
    await single.getByText('Default directory').waitFor();
    releaseConnection();
    await page.locator('[data-customer-source]').filter({ hasText: 'Directory' }).waitFor();
    assert.match(await page.locator('[data-app-settings-summary]').innerText(), /Smart Answers — Off/);
    await page.getByRole('tab', { name: 'Features', exact: true }).click();
    if (!await page.locator('#lab-profile-tabs').isVisible()) await page.locator('#lab-advanced > summary').click();
    await page.getByLabel('Show profile tabs').check();
    await panel.getByRole('tab', { selected: true, name: 'Directory' }).waitFor();
    assert.deepEqual(await tabs.allTextContents(), ['Main', 'Directory']);
    await page.locator('[data-exp-disconnect]').click();
    defaultParams = {};
    if (!await page.locator('[data-customer-connect]').isVisible()) await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await endpoint.fill(origin + '/qa/emselect');
    await token.fill(selectToken);
    await page.locator('#lab-customer-query').fill('unknown language');
    await page.locator('[data-customer-options] summary').click();
    await fileInput.setInputFiles(snapshot);
    await connect.click();
    await panel.getByText('The default profile’s language is unknown.').waitFor();
    assert.deepEqual(await tabs.allTextContents(), []);
    assert.deepEqual(await choices.allTextContents(), []);
    assert.equal(requests.some(r => r.term === 'unknown language' && r.profile), false);
    await page.getByLabel('Show language picker').check();
    assert.equal(await picker.inputValue(), '');
    await picker.selectOption('es');
    await panel.getByRole('link', { name: 'es/Directorio unknown language' }).waitFor();
    assert.deepEqual(await tabs.allTextContents(), ['Directorio']);
    assert.deepEqual(errors, []);
    console.log('Passed snapshot binding, tab subsets, app and language switching, mapped links and thumbnails, text-only results, highlighting, entitlement gates, missing metadata, late responses and four credential-free downloads.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
