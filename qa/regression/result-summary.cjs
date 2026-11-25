const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, assert, baseURL, localQA, liveQA } = require('./runtime.cjs');
const checkDownloads = require('./download-matrix.cjs');
const { campus, searchResponse } = require('./demo-fixture.cjs');

const variants = [
  { mode: 'count', placement: 'above', pagination: 'paged' },
  { mode: 'range', placement: 'below', pagination: 'paged' },
  { mode: 'range', placement: 'above', pagination: 'loadMore' },
  { mode: 'count', placement: 'below', pagination: 'loadMore' },
];
const variantName = ({ mode, placement, pagination }) => [mode, placement, pagination].join('-');
const starter = process.env.QA_STARTER_URL;
const artifacts = process.env.QA_ARTIFACT_DIR;
const summarySelector = starter ? '[data-result-summary]' : '[data-lab-summary]';
const cardSelector = (starter ? '' : '[data-lab-demo-output] ') + 'article.searchstax-search-result';

async function search(page, term) {
  const input = page.locator(starter ? 'input[type=search]:visible' : '#lab-query');
  await input.fill(term);
  await input.press('Enter');
}

async function verify(page, settings, term, total, first, last) {
  const shown = total ? last - first + 1 : 0;
  let text = settings.mode === 'range' && shown ? 'Showing ' + first + '–' + last + ' of ' + total
    : total + (total === 1 ? ' result' : ' results');
  if (!starter) text += ' for “' + term + '”';
  await page.waitForFunction(({ summarySelector, cardSelector, text, shown, above }) => {
    const summary = document.querySelector(summarySelector);
    const cards = [...document.querySelectorAll(cardSelector)].filter(el => el.getClientRects().length);
    return summary?.getClientRects().length && summary.textContent.trim() === text && cards.length === shown &&
      (!shown || Boolean(summary.compareDocumentPosition(cards[above ? 0 : shown - 1]) & Node.DOCUMENT_POSITION_FOLLOWING) === above);
  }, { summarySelector, cardSelector, text, shown, above: settings.placement === 'above' });
  if (term === 'campus') {
    const expected = campus.slice(first - 1, last).map(record => record.url);
    await page.waitForFunction(({ cardSelector, expected }) => {
      const cards = [...document.querySelectorAll(cardSelector)].filter(el => el.getClientRects().length);
      return cards.length === expected.length && cards.every((card, i) => card.querySelector('a')?.href === expected[i]);
    }, { cardSelector, expected });
  }
}

async function configure(page, settings) {
  await page.getByRole('link', { name: 'Start designing' }).click();
  await page.locator(cardSelector).first().waitFor();
  await page.getByRole('tab', { name: 'Appearance' }).click();
  await page.getByText('Search feedback', { exact: true }).click();
  assert.equal(await page.getByLabel('Result summary', { exact: true }).inputValue(), 'count');
  assert.equal(await page.getByLabel('Summary placement').inputValue(), 'above');
  await page.getByLabel('Result summary', { exact: true }).selectOption(settings.mode);
  await page.getByLabel('Summary placement').selectOption(settings.placement);
  if (settings.pagination === 'loadMore') {
    await page.getByRole('tab', { name: 'Features' }).click();
    await page.getByText('Pagination', { exact: true }).click();
    await page.getByLabel('How visitors see more results').selectOption('loadMore');
  }
}

async function exercise(browser, settings) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(starter || baseURL);
    if (!starter) await configure(page, settings);
    else await page.locator(cardSelector).first().waitFor();
    const scope = starter ? page : page.locator('[data-lab-demo-output]');
    await search(page, 'campus');
    await verify(page, settings, 'campus', 37, 1, 10);
    for (const start of [11, 21, 31]) {
      const loadMore = settings.pagination === 'loadMore';
      await scope.getByRole('button', { name: loadMore ? 'Load more' : 'Next', exact: true }).click();
      await verify(page, settings, 'campus', 37, loadMore ? 1 : start, Math.min(37, start + 9));
    }
    if (settings.pagination === 'paged') {
      await scope.getByRole('button', { name: 'Previous', exact: true }).click();
      await verify(page, settings, 'campus', 37, 21, 30);
    }
    const location = scope.getByRole('checkbox', { name: /^Locations?\b/i });
    await location.click();
    await verify(page, settings, 'campus', 8, 1, 8);
    await scope.getByRole('checkbox', { name: /^Locations?\b/i, checked: true }).waitFor();
    await location.click();
    await verify(page, settings, 'campus', 37, 1, 10);
    await search(page, 'travel vaccinations');
    await verify(page, settings, 'travel vaccinations', 1, 1, 1);
    await search(page, 'unmatched-123');
    await verify(page, settings, 'unmatched-123', 0, 0, 0);
    if (!starter) {
      await search(page, 'campus');
      await verify(page, settings, 'campus', 37, 1, 10);
      await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
      for (const framework of ['javascript', 'react', 'vue', 'angular']) {
        const dir = path.join(artifacts, variantName(settings), framework);
        await fs.mkdir(dir, { recursive: true });
        const [zip] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + framework + '"]').click()]);
        await zip.saveAs(path.join(dir, 'starter.zip'));
      }
      await page.getByRole('button', { name: 'Share Design', exact: true }).click();
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
      await page.getByRole('button', { name: 'Copy design link' }).click();
      const url = new URL(await page.getByLabel('Design link', { exact: true }).inputValue());
      assert.equal(url.searchParams.get('lab_summary') || 'count', settings.mode);
      assert.equal(url.searchParams.get('lab_summary_placement') || 'above', settings.placement);
      await page.reload();
      assert.equal(await page.locator('#lab-summary-mode').inputValue(), settings.mode);
      assert.equal(await page.locator('#lab-summary-placement').inputValue(), settings.placement);
    }
    assert.deepEqual(errors, []);
    console.log((starter ? 'Starter' : 'Build') + ' passed ' + variantName(settings) + ', including Location, one and zero results.');
  } catch (error) {
    console.error(variantName(settings), 'summary:', await page.locator(summarySelector).allTextContents(), 'cards:', await page.locator(cardSelector).count());
    throw error;
  } finally { await page.close(); }
}

async function checkOtherPreviews(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const settings = { mode: 'range', placement: 'below', pagination: 'paged' };
  const fixtureEndpoint = 'https://review.searchstax.com/fixture/emselect';
  await page.route(fixtureEndpoint + '*', route => route.fulfill({ json: searchResponse(new URL(route.request().url())) }));
  const requests = [];
  page.on('request', req => { if (new URL(req.url()).pathname.endsWith('/emselect')) requests.push(req); });
  try {
    await page.goto(baseURL);
    await configure(page, settings);
    await search(page, 'campus');
    await verify(page, settings, 'campus', 37, 1, 10);
    await page.getByRole('tab', { name: 'Features' }).click();
    await page.getByText('Advanced Options', { exact: true }).click();
    await page.getByLabel('Show profile tabs').check();
    const tabs = page.locator('#lab-experiences');
    const tabSummary = tabs.locator('[data-exp-summary]');
    await tabSummary.getByText('Showing 1–10 of 37 for “campus”', { exact: true }).waitFor();
    await tabs.getByRole('button', { name: 'Next page' }).click();
    await tabSummary.getByText('Showing 11–20 of 37 for “campus”', { exact: true }).waitFor();
    assert.ok(await tabSummary.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('.experience-results ul')) & Node.DOCUMENT_POSITION_PRECEDING)));
    const before = requests.length;
    await page.getByRole('tab', { name: 'Appearance' }).click();
    await page.getByLabel('Result summary', { exact: true }).selectOption('count');
    await page.getByLabel('Summary placement').selectOption('above');
    await tabSummary.getByText('37 results for “campus”', { exact: true }).waitFor();
    assert.equal(requests.length, before);
    assert.ok(await tabSummary.evaluate(el => Boolean(el.closest('.search-results-toolbar'))));
    await page.getByRole('tab', { name: 'Features' }).click();
    await page.getByLabel('Show profile tabs').uncheck();
    await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await page.locator('#lab-customer-endpoint').fill(fixtureEndpoint);
    await page.locator('#lab-customer-token').fill('local-fixture');
    await page.locator('#lab-customer-query').fill('campus');
    await page.locator('[data-customer-submit]').click();
    const connected = page.locator('[data-customer-preview]');
    const summary = connected.locator('[data-customer-status]');
    await summary.getByText('37 results for “campus”', { exact: true }).waitFor();
    await connected.getByRole('button', { name: 'Next', exact: true }).click();
    await connected.locator('[data-customer-range]').getByText('11–20 of 37 results', { exact: true }).waitFor();
    await page.getByRole('tab', { name: 'Appearance' }).click();
    const connectedRequests = requests.length;
    await page.getByLabel('Result summary', { exact: true }).selectOption('range');
    await page.getByLabel('Summary placement').selectOption('below');
    await summary.getByText('Showing 11–20 of 37 for “campus”', { exact: true }).waitFor();
    assert.ok(await summary.evaluate(el => el.previousElementSibling.hasAttribute('data-customer-layout')));
    assert.equal(requests.length, connectedRequests);
    console.log('Tabbed and connected previews updated the current page summary and placement without another search.');
  } finally { await page.close(); }
}

async function main() {
  assert.ok(localQA && !liveQA, 'Result summary checks use local fixtures only.');
  if (!starter && !artifacts) {
    await checkDownloads('result-summary', __filename, variants.map(settings => [variantName(settings), { QA_SUMMARY_VARIANT: variantName(settings) }]));
    return;
  }
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    if (!starter) await checkOtherPreviews(browser);
    for (const settings of variants) {
      if (!starter || variantName(settings) === process.env.QA_SUMMARY_VARIANT) await exercise(browser, settings);
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
