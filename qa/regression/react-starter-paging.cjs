const { assert, chromium } = require('./runtime.cjs');

const query = 'campus flu clinic';
const rangeSelector = '[data-page-range]';
const linkSelector = '.searchstax-search-result h2 a';

function filteredPage(url, start) {
  const { pathname, searchParams } = new URL(url);
  return pathname.endsWith('/emselect') && searchParams.get('q') === query &&
    Number(searchParams.get('start')) === start && searchParams.getAll('fq').some(value => value.includes('provider'));
}

async function expectedPage(response) {
  assert.equal(response.status(), 200);
  const { responseHeader, response: { start, numFound, docs } } = await response.json();
  const ids = docs.map(doc => {
    const id = doc[responseHeader.params.uniqueId];
    assert.ok(id, 'Each returned record has a unique ID');
    return String(id);
  });
  return { range: `${start + 1}–${start + docs.length} of ${numFound} results`, ids };
}

async function check(browser, activation, url) {
  const context = await browser.newContext();
  const tracking = [];
  let release;
  const held = new Promise(resolve => { release = resolve; });
  try {
    await context.route(url => /analytics|emsearchclick|_searchclick|\/track\//i.test(url.pathname), route => {
      tracking.push(route.request().method());
      return route.abort();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    await page.goto(url);
    const range = page.locator(rangeSelector);
    await range.waitFor();
    const input = page.getByRole('searchbox');
    await input.fill(query);
    await input.press('Enter');
    const firstResponse = page.waitForResponse(r => filteredPage(r.url(), 0));
    await page.locator('label').filter({ hasText: /Providers/ }).click();
    const first = await expectedPage(await firstResponse);
    assert.equal(first.ids.length, 5, 'Export with five results per page');
    await range.filter({ hasText: first.range }).waitFor();
    const links = page.locator(linkSelector);
    const readIds = () => links.evaluateAll(nodes => nodes.map(link => link.dataset.resultId));
    assert.deepEqual(await readIds(), first.ids);

    // Record both parts of every rendered page transition to catch a mixed range/list.
    await page.evaluate(({ rangeSelector, linkSelector }) => {
      const sample = () => ({
        range: document.querySelector(rangeSelector)?.textContent,
        ids: Array.from(document.querySelectorAll(linkSelector), link => link.dataset.resultId),
      });
      window.pagingSamples = [sample()];
      new MutationObserver(() => window.pagingSamples.push(sample())).observe(
        document.querySelector(linkSelector).closest('.search-starter__body'),
        { childList: true, subtree: true, characterData: true, attributes: true },
      );
    }, { rangeSelector, linkSelector });
    await page.route(url => filteredPage(url, 5), async route => {
      const response = await route.fetch();
      await held;
      await route.fulfill({ response });
    });
    await Promise.all([
      page.waitForRequest(r => filteredPage(r.url(), 5)),
      page.getByRole('button', { name: 'Next', exact: true }).press('Enter'),
    ]);
    await new Promise(resolve => setTimeout(resolve, 1500));
    assert.equal(await range.innerText(), first.range, 'Keep the first range while page two is pending');
    assert.deepEqual(await readIds(), first.ids, 'Keep the first results while page two is pending');
    const secondResponse = page.waitForResponse(r => filteredPage(r.url(), 5));
    release();
    const second = await expectedPage(await secondResponse);
    assert.ok(second.ids.length >= 2, 'Fixture must have a second result on page two');
    await range.filter({ hasText: second.range }).waitFor();
    assert.deepEqual(await readIds(), second.ids);
    for (const sample of await page.evaluate(() => window.pagingSamples)) {
      const expected = sample.range === first.range ? first : second;
      assert.deepEqual(sample, expected, 'Range and result IDs must belong to the same response');
    }
    const link = links.nth(1);
    const title = await link.innerText();
    assert.equal(await link.getAttribute('data-result-id'), second.ids[1]);
    const destination = await link.getAttribute('href');
    await page.route(destination, route => route.fulfill({ contentType: 'text/plain', body: 'QA destination' }));
    await Promise.all([page.waitForURL(destination), activation === 'click' ? link.click() : link.press('Enter')]);
    assert.deepEqual(tracking, []);
    console.log(JSON.stringify({ activation, holdMs: 1500, pendingRange: first.range, settledRange: second.range,
      result: title, destination, position: 7, trackingRequests: tracking.length }));
  } finally {
    release();
    await context.close();
  }
}

(async () => {
  const url = process.env.QA_STARTER_URL;
  assert.ok(url, 'Set QA_STARTER_URL to the running ordinary React starter');
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const activation of ['click', 'Enter']) await check(browser, activation, url);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
