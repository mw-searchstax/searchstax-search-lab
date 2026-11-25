const fs = require('node:fs');
const path = require('node:path');
const { chromium, assert, baseURL, localQA } = require('./runtime.cjs');

const query = 'campus flu clinic';
const notice = 'https://mw-searchstax.github.io/university-health-search-demo/news/flu-clinic-update-2026/';
const appointment = 'https://mw-searchstax.github.io/university-health-search-demo/care/resources/flu-shot-appointments/';

async function saveStarters(page, mode) {
  if (!process.env.QA_ARTIFACT_DIR) return;
  for (const framework of ['javascript', 'react', 'vue', 'angular']) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('[data-lab-download-starter="' + framework + '"]').click(),
    ]);
    const dir = path.join(process.env.QA_ARTIFACT_DIR, 'promotions', mode, framework);
    fs.mkdirSync(dir, { recursive: true });
    await download.saveAs(path.join(dir, 'starter.zip'));
  }
}

// Run against a locally served ZIP saved by this check to verify its actual renderer.
async function checkDownloadedStarter(page, url, fictional) {
  let requests = 0;
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/emselect')) requests++;
  });
  await page.goto(url);
  const hits = page.locator(fictional ? '#lab-exp-results li:has(h4)' : 'article.searchstax-search-result');
  const search = page.locator('input[type=search]:visible').first();
  const badge = hits.first().locator('.search-promotion-marker, .sample-indexed-promotion');
  const banner = page.locator('.search-promotion-banner:visible');
  // The plain JavaScript download loads its pinned UI Kit from the CDN before its first search.
  await hits.first().waitFor({ timeout: 30000 });
  await search.fill(query);
  await search.press('Enter');
  await badge.waitFor();
  await banner.waitFor();
  assert.equal(await hits.first().locator('a').first().getAttribute('href'), notice);
  assert.equal(await banner.locator('a').getAttribute('href'), appointment);
  assert.equal(await badge.innerText(), fictional ? 'Sample indexed promotion' : 'Featured result');
  if (!fictional) {
    assert.equal(await banner.locator('.search-promotion-heading').innerText(), 'Campus bulletin');
    assert.equal(await badge.evaluate(el => getComputedStyle(el).borderTopWidth), '1px');
    assert.equal(await banner.evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
    assert.ok(await banner.evaluate(el =>
      document.querySelector('.search-starter__body').compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
  }
  await search.fill('rehabilitation');
  await search.press('Enter');
  await badge.waitFor({ state: 'hidden' });
  await banner.waitFor({ state: 'hidden' });
  assert.equal(requests === 0, fictional);
  assert.deepEqual(errors, []);
  console.log('Passed downloaded starter with ' + (fictional ? 'fictional' : 'live') + ' promotions.');
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    if (process.env.QA_STARTER_URL) {
      await checkDownloadedStarter(page, process.env.QA_STARTER_URL, process.env.QA_FICTIONAL_STARTER === '1');
      return;
    }
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const live = process.env.QA_LIVE_PROMOTIONS === '1';
    if (!live) await page.route(url => url.pathname.endsWith('/emselect'), route => {
      const params = Object.fromEntries(new URL(route.request().url()).searchParams);
      const active = params.q === query && params.model === 'SearchLabBuild';
      return route.fulfill({ json: {
        responseHeader: { params: { ...params, uniqueId: 'key' } },
        response: { start: 0, numFound: 1, docs: [{ key: 'notice', page: notice, heading: 'Flu Clinic Updates — 2026 Notice', '[elevated]': active }] },
        externalLinks: active ? [{ name: 'Flu shot appointment information', url: appointment }, { name: 'Invalid', url: 'javascript:void(0)' }] : [],
        metadata: { results: [{ name: 'page', result_card: 'url' }, { name: 'heading', result_card: 'title' }], facets: [] },
        facet_counts: { facet_fields: {} },
      } });
    });
    await page.goto(baseURL + '?lab_promotions=both#lab-design');
    const results = page.locator('[data-lab-demo-output]');
    const first = results.locator('.searchstax-search-result').first();
    const banner = results.locator('.search-promotion-banner:visible');
    const badge = first.locator('.search-promotion-marker');
    const search = page.locator('#lab-query');
    async function submit(term) { await search.fill(term); await search.press('Enter'); }
    await first.waitFor();
    assert.equal(await page.getByLabel('Sample promotions').isVisible(), false);
    assert.equal(await search.inputValue(), 'rehabilitation');
    assert.equal(await banner.count(), 0);
    await submit(query);
    await badge.waitFor();
    assert.equal(await first.locator('h4 a').getAttribute('href'), notice);
    assert.equal(await banner.locator('a').getAttribute('href'), appointment);
    await page.getByRole('tab', { name: 'Appearance' }).click();
    await page.getByText('Promotion appearance', { exact: true }).click();
    await page.getByLabel('Indexed badge text').fill('Featured result');
    await page.getByLabel('External banner heading').fill('Campus bulletin');
    await page.getByLabel('Indexed badge style').selectOption('pill');
    await page.getByLabel('External banner style').selectOption('outline');
    assert.equal(await badge.innerText(), 'Featured result');
    assert.equal(await badge.evaluate(el => getComputedStyle(el).borderTopWidth), '1px');
    assert.equal(await banner.locator('.search-promotion-heading').innerText(), 'Campus bulletin');
    assert.equal(await banner.evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
    await page.getByRole('tab', { name: 'Features' }).click();
    await page.getByText('Advanced Options', { exact: true }).click();
    await page.getByLabel('External promotion placement').selectOption('below');
    assert.ok(await banner.evaluate(el => !!(document.querySelector('[data-lab-results-layout]').compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)));
    await page.getByRole('button', { name: 'Share Design', exact: true }).click();
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
    await page.getByRole('button', { name: 'Copy design link' }).click();
    const shared = new URL(await page.getByLabel('Design link', { exact: true }).inputValue());
    for (const [name, value] of Object.entries({
      lab_badge: 'Featured result', lab_promo_heading: 'Campus bulletin', lab_badge_style: 'pill',
      lab_banner_style: 'outline', lab_banner_placement: 'below',
    })) assert.equal(shared.searchParams.get(name), value);
    const fresh = await browser.newPage();
    try {
      await fresh.goto(shared.href);
      assert.equal(await fresh.getByLabel('Indexed badge text').inputValue(), 'Featured result');
      assert.equal(await fresh.getByLabel('External banner heading').inputValue(), 'Campus bulletin');
      assert.equal(await fresh.getByLabel('Indexed badge style').inputValue(), 'pill');
      assert.equal(await fresh.getByLabel('External banner style').inputValue(), 'outline');
      assert.equal(await fresh.getByLabel('External promotion placement').inputValue(), 'below');
    } finally { await fresh.close(); }
    await page.getByRole('button', { name: 'Get starter code' }).click();
    const [cssDownload] = await Promise.all([
      page.waitForEvent('download'), page.getByRole('button', { name: 'Download CSS' }).click(),
    ]);
    const css = fs.readFileSync(await cssDownload.path(), 'utf8');
    assert.match(css, /--promotion-badge-border:\s*1px solid currentColor/);
    assert.match(css, /--promotion-banner-background:\s*transparent/);
    await saveStarters(page, 'single');
    await submit('rehabilitation');
    await results.getByText(/results? for “rehabilitation”/).waitFor();
    assert.equal(await results.locator('.search-promotion-marker:visible,.search-promotion-banner:visible').count(), 0);
    await page.getByLabel('Show profile tabs').check();
    const panel = page.locator('#lab-experiences');
    const tabSearch = panel.locator('input[type=search]');
    await tabSearch.fill(query);
    await tabSearch.press('Enter');
    await panel.getByText('Featured result', {exact:true}).waitFor();
    await panel.locator('.search-promotion-banner:visible .search-promotion-heading').getByText('Campus bulletin', {exact:true}).waitFor();
    await panel.getByRole('tab', {name:'Main Profile',exact:true}).click();
    await panel.locator('[data-exp-summary]').getByText(/results? for/).waitFor();
    assert.equal(await panel.locator('.search-promotion-marker:visible,.search-promotion-banner:visible').count(), 0);
    if (localQA) {
      await page.goto(baseURL+'?lab_source=fictional&lab_promotions=both#lab-design');
      await panel.locator('input[type=search]').fill(query);
      await panel.locator('input[type=search]').press('Enter');
      await panel.getByText('Sample indexed promotion',{exact:true}).waitFor();
      await panel.getByRole('region',{name:'Sample external promotion'}).waitFor();
      await page.getByRole('button', { name: 'Get starter code' }).click();
      await saveStarters(page, 'fictionalSingle');
    }
    assert.deepEqual(errors,[]);
    console.log('Verified both promotion formats, all five design controls, control query, profile switching and fictional samples.');
  } finally { await browser.close(); }
})().catch(e => {console.error(e.message); process.exitCode=1;});
