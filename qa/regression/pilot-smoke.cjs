const { assert, baseURL, chromium } = require('./runtime.cjs');
const { DEFAULT_PRODUCTION_ENDPOINT } = require('./search-traffic.cjs');

const query = 'campus flu clinic';
const notice = 'https://mw-searchstax.github.io/university-health-search-demo/news/flu-clinic-update-2026/';
const appointment = 'https://mw-searchstax.github.io/university-health-search-demo/care/resources/flu-shot-appointments/';
const production = new URL(DEFAULT_PRODUCTION_ENDPOINT);

async function run() {
  const dryRun = process.env.QA_DRY_RUN === '1';
  const previewURL = new URL(baseURL);
  const hostedURL = new URL(previewURL.href);
  if (dryRun && ['localhost', '127.0.0.1', '[::1]'].includes(hostedURL.hostname)) {
    hostedURL.hostname = 'pilot.example.test';
  }
  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || 'chrome',
    ...(dryRun ? { args: ['--host-resolver-rules=MAP pilot.example.test 127.0.0.1'] } : {}),
  });
  const articleURL = process.env.QA_HELP_CENTER_URL;
  let productionDispatches = 0;
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      storageState: process.env.QA_STORAGE_STATE || undefined,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(18000);
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.origin === production.origin && url.pathname === production.pathname) productionDispatches += 1;
    });

    if (dryRun) {
      // Keep the browser URL hosted-looking while loading only the local
      // preview. Replace the credential in local HTML with a fixed fake token;
      // the budget guard fulfills the resulting pilot request locally.
      await page.route(url => url.hostname === hostedURL.hostname, async route => {
        const requestURL = new URL(route.request().url());
        const localURL = new URL(requestURL.pathname + requestURL.search, previewURL.href);
        const response = await route.fetch({ url: localURL.href });
        if (requestURL.pathname === '/' || requestURL.pathname.endsWith('/index.html')) {
          const body = (await response.body()).toString('utf8')
            .replace('data-search-credential="recorded-only"',
              'data-search-credential="0000000000000000000000000000000000000000"');
          return route.fulfill({ response, body });
        }
        return route.fulfill({ response });
      });
    }

    await page.goto(articleURL || hostedURL.href + '#lab-home', { waitUntil: 'domcontentloaded' });
    const app = articleURL ? page.frameLocator('iframe[title="SearchStax Search Lab"]') : page;
    await app.getByRole('link', { name: 'Start designing', exact: true }).click();
    const search = app.getByRole('searchbox', { name: 'Search the website' });
    await search.waitFor();
    const cards = app.locator('[data-lab-demo-output] article.searchstax-search-result');
    await cards.first().waitFor();
    await app.getByText('8 results for “rehabilitation”', { exact: true }).waitFor();
    assert.match(await cards.first().locator('a').first().innerText(), /^Simon Kelver\b/);
    assert.equal(productionDispatches, 0, 'opening rehabilitation must use the recorded response');

    await search.fill(query);
    await search.press('Enter');
    const first = cards.first();
    await first.locator('.search-promotion-marker').waitFor();
    await app.locator('.search-promotion-banner:visible').waitFor();
    assert.equal(await first.locator('a').first().getAttribute('href'), notice);
    const banner = app.locator('.search-promotion-banner:visible');
    assert.equal(await banner.locator('a').getAttribute('href'), appointment);
    assert.equal(productionDispatches, 1, 'campus flu clinic must dispatch exactly once');

    // Submitting the completed, identical search is a reuse check. It must
    // leave the first promoted result and banner intact without another call.
    await search.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 700));
    await first.locator('.search-promotion-marker').waitFor();
    assert.equal(await first.locator('a').first().getAttribute('href'), notice);
    assert.equal(await banner.locator('a').getAttribute('href'), appointment);
    assert.equal(productionDispatches, 1, 'identical search must reuse the completed response');

    console.log(JSON.stringify({
      check: 'pilot-smoke', mode: dryRun ? 'dry-run' : 'live',
      opening: 'recorded rehabilitation', query, productionDispatches,
      recordedSelectRequests: 0, reusedIdenticalSearch: true,
    }, null, 2));
  } finally {
    await browser.close();
  }
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
