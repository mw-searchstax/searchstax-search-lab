const { assert, baseURL, chromium, webkit } = require('./runtime.cjs');

const which = process.env.QA_BROWSER || 'chromium';
const width = which === 'webkit' ? 320 : 390;
const height = Number(process.env.QA_HEIGHT || 844);
const query = 'onboarding fixture';
const app = 'https://review.searchstax.com/qa/emselect';
const log = (scenario, facts) => console.log(JSON.stringify({ scenario, browser: which, width, height, ...facts }));
const center = locator => locator.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
const box = locator => locator.evaluate(el => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.top), Math.round(r.bottom)];
});

async function observe(name, message, action, request) {
  await action.waitFor();
  // Measure after the browser's layout and scroll adjustments for the error frame.
  await action.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
  const error = await message.innerText();
  const bounds = { error: await box(message), action: await box(action) };
  log(name, { request, error, bounds });
  for (const span of Object.values(bounds)) assert.ok(span[0] >= 0 && span[1] <= height, name + ' ' + JSON.stringify(bounds));
  assert.ok(error.length > 0);
  if (name === 'Connected query' && process.env.QA_MOBILE_RECOVERY_SCREENSHOT) {
    await action.page().screenshot({ path: process.env.QA_MOBILE_RECOVERY_SCREENSHOT });
  }
}

function fixture() {
  const requests = [];
  let mode = 200;
  return {
    requests,
    fail(value) { mode = value; },
    async route(route) {
      const params = new URL(route.request().url()).searchParams;
      const start = Number(params.get('start') || 0);
      const rows = Number(params.get('rows') || 10);
      const request = { q: params.get('q'), start, sort: params.get('sort'), filters: params.getAll('fq'),
        profile: params.get('model'), language: params.get('language'), http: mode === 'timeout' ? null : mode };
      requests.push(request);
      if (mode === 'timeout') return;
      if (mode !== 200) return route.fulfill({ status: mode, body: 'Fixture failure' });
      const docs = Array.from({ length: Math.min(rows, 31 - start) }, (_, i) => ({
        title: 'Fixture result ' + (i + start + 1), url: 'https://example.org/' + (i + start),
        description: 'A page in the campus directory. '.repeat(12),
      }));
      await route.fulfill({ json: {
        response: { numFound: 31, docs }, metadata: { sorts: [{ name: 'title', order: 'asc', label: 'Title' }],
          facets: [{ name: 'type', label: 'Content type' }] }, facet_counts: { facet_fields: { type: ['Library', 12] } },
      } });
    },
  };
}

async function design(page) {
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Start designing' }).click();
}
async function connected(page, profiles) {
  await design(page);
  const server = fixture();
  await page.route(app + '**', server.route);
  const connectPanel = page.getByRole('button', { name: 'Preview with your Search App' });
  await connectPanel.click();
  const address = page.locator('#lab-customer-endpoint');
  const key = page.locator('#lab-customer-token');
  const connect = page.locator('[data-customer-submit]');
  await address.fill('https://example.org/wrong'); await key.fill('test-only');
  await page.locator('#lab-customer-query').fill(query);
  await page.locator('[data-customer-options] summary').click();
  await page.locator('#lab-customer-answer-endpoint').fill('https://review.searchstax.com/api/v1/answer');
  await page.route('https://review.searchstax.com/api/v1/answer**', r => r.fulfill({
    contentType: 'text/event-stream', body: 'data: ' + 'Campus directory information. '.repeat(80) + '\n\ndata: CLOSE\n\n',
  }));
  await page.locator('#lab-customer-profile').fill('Main');
  if (profiles) {
    await page.locator('#lab-customer-language').fill('en');
    await page.locator('#lab-experience-list').fill('en | Directory\nes | Directorio');
  }
  const fieldMessage = page.locator('#lab-connect-field-error');
  await connect.click();
  await observe('Invalid endpoint', fieldMessage, address, 'validation');
  assert.equal(await address.getAttribute('aria-invalid'), 'true');
  assert.ok((await address.getAttribute('aria-describedby')).includes('lab-connect-field-error'));
  await address.fill(app);
  if (!profiles) {
    const suggest = page.locator('#lab-customer-suggest-endpoint');
    await suggest.fill(app);
    await page.locator('[data-customer-options] summary').click();
    await connect.click();
    await observe('Invalid optional endpoint inside collapsed settings', fieldMessage, suggest, 'validation');
    await suggest.fill('');
    server.fail(401);
    await connect.click();
    await fieldMessage.filter({ hasText: 'rejected the token' }).waitFor();
    await observe('Rejected token', fieldMessage, key, 401);
    assert.equal(await key.inputValue(), '');
    await key.fill('test-only');
    server.fail('timeout');
    const now = Date.now(); await key.press('Enter');
    const feedback = page.locator('[data-customer-connect-status][data-tone=error]');
    await connect.filter({ hasText: 'Retry connection' }).waitFor();
    await observe('Connection timeout', feedback, connect, { http: null, elapsedMs: Date.now() - now });
    assert.ok(Date.now() - now >= 11500);
  }
  server.fail(200);
  await connect.press('Enter');
  await page.locator('[data-customer-connect-status]').filter({ hasText: 'Connected to your Search App' }).waitFor();
  if (profiles) await page.getByLabel('Show language picker').check();
  await page.locator('[data-lab-design-mode=preview]').click();
  const panel = profiles ? page.locator('#lab-experiences') : page.locator('[data-single-experience]');
  const input = panel.getByRole('searchbox');
  const links = panel.getByRole('link', { name: /^Fixture result/ });
  await links.first().waitFor();
  const recovery = panel.locator('.search-recovery:visible');
  const retry = recovery.getByRole('button');
  async function failure(name, control, act, status, expect, expectedTitle) {
    server.fail(status);
    await center(control); await control.focus();
    const started = Date.now();
    await act();
    await retry.waitFor();
    const failed = server.requests.at(-1);
    for (const [key, value] of Object.entries(expect)) assert.deepEqual(failed[key], value);
    await observe(name, recovery.getByRole('status'), retry, { ...failed, elapsedMs: Date.now() - started });
    if (status === 'timeout') assert.ok(Date.now() - started >= 11500);
    server.fail(503);
    const n = server.requests.length;
    await retry.press('Enter');
    await page.waitForFunction(() => document.querySelector('.search-recovery:not([hidden]) button:not([aria-disabled])'));
    assert.equal(server.requests.length, n + 1);
    assert.equal(await retry.isVisible(), true);
    server.fail(200); await retry.press('Enter');
    await recovery.waitFor({ state: 'hidden' });
    const success = server.requests.at(-1);
    assert.deepEqual({ ...success, http: failed.http }, failed);
    assert.equal(await links.first().innerText(), 'Fixture result ' + expectedTitle);
    log(name + ' recovered', { http: success.http, start: success.start });
  }
  await input.fill('another search');
  await failure(profiles ? 'Profile query' : 'Connected query', input, () => input.press('Enter'),
    profiles ? 503 : 'timeout', { q: 'another search' }, 1);
  if (profiles) {
    const tab = panel.getByRole('tab', { name: 'Directory', exact: true });
    await failure('Profile switch', tab, () => tab.click(), 503, { profile: 'Directory' }, 1);
    const lang = panel.locator('[data-exp-language] select');
    await failure('Language switch', lang, () => lang.selectOption('es'), 503, { language: 'es', profile: 'Directorio' }, 1);
  }
  const sort = panel.locator(profiles ? '[data-exp-sort] select' : '#lab-customer-sort');
  await failure('Sort in ' + (profiles ? 'profile' : 'single') + ' preview', sort, () => sort.selectOption('title asc'),
    503, { sort: 'title asc' }, 1);
  const filterButton = panel.locator(profiles ? '[data-exp-filter-toggle]' : '[data-customer-facets] button');
  if (await filterButton.isVisible()) await filterButton.click();
  const facet = panel.locator(profiles ? '[data-exp-facets] input[value=Library]' : 'select[data-customer-facet]');
  await failure('Filter in ' + (profiles ? 'profile' : 'single') + ' preview', facet,
    () => profiles ? facet.check() : facet.selectOption('Library'), 503, { filters: ['type:"Library"'] }, 1);
  const next = panel.locator(profiles ? '[data-exp-next]' : '[data-customer-next]');
  await failure('Page two in ' + (profiles ? 'profile' : 'single') + ' preview', next, () => next.click(),
    profiles ? 'timeout' : 503, { start: 10, q: 'another search' }, 11);
}

async function visitor(page) {
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Start improving' }).click();
  await page.getByRole('radio', { name: /Synonyms/ }).check();
  const input = page.locator('[data-improve-query]:visible');
  const output = page.locator('[data-visitor-output]:visible');
  const server = fixture();
  await page.route('**/emselect**', server.route);
  server.fail('timeout');
  await input.fill(query); await center(input); const start = Date.now(); await input.press('Enter');
  const retry = output.locator('[data-visitor-retry]');
  await retry.waitFor(); assert.ok(Date.now() - start >= 11500);
  await observe('Own query in Improve', output.getByRole('status'), retry, { http: null, elapsedMs: Date.now() - start });
  server.fail(200); await retry.press('Enter');
  await output.getByText('Fixture result 1', { exact: true }).waitFor();
  for (const [direction, offset] of [['next', 5], ['prev', 0]]) {
    const action = output.locator('[data-visitor-' + direction + ']');
    await center(action); await action.focus(); server.fail(503); await action.click(); await retry.waitFor();
    await observe('Improve ' + direction + ' page', output.getByRole('status'), retry, server.requests.at(-1));
    server.fail(200); await retry.press('Enter');
    await output.getByText('Fixture result ' + (offset + 1), { exact: true }).waitFor();
    assert.equal(server.requests.at(-1).start, offset);
    assert.equal(await page.evaluate(() => document.activeElement === document.body), false);
  }
  await page.getByRole('button', { name: 'Return to lesson search' }).click();
  assert.equal(await retry.count(), 0);
}
async function returnToPreset(page) {
  const server = fixture();
  await page.route('**/emselect**', server.route);
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Start improving' }).click();
  for (const lesson of ['Search Fields', 'Ranking']) {
    const lessonChoice = page.getByRole('radio', { name: new RegExp('^' + lesson + ' ·') });
    await lessonChoice.press('Space');
    assert.ok(await lessonChoice.isChecked());
    const panel = page.locator('[data-improve-lesson]:visible');
    const input = panel.locator('[data-improve-query]');
    await panel.locator('[data-improve-results] li').first().waitFor();
    await input.fill('orthopedics'); await input.press('Enter');
    await panel.locator('[data-visitor-results] li').first().waitFor();
    const back = panel.locator('[data-visitor-return]');
    await center(back);
    server.fail(503);
    await back.click();
    const retry = panel.locator('[data-lesson-results] [data-improve-retry]');
    await observe(lesson + ' return to lesson search', panel.locator('[data-improve-status]'), retry, 503);
    server.fail(200);
    await retry.press('Enter'); await retry.waitFor({ state: 'hidden' });
    assert.equal(server.requests.at(-1).q, await input.inputValue());
    assert.ok(await input.evaluate(el => el === document.activeElement));
  }
}
async function demoSearch(page) {
  await design(page);
  await page.locator('[data-lab-design-mode=preview]').click();
  const input = page.locator('#lab-query'), panel = page.locator('[data-single-experience]');
  await page.locator('[data-lab-summary]').filter({ hasText: /results for/ }).waitFor();
  const recovery = panel.locator('.search-recovery:visible');
  const retry = recovery.getByRole('button');
  let block = true;
  const attempts = [];
  await page.route('**/emselect**', route => {
    const params = new URL(route.request().url()).searchParams;
    attempts.push({ q: params.get('q'), start: params.get('start'), http: block ? 503 : 'live' });
    return block ? route.fulfill({ status: 503, body: 'Service unavailable' }) : route.continue();
  });
  await center(input);
  // Make this a new query even when promotions are enabled by default.
  await input.fill('campus'); await input.press('Enter');
  await observe('Fictional Design search', recovery.getByRole('status'), retry, attempts.at(-1));
  block = false; await retry.press('Enter');
  await page.locator('[data-lab-summary]').filter({ hasText: /results for “campus”/ }).waitFor();
  await recovery.waitFor({ state: 'hidden' });
  const next = panel.locator('[data-page-step=next]');
  await center(next); await next.focus(); block = true; await next.click();
  await observe('Fictional Design page two', recovery.getByRole('status'), retry, attempts.at(-1));
  const start = attempts.at(-1).start;
  block = false; await retry.press('Enter');
  await page.locator('[data-page-start="11"]').waitFor();
  assert.equal(attempts.at(-1).start, start);
}
async function optionalServices(page) {
  await design(page);
  const origin = 'https://review.searchstax.com';
  const server = fixture();
  let fail = true;
  await page.route(app + '**', server.route);
  await page.route(origin + '/qa/emsuggest**', r => r.fulfill(fail ? { status: 503 } : {
    json: { suggest: { terms: { prefix: { suggestions: [{ term: 'campus library' }] } } } },
  }));
  await page.route(origin + '/api/v1/answer**', r => r.fulfill(fail ? { status: 503 } : {
    contentType: 'text/event-stream', body: 'data: Recovered answer\n\ndata: CLOSE\n\n',
  }));
  await page.route(origin + '/qa/related-search**', r => r.fulfill(fail ? { status: 503 } : {
    json: { response: { docs: [{ related_search: 'campus jobs' }] } },
  }));
  await page.getByRole('button', { name: 'Preview with your Search App' }).click();
  await page.locator('[data-customer-options] summary').click();
  for (const [id, value] of Object.entries({
    'lab-customer-endpoint': app, 'lab-customer-token': 'test-only', 'lab-customer-query': query,
    'lab-customer-profile': 'Main', 'lab-customer-answer-endpoint': origin + '/api/v1/answer',
    'lab-customer-suggest-endpoint': origin + '/qa/emsuggest', 'lab-related-endpoint': origin + '/qa/related-search',
    'lab-discovery-key': 'test-only',
  })) await page.locator('#' + id).fill(value);
  await page.locator('[data-customer-submit]').click();
  await page.locator('[data-customer-connect-status]').filter({ hasText: 'Connected' }).waitFor();
  await page.locator('[data-lab-design-mode=preview]').click();
  const panel = page.locator('[data-single-experience]');
  const input = panel.locator('#lab-query');
  await input.fill('camp'); await center(input);
  const suggestions = panel.getByText('Search suggestions are unavailable. You can continue searching.');
  await observe('Optional suggestions', suggestions, input, 503);
  await input.press('Enter');
  await panel.locator('[data-customer-answer-status]').filter({ hasText: 'unavailable' }).waitFor();
  await panel.locator('.search-related-terms').filter({ hasText: 'unavailable' }).waitFor();
  await panel.getByRole('link', { name: 'Fixture result 1', exact: true }).waitFor();
  fail = false;
  await input.fill('campus'); await panel.getByRole('option', { name: 'campus library' }).waitFor();
  await input.press('Escape'); await input.press('Enter');
  await panel.getByText('Recovered answer', { exact: true }).waitFor();
  await panel.getByRole('button', { name: 'campus jobs' }).waitFor();
  log('Optional services recovered', { http: 200, resultsAvailableDuringFailure: true });
}
async function comparisons(page) {
  let block = true;
  await page.route('**/emselect**', r => block ? r.fulfill({ status: 503, body: 'Service unavailable' }) : r.continue());
  await page.goto(baseURL + '#lab-data-filters');
  const rule = page.getByLabel('Exclude News', { exact: true });
  // Activate a rule near the lower edge as well as testing the ordinary centered controls.
  await rule.evaluate(el => window.scrollBy({ top: el.getBoundingClientRect().bottom - innerHeight + 80, behavior: 'instant' }));
  await rule.check();
  const status = page.locator('[data-lab-filter-status]'), retry = page.locator('[data-lab-filter-retry]');
  await status.filter({ hasText: 'couldn’t load' }).waitFor();
  await observe('Data Filters comparison', status, retry, 503);
  block = false; await retry.press('Enter');
  await page.locator('[data-lab-filter-results]').waitFor();
  block = true; await page.goto(baseURL + '#lab-compare-ranking');
  const choice = page.locator('[data-lab-phase=after]');
  await center(choice); await choice.click();
  const compare = page.getByRole('button', { name: 'Retry comparison' });
  await observe('Search Fields and Ranking comparison', page.locator('[data-lab-comparison] + .search-recovery [role=status]'), compare, 503);
  block = false; await compare.press('Enter');
  await page.locator('[data-lab-comparison-table]').waitFor();
}
async function run() {
  const browser = await ({ chromium, webkit }[which]).launch(which === 'chromium' ? { channel: 'chrome' } : {});
  try {
    const cases = { single: p => connected(p, false), profiles: p => connected(p, true), visitor, returnToPreset, demoSearch, comparisons, optionalServices };
    const selected = process.env.QA_CASE ? [cases[process.env.QA_CASE]] : Object.values(cases);
    assert.ok(selected.every(Boolean), 'Unknown QA_CASE');
    const outcomes = await Promise.allSettled(selected.map(async test => {
      const page = await browser.newPage({ viewport: { width, height } });
      page.setDefaultTimeout(20000);
      try { await test(page); } finally { await page.close(); }
    }));
    for (const item of outcomes) if (item.status === 'rejected') console.error(item.reason);
    assert.ok(outcomes.every(item => item.status === 'fulfilled'));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
