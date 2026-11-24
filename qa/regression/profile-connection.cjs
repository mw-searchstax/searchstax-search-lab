const fs = require('node:fs');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium } = require('./runtime.cjs');

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(8000);
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
      if (kind === 'emselect') return route.fulfill({ json: {
        response: { numFound: 1, docs: [{ title: lang + '/' + profile + ' ' + term, url: 'https://example.org/result', description: 'Fixture result', '[elevated]': true }] },
        externalLinks: [{ name: 'Featured fixture', url: 'https://example.org/featured' }],
        metadata: { facets: [{ name: 'type', label: 'Content type' }], sorts: [{ name: 'title', order: 'asc', label: 'Title' }] },
        facet_counts: { facet_fields: { type: ['Library', 1] } },
      } });
      if (kind === 'emsuggest') return route.fulfill({ json: { suggest: { terms: { prefix: { suggestions: [{ term: 'Suggested ' + term }] } } } } });
      if (kind === 'related-search') return route.fulfill({ json: { response: { docs: [{ related_search: 'Related ' + lang + ' ' + term }] } } });
      if (kind === 'answer') return route.fulfill({ contentType: 'text/event-stream', body: 'data: Answer ' + lang + '/' + profile + ' ' + term + '\n\ndata: CLOSE\n\n' });
      return route.abort();
    });
    // Connect while the fictional demo is still waiting for its first response.
    await page.route(url => url.origin !== origin && url.pathname.endsWith('/emselect'), () => {});
    await page.goto(baseURL + '#lab-design');
    await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await page.locator('[data-customer-options] summary').click();
    const fields = {
      'lab-customer-endpoint': origin + '/qa/emselect', 'lab-customer-token': selectToken,
      'lab-customer-query': query, 'lab-customer-profile': 'Main', 'lab-customer-language': 'en',
      'lab-experience-list': 'en | Directory\nes | Directorio',
      'lab-customer-answer-endpoint': origin + '/api/v1/answer', 'lab-customer-suggest-endpoint': origin + '/qa/emsuggest',
      'lab-related-endpoint': origin + '/qa/related-search', 'lab-discovery-key': discoveryToken,
    };
    for (const [id, value] of Object.entries(fields)) await page.locator('#' + id).fill(value);
    await page.locator('[data-customer-submit]').click();
    const panel = page.locator('#lab-experiences');
    await panel.getByRole('link', { name: 'en/Main ' + query }).waitFor();
    assert.equal(await page.locator('[data-lab-demo-output]').getAttribute('data-searching'), null);
    assert.equal(await panel.locator('[data-exp-sort] select option:checked').textContent(), 'Relevance');
    assert.equal(await page.getByLabel('Show language picker').isChecked(), false);
    assert.equal(await panel.locator('[data-exp-language] select').isVisible(), false);
    await page.getByLabel('Show language picker').check();
    await panel.getByRole('tab', { name: 'Directory', exact: true }).click();
    await panel.getByRole('link', { name: 'en/Directory ' + query }).waitFor();
    await panel.locator('[data-exp-language] select').selectOption('es');
    await panel.getByRole('link', { name: 'es/Directorio ' + query }).waitFor();
    await panel.getByRole('button', { name: 'Related es ' + query }).waitFor();
    await panel.locator('[data-customer-answer-content]').filter({ hasText: 'Answer es/Directorio ' + query }).waitFor();
    await panel.getByRole('link', { name: 'Featured fixture' }).waitFor();
    await panel.getByText('Promocionado', { exact: true }).waitFor();
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
    console.log('Passed connected profile/language selection, sorting, promotions, localized service requests, four credential-free downloads and return to single search.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
