const { assert, chromium } = require('./runtime.cjs');

const starterURL = process.env.QA_STARTER_URL;
assert.ok(starterURL, 'Set QA_STARTER_URL to the ordinary JavaScript starter with sorting enabled.');
const isKit = url => url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('searchstudio-ux-js');
const isSelect = url => url.pathname.endsWith('/emselect');
const isTracking = url => /analytics|emsearchclick|_searchclick|\/track\//i.test(url.hostname + url.pathname);
const resultSelector = '.searchstax-search-result a';
const completed = page => page.locator('#search-status').filter({ hasText: /^\d+ results?$/ }).waitFor();
const session = async (browser, name, check) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const attempts = [];
  const errors = [];
  try {
    await context.route(isTracking, route => {
      attempts.push(route.request().method());
      return route.abort();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => errors.push(error.message));
    const observation = await check(page);
    assert.deepEqual(errors, []);
    assert.deepEqual(attempts, []);
    console.log(JSON.stringify({ scenario: name, ...observation, trackingAttempts: attempts.length }));
  } finally {
    await context.close();
  }
};

async function failedKit(page) {
  await page.route(isKit, route => route.abort('failed'));
  const failure = page.waitForEvent('requestfailed', r => isKit(new URL(r.url())));
  await page.goto(starterURL);
  const request = await failure;
  const reload = page.getByRole('button', { name: 'Reload search' });
  await reload.waitFor({ timeout: 2000 });
  assert.ok(await page.getByRole('button', { name: 'Search', exact: true }).isDisabled());
  assert.match(await page.locator('#search-status').innerText(), /couldn’t start/i);
  await page.unroute(isKit);
  await reload.press('Enter');
  await completed(page);
  assert.ok(await reload.isHidden());
  return { failure: request.failure().errorText, afterReload: await page.locator('#search-status').innerText() };
}

async function failedSelect(page, sort) {
  const sortValue = 'url asc';
  const select = page.locator('#search-sort-order');
  const input = page.getByRole('searchbox');
  const links = page.locator(resultSelector);
  const readLinks = () => links.evaluateAll(nodes => nodes.map(a => a.href));
  let previous = [];
  if (sort) {
    await page.goto(starterURL);
    await completed(page);
    previous = await readLinks();
    assert.ok(previous.length > 1);
  }

  const match = url => isSelect(url) && (!sort || url.searchParams.get('sort') === sortValue);
  const requests = [];
  let failedAt;
  await page.route(match, route => {
    requests.push(route.request().url());
    failedAt = Date.now();
    if (requests.length === 2) return route.abort('failed');
    return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
  });
  if (sort) await select.selectOption(sortValue);
  else await page.goto(starterURL);

  const retry = page.getByRole('button', { name: 'Retry search' });
  await retry.waitFor({ timeout: 2000 });
  const firstDelayMs = Date.now() - failedAt;
  assert.ok(firstDelayMs < 2000);
  const message = await page.locator('#search-status').innerText();
  assert.equal(/previous results are still showing/i.test(message), sort);
  assert.deepEqual(await readLinks(), previous);
  const bounds = await retry.boundingBox();
  assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 844);

  // A visitor may have typed another term without submitting it.
  await input.fill('unsent draft');
  const networkError = page.waitForEvent('requestfailed', r => match(new URL(r.url())));
  await retry.press('Enter');
  await networkError;
  await retry.waitFor({ timeout: 2000 });
  assert.equal(await page.locator('#search-status').innerText(), message);
  assert.equal(requests[1], requests[0]);
  await page.unroute(match);
  const recovered = page.waitForResponse(r => match(new URL(r.url())));
  await retry.click();
  const response = await recovered;
  assert.equal(response.status(), 200);
  assert.equal(response.url(), requests[0]);
  await completed(page);
  assert.ok(await retry.isHidden());
  assert.equal(await input.inputValue(), 'unsent draft');
  const results = await readLinks();
  if (sort) {
    assert.equal(await select.inputValue(), sortValue);
    assert.deepEqual(results, [...previous].sort());
  }
  return { http: 503, firstDelayMs, message, secondFailure: 'network error', recoveryHttp: 200,
    sameRequest: true, results: results.length };
}

async function delayed(page, retryIt, kit) {
  const match = kit ? isKit : isSelect;
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let first = true;
  await page.route(match, async route => {
    if (!first) return route.continue();
    first = false;
    const response = await route.fetch();
    await held;
    // Retry can cancel the original Select before the held response is released.
    if (!route.request().failure()) await route.fulfill({ response }).catch(error => {
      if (!route.request().failure()) throw error;
    });
  });
  try {
    await page.goto(starterURL, { waitUntil: 'commit' });
    const action = page.getByRole('button', { name: kit ? 'Reload search' : 'Retry search' });
    await action.waitFor({ timeout: 21000 });
    const status = page.locator('#search-status');
    const message = await status.innerText();
    assert.match(message, /taking longer than usual/);
    if (retryIt) {
      const response = page.waitForResponse(r => isSelect(new URL(r.url())));
      await action.click();
      assert.equal((await response).status(), 200);
      await completed(page);
    }
    release();
    await completed(page);
    assert.ok(await action.isHidden());
    return { message, recovered: await status.innerText(), clickedRetry: retryIt };
  } finally { release(); }
}

async function filterAndPageRetry(page) {
  await page.goto(starterURL);
  await completed(page);
  const box = page.getByRole('searchbox');
  await box.fill('campus flu clinic');
  const newSearch = page.waitForResponse(r => isSelect(new URL(r.url())) && new URL(r.url()).searchParams.get('q') === 'campus flu clinic');
  await box.press('Enter');
  await newSearch;
  await completed(page);
  const providers = page.getByRole('checkbox', { name: /Providers/ });
  const retry = page.getByRole('button', { name: 'Retry search' });
  async function failAndRetry(match, trigger) {
    let failedURL;
    await page.route(match, route => {
      failedURL = route.request().url();
      return route.abort('failed');
    });
    await trigger();
    await retry.waitFor({ timeout: 2000 });
    assert.match(await page.locator('#search-status').innerText(), /Previous results are still showing/);
    await page.unroute(match);
    const recovery = page.waitForResponse(r => match(new URL(r.url())));
    await retry.click();
    const response = await recovery;
    assert.equal(response.status(), 200);
    assert.equal(response.url(), failedURL);
    await completed(page);
    assert.ok(await retry.isHidden());
    return new URL(failedURL);
  }

  await failAndRetry(url => isSelect(url) && url.searchParams.getAll('fq').some(fq => fq.includes('provider')),
    () => providers.check());
  const unfiltered = page.waitForResponse(r => {
    const url = new URL(r.url());
    return isSelect(url) && !url.searchParams.getAll('fq').some(Boolean);
  });
  await providers.uncheck();
  await unfiltered;
  await completed(page);
  const url = await failAndRetry(url => isSelect(url) && Number(url.searchParams.get('start')) > 0,
    () => page.getByRole('button', { name: 'Next', exact: true }).click());
  const start = Number(url.searchParams.get('start'));
  await page.locator('[data-page-range]').filter({ hasText: new RegExp('^' + (start + 1) + '–') }).waitFor();
  assert.ok(await retry.isHidden());
  return { query: url.searchParams.get('q'), start, sameFilterRequest: true, samePageRequest: true };
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    await session(browser, 'UI Kit network failure and reload', failedKit);
    await session(browser, 'first search 503 and network error', page => failedSelect(page, false));
    await session(browser, 'sort 503 with previous results and network error', page => failedSelect(page, true));
    await session(browser, 'retry a filter and page two', filterAndPageRetry);
    await session(browser, 'delayed UI Kit completes', page => delayed(page, false, true));
    await session(browser, 'delayed first response completes', page => delayed(page, false, false));
    await session(browser, 'retry pending first search', page => delayed(page, true, false));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
