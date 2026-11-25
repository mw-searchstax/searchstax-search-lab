const fs = require('node:fs');
const path = require('node:path');
const { chromium, assert, liveQA, baseURL } = require('./runtime.cjs');

// The QA runtime supplies the demo fixture unless the release runner authorizes live traffic.
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(15000);
    const starter = process.env.QA_STARTER_URL;
    const mode = process.env.QA_FACET_MODE || 'or';
    const responses = [];
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', async r => {
      const url = new URL(r.url());
      if (url.pathname.endsWith('/emselect') && url.searchParams.get('q') === 'campus' && r.ok()) {
        const data = await r.json().catch(() => null);
        if (data) responses.push({ profile: url.searchParams.get('model'), total: data.response.numFound, filters: url.searchParams.getAll('fq') });
      }
    });
    await page.goto(starter || baseURL + '#lab-design');
    const output = starter ? page.locator('body') : page.locator('[data-lab-demo-output]');
    const cards = output.locator('article.searchstax-search-result');
    await cards.first().waitFor({ timeout: 35000 });
    if (!starter) {
      await page.getByText('Filters and sorting', { exact: true }).click();
      await page.locator('#lab-facet-mode').selectOption(mode);
      await page.locator('#lab-facet-desktop').selectOption('3');
      await page.locator('#lab-facet-mobile').selectOption('5');
    }
    const search = page.locator(starter ? 'input[type=search]:visible' : '#lab-query').first();
    await search.fill('campus');
    await search.press('Enter');
    const count = n => output.getByText(new RegExp('^' + n + ' results(?: for “campus”)?$')).first();
    await count(37).waitFor();
    const group = output.locator('fieldset[data-facet="demo_content_type_s"]');
    const more = group.locator('button[data-facet-more]');
    const choices = group.getByRole('checkbox');
    await more.waitFor();
    assert.equal(await choices.count(), 3, 'desktop collapsed choices');
    await more.click();
    assert.ok(await choices.count() > 5, 'expanded published choices');
    const location = group.getByRole('checkbox', { name: /^Location\b/i });
    await location.click();
    await count(8).waitFor();
    assert.ok(await location.isChecked());
    const ribbons = cards.locator('.searchstax-search-result-ribbon');
    await ribbons.first().waitFor();
    assert.equal(await ribbons.count(), 8);
    for (const value of await ribbons.allInnerTexts()) assert.equal(value, 'Location');
    const providers = group.getByRole('checkbox', { name: /^Providers\b/ });
    if (mode === 'or') {
      await providers.click();
      await count(16).waitFor();
      await providers.click();
      await count(8).waitFor();
    } else if (mode === 'and') {
      await providers.waitFor({ state: 'detached' });
    } else {
      await group.locator('input:disabled').first().waitFor();
      assert.ok(await providers.isDisabled());
    }
    await location.click();
    await count(37).waitFor();
    assert.ok(!(await location.isChecked()));
    assert.ok(responses.some(r => r.total === 8 && r.profile === 'SearchLabBuild' && r.filters.some(f => f.includes('demo_content_type_s') && f.includes('location'))), 'published Location response');
    if (await more.getAttribute('aria-expanded') === 'true') await more.click();
    await page.setViewportSize({ width: 650, height: 900 });
    await page.waitForFunction(() => {
      const group = document.querySelector('fieldset[data-facet="demo_content_type_s"]');
      return [...group.querySelector('.search-facet-choices').children].filter(row => !row.hidden).length === 5;
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    if (!starter && process.env.QA_ARTIFACT_DIR) {
      await page.getByRole('button', { name: 'Get starter code' }).click();
      for (const framework of ['javascript', 'react', 'vue', 'angular']) {
        const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="'+framework+'"]').click()]);
        const dir = path.join(process.env.QA_ARTIFACT_DIR, mode === 'or' ? 'single' : mode, framework);
        fs.mkdirSync(dir, { recursive: true });
        await download.saveAs(path.join(dir, 'starter.zip'));
      }
    }
    if (!starter) {
      await page.getByRole('button', { name: 'Share Design', exact: true }).click();
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
      await page.getByRole('button', { name: 'Copy design link' }).click();
      const shared = new URL(await page.getByLabel('Design link', { exact: true }).inputValue());
      assert.equal(shared.searchParams.get('lab_facet_desktop'), '3');
      assert.equal(shared.searchParams.get('lab_facet_mobile'), '5');
      assert.equal(shared.searchParams.get('lab_facet_mode') ?? 'or', mode);
      await page.getByText('Advanced Options', { exact: true }).click();
      await page.getByLabel('Show profile tabs').check();
      const tabs = page.locator('#lab-experiences');
      const summary = tabs.locator('[data-exp-summary]');
      await summary.filter({ hasText: '37 results' }).waitFor();
      const tabLocation = tabs.getByRole('checkbox', { name: /^location\b/i });
      await tabLocation.click();
      await summary.filter({ hasText: '8 results' }).waitFor();
      const tabProvider = tabs.getByRole('checkbox', { name: /^provider\b/i });
      if (mode === 'showUnavailable') assert.ok(await tabProvider.isDisabled());
      if (mode === 'and') assert.equal(await tabProvider.count(), 0);
      if (mode === 'or') {
        await tabProvider.click();
        await summary.filter({ hasText: '16 results' }).waitFor();
        await tabProvider.click();
        await summary.filter({ hasText: '8 results' }).waitFor();
      }
      await tabLocation.click();
      await summary.filter({ hasText: '37 results' }).waitFor();
    }
    assert.deepEqual(errors, []);
    console.log(mode + ' passed campus 37 → Location 8 → clear 37, title-case ribbons, and desktop/mobile facet limits.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
