const { assert, baseURL, chromium, firefox, webkit } = require('./runtime.cjs');
const { observeLesson, searchFields, ranking } = require('./live-lesson-diagnostics.cjs');

const engineName = process.env.QA_BROWSER || 'chromium';
const engines = { chromium, firefox, webkit };
const secondaryRoutes = [
  ['#lab-spell-check', 'Recover Searches With a Typo'],
  ['#lab-data-filters', 'Keep Results in the Right Section'],
  ['#lab-find-page', 'An Important Page Is Hard to Find'],
  ['#lab-promotions', 'How can I put this year’s flu clinic notice first?'],
  ['#lab-promotion-checklist', 'Do This in My Search App'],
  ['#lab-ranking-guide', 'Move Stronger Matches Up'],
  ['#lab-ranking-steps', 'Move Stronger Matches Up'],
  ['#lab-compare-ranking', 'Explore Search Fields and Ranking'],
  ['#lab-examples', 'Explore Search Fields and Ranking'],
];

async function choose(page, label) {
  await page.getByRole('radio', { name: label, exact: true }).check();
}

async function chooseAnotherLesson(page) {
  const button = page.locator('button:visible').filter({ hasText: 'Choose another lesson' });
  await button.first().waitFor();
  await button.first().click();
}

async function runImprove(page) {
  await page.goto(baseURL + '#lab-improve', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Improve What People Find' }).waitFor();
  assert.equal(await page.getByRole('radio', { name: /Search Fields/ }).count(), 1);
  assert.equal(await page.getByRole('radio', { name: /Synonyms/ }).count(), 1);
  assert.equal(await page.getByRole('radio', { name: /Ranking/ }).count(), 1);
  assert.equal(await page.getByRole('radio', { name: /Faceting/ }).count(), 1);

  const fields = observeLesson(page, searchFields);
  await choose(page, 'Search Fields · Match text');
  await fields.waitFor(page.getByRole('heading', { name: '1 result', exact: true }));
  await page.getByRole('button', { name: 'Include Service name', exact: true }).click();
  await fields.waitFor(page.locator('[data-improve-lesson="missing-page"]:visible').getByText('International Health', { exact: true }));
  assert.ok((await page.locator('.improve-preview__badge:visible').allTextContents()).includes('New match'));
  await page.getByRole('button', { name: 'Check this on your own site', exact: true }).click();
  await page.locator('[data-improve-own-site]:visible').waitFor();
  await page.getByText('Troubleshoot a missing page in Site Search', { exact: true }).click();
  await page.getByText('Confirm the Search Profile and indexed page', { exact: true }).click();
  assert.equal(await page.getByText('Ask the web team which Search App', { exact: false }).isVisible(), true);
  await page.getByRole('button', { name: 'Back to the lesson', exact: true }).click();
  await chooseAnotherLesson(page);
  await page.getByRole('button', { name: 'Show original results', exact: true }).click();
  await page.locator('[data-improve-lesson="missing-page"]:visible').getByText('International Health is missing from the results.', { exact: true }).waitFor();

  await choose(page, 'Synonyms · Link terms');
  await page.getByText('0 results', { exact: false }).waitFor();
  await page.getByRole('button', { name: 'Add a synonym', exact: true }).click();
  await page.getByText('Otolaryngology', { exact: true }).waitFor();
  assert.ok((await page.locator('.improve-preview__badge:visible').allTextContents()).includes('New match'));
  await page.getByRole('button', { name: 'Check this on your own site', exact: true }).click();
  await page.locator('[data-improve-own-site]:visible').waitFor();
  await page.getByRole('button', { name: 'Back to the lesson', exact: true }).click();
  await chooseAnotherLesson(page);
  await page.getByRole('button', { name: 'Show original results', exact: true }).click();
  await page.getByText('0 results', { exact: false }).waitFor();

  const order = observeLesson(page, ranking);
  await choose(page, 'Ranking · Order results');
  await order.waitFor(page.getByText('Top 5 of 44 results', { exact: true }));
  await page.getByRole('button', { name: 'Give title matches more weight', exact: true }).click();
  await order.waitFor(page.getByText('Same five results, new order.', { exact: false }));
  assert.equal(await page.locator('[data-improve-results]:visible').getByText('North Campus Clinic', { exact: true }).isVisible(), true);
  assert.equal(await page.getByText('Need this year’s notice first?', { exact: true }).isVisible(), true);
  await page.getByRole('button', { name: 'Check this on your own site', exact: true }).click();
  await page.locator('[data-improve-own-site]:visible').waitFor();
  await page.getByRole('button', { name: 'Back to the lesson', exact: true }).click();
  await chooseAnotherLesson(page);
  await page.getByRole('button', { name: 'Show original results', exact: true }).click();
  await page.getByText('Top 5 of 44 results', { exact: true }).waitFor();

  await choose(page, 'Faceting · Narrow results');
  await page.getByText('44 matches · 4 shown', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Apply Providers filter', exact: true }).click();
  await page.getByText('8 provider matches · 2 shown', { exact: true }).waitFor();
  assert.equal(await page.getByRole('checkbox', { name: 'Providers', exact: true }).isChecked(), true);
  assert.equal(await page.getByText('Tessa Rowan', { exact: true }).isVisible(), true);
  assert.equal(await page.getByText('Mara Ellison', { exact: true }).isVisible(), true);
  await page.getByRole('button', { name: 'Check this on your own site', exact: true }).click();
  await page.locator('[data-improve-own-site]:visible').waitFor();
  await page.getByRole('button', { name: 'Back to the lesson', exact: true }).click();
  await chooseAnotherLesson(page);
  await page.getByRole('button', { name: 'Show original results', exact: true }).click();
  await page.getByText('44 matches · 4 shown', { exact: true }).waitFor();
}

async function runFreeSearchAndRoutes(page) {
  await choose(page, 'Search Fields · Match text');
  const input = page.locator('[data-improve-query]:visible');
  await input.fill('orthopedics');
  await input.press('Enter');
  await page.getByText('Adrian Pell', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Return to lesson search', exact: true }).isVisible(), true);
  await page.getByRole('button', { name: 'Return to lesson search', exact: true }).click();
  await page.locator('[data-improve-lesson="missing-page"]:visible').getByText('International Health is missing from the results.', { exact: true }).waitFor();

  const endpoint = await page.locator('[data-search-url]').first().getAttribute('data-search-url');
  assert.ok(endpoint, 'visitor search endpoint is present');
  let freeRetryRequests = 0;
  await page.route(endpoint + '**', route => {
    freeRetryRequests += 1;
    return freeRetryRequests === 1 ? route.abort() : route.continue();
  });
  await input.fill('orthopedics');
  await input.press('Enter');
  const visitorRetry = page.locator('[data-visitor-output]:visible [data-visitor-retry]');
  await visitorRetry.waitFor();
  await visitorRetry.click();
  await page.getByText('Adrian Pell', { exact: true }).waitFor();
  assert.equal(freeRetryRequests, 2);
  await page.unroute(endpoint + '**');

  await page.goto(baseURL + '#lab-spell-check', { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/rehabilitaton/).check();
  await page.getByText('Spell Check recovers 8 results', { exact: false }).waitFor();
  await page.getByLabel('rehabilitation', { exact: true }).check();
  await page.getByText('Both searches return 8 results', { exact: false }).waitFor();

  await page.goto(baseURL + '#lab-data-filters', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Include Locations', { exact: true }).check();
  await page.getByText('Showing 5 of 8 results', { exact: true }).waitFor();
  await page.getByLabel('Exclude News', { exact: true }).check();
  await page.getByText(/with Exclude News/).waitFor();

  await page.goto(baseURL + '#lab-find-page', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-clinic-comparison] tr').first().waitFor();
  assert.equal(await page.locator('[data-clinic-comparison] tr').count(), 5);
  assert.match((await page.locator('[data-clinic-comparison] tr').nth(2).innerText()), /2026 Notice/);
  await page.getByRole('link', { name: 'Try the Promotions walkthrough' }).click();
  await page.getByRole('heading', { name: 'How can I put this year’s flu clinic notice first?', exact: true }).waitFor();

  await page.goto(baseURL + '#lab-promotions', { waitUntil: 'domcontentloaded' });
  const promotion = page.locator('[data-lab-screen="promotions"]');
  await promotion.locator('[data-promotion-results]').getByText('Flu Clinic Updates — 2024 Archive', { exact: true }).waitFor();
  await promotion.locator('[data-promotion-feature]').check();
  await promotion.locator('[data-promotion-results]').getByText('Promoted', { exact: true }).waitFor();
  await promotion.getByRole('button', { name: /Check/ }).click();
  await promotion.locator('[data-promotion-outcome]').getByText('This search doesn’t contain', { exact: false }).waitFor();

  await page.goto(baseURL + '#lab-promotion-checklist', { waitUntil: 'domcontentloaded' });
  const checklist = page.locator('[data-promotion-checklist]');
  await checklist.getByText('Explain it to a teammate', { exact: true }).click();
  await page.locator('#lab-promotion-profile').fill('Staging / Main');
  await page.locator('#lab-promotion-query').fill('campus flu clinic');
  await page.locator('#lab-promotion-page').fill('Flu Clinic Updates — 2026 Notice');
  await page.locator('#lab-promotion-match').selectOption('contains');
  await checklist.getByRole('button', { name: 'Copy request for a teammate', exact: true }).click();
  assert.match(await checklist.locator('[data-promotion-request]').inputValue(), /Match type — Contains/);

  for (const [hash, heading] of secondaryRoutes) {
    await page.goto(baseURL + hash, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: heading, exact: true }).waitFor();
    assert.equal(await page.getByRole('link', { name: /Back to/ }).first().isVisible(), true, hash);
    if (hash === '#lab-compare-ranking') {
      await page.getByText('Unfiltered results for', { exact: false }).waitFor();
      assert.equal(await page.locator('[data-lab-comparison-table] tbody tr').count(), 5);
    }
  }
  return { freeRetryRequests };
}

async function runRetry(page) {
  const endpoint = await page.locator('[data-search-url]').getAttribute('data-search-url');
  assert.ok(endpoint, 'demo endpoint is present');
  let requests = 0;
  await page.route(endpoint + '**', route => {
    requests += 1;
    return requests === 1 ? route.abort() : route.continue();
  });
  await page.goto(baseURL + '#lab-improve', { waitUntil: 'domcontentloaded' });
  await choose(page, 'Search Fields · Match text');
  const retry = page.getByRole('button', { name: 'Retry search', exact: true });
  await retry.waitFor();
  assert.match(await page.getByText('The Central County results couldn’t load.', { exact: true }).innerText(), /couldn’t load/);
  await retry.press('Enter');
  await page.locator('[data-improve-lesson="missing-page"]:visible').getByText('International Health is missing from the results.', { exact: true }).waitFor();
  assert.equal(await retry.isVisible(), false);
  assert.equal(requests, 2);
  return page.evaluate(() => {
    const active = document.activeElement;
    return { tag: active.tagName, label: active.tagName === 'BUTTON' ? active.textContent.trim() : undefined };
  });
}

async function main() {
  const engine = engines[engineName];
  assert.ok(engine, 'Choose chromium, firefox, or webkit');
  const browser = await engine.launch(engineName === 'chromium' ? { channel: 'chrome' } : {});
  try {
    const width = Number(process.env.QA_WIDTH || 1440);
    const context = await browser.newContext({ viewport: { width, height: width <= 850 ? 844 : 960 } });
    const page = await context.newPage();
    page.setDefaultTimeout(18000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await runImprove(page);
    const freeSearch = await runFreeSearchAndRoutes(page);
    const retryFocus = await runRetry(page);
    assert.deepEqual(errors, []);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, 'Horizontal overflow: ' + overflow);
    console.log(JSON.stringify({ browser: engineName, version: browser.version(), width, overflow, ...freeSearch, retryRequests: 2, retryFocus }));
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
