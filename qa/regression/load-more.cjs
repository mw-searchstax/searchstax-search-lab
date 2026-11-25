const fs = require('node:fs');
const path = require('node:path');
const { chromium, assert, liveQA, baseURL } = require('./runtime.cjs');

// QA_STARTER_URL checks the same workflow in a locally served download.
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(15000);
    const starterURL = process.env.QA_STARTER_URL;
    const errors = [];
    const liveBatches = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', async response => {
      const url = new URL(response.url());
      if (!url.pathname.endsWith('/emselect') || url.searchParams.get('model') !== 'SearchLabBuild' ||
          url.searchParams.get('q') !== 'campus' || url.searchParams.get('rows') !== '10') return;
      const data = await response.json().catch(() => null);
      if (data?.response) liveBatches.push([data.response.start, data.response.docs.length, data.response.numFound]);
    });
    await page.goto(starterURL || baseURL + '#lab-design');
    const output = starterURL ? page.locator('body') : page.locator('[data-lab-demo-output]');
    const cards = output.locator('article.searchstax-search-result');
    const label = process.env.QA_LOAD_MORE_LABEL || 'Show more campus results';
    const button = output.getByRole('button', { name: label, exact: true });
    await cards.first().waitFor({ timeout: 35000 });
    if (!starterURL) {
      await page.getByText('Pagination', { exact: true }).click();
      const mode = page.getByLabel('How visitors see more results');
      assert.equal(await mode.inputValue(), 'paged');
      await mode.selectOption('loadMore');
      const labelInput = page.getByLabel('Load more button text');
      assert.equal(await labelInput.inputValue(), 'Load more');
      await labelInput.fill(label);
    }
    const search = page.locator(starterURL ? 'input[type=search]:visible' : '#lab-query').first();
    await search.fill('campus');
    await search.press('Enter');
    await output.getByText(/^37 results(?: for “campus”)?$/).first().waitFor();
    async function resultLinks(count) {
      await cards.nth(count - 1).waitFor();
      assert.equal(await cards.count(), count);
      const urls = await cards.locator('h2 a, h4 a').evaluateAll(links => links.map(a => a.href));
      assert.equal(new Set(urls).size, count, 'one distinct result link per card');
      return urls;
    }
    let previous = await resultLinks(10);
    await button.focus();
    for (const count of [20, 30, 37]) {
      await page.waitForFunction(text => document.activeElement?.textContent.trim() === text, label);
      await page.keyboard.press('Enter');
      const urls = await resultLinks(count);
      assert.deepEqual(urls.slice(0, previous.length), previous, 'existing cards stay in order');
      previous = urls;
    }
    assert.equal(await button.isVisible(), false);
    const completion = output.locator('[data-page-range], [data-page-announcement]:not(.search-starter__sr-only):not(.search-lab__sr-only)')
      .filter({ hasText: /37 of 37|all 37 results loaded/i }).first();
    await completion.waitFor();
    assert.ok((await completion.boundingBox()).width > 1, 'the final count is visible to visitors');
    await page.waitForFunction(() => /37/.test(document.activeElement?.textContent || '') && document.activeElement !== document.body);
    const location = output.getByRole('checkbox', { name: /^Location\b/i });
    await location.click();
    await output.getByText(/^8 results(?: for “campus”)?$/).first().waitFor();
    await resultLinks(8);
    assert.equal(await button.isVisible(), false);
    // The kit can replace its facet controls after the result cards appear.
    await output.getByRole('checkbox', { name: /^Location\b/i, checked: true }).waitFor();
    await location.click();
    await output.getByText(/^37 results(?: for “campus”)?$/).first().waitFor();
    await resultLinks(10);
    await button.waitFor();
    for (const [start, rows] of [[0, 10], [10, 10], [20, 10], [30, 7]]) {
      assert.ok(liveBatches.some(([offset, length, total]) =>
        offset === start && length === rows && total === 37), 'published campus response at ' + start);
    }
    if (!starterURL) {
      await page.getByRole('button', { name: 'Share Design', exact: true }).click();
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
      await page.getByRole('button', { name: 'Copy design link' }).click();
      const shared = new URL(await page.getByLabel('Design link', { exact: true }).inputValue());
      assert.equal(shared.searchParams.get('lab_pagination'), 'loadMore');
      assert.equal(shared.searchParams.get('lab_load_more_text'), label);
      await page.reload();
      assert.equal(await page.getByLabel('Load more button text').inputValue(), label);
      assert.equal(await page.getByLabel('How visitors see more results').inputValue(), 'loadMore');
      if (process.env.QA_ARTIFACT_DIR) {
        await page.getByRole('button', { name: 'Get starter code' }).click();
        for (const kit of ['javascript', 'react', 'vue', 'angular']) {
          const [file] = await Promise.all([
            page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + kit + '"]').click(),
          ]);
          const dir = path.join(process.env.QA_ARTIFACT_DIR, 'single', kit);
          fs.mkdirSync(dir, { recursive: true });
          await file.saveAs(path.join(dir, 'starter.zip'));
        }
      }
    }
    assert.deepEqual(errors, []);
    console.log((liveQA ? 'Live' : 'Fixture') + ' campus 10 → 20 → 30 → 37 distinct results, final focus, Location 8, clear to 10 of 37.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
