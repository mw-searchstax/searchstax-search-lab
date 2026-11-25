const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright-core');
const {
  createSearchGuard, isSearchTraffic, positiveBudget, createBrowserFence,
  claimLiveRequest, reserveCaptureRequests, validateCaptureEndpoint,
  DEFAULT_PRODUCTION_ENDPOINT,
} = require('./search-traffic.cjs');

test('release budget requires an explicit positive integer', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', 'Infinity', '999999999999999999999']) assert.throws(() => positiveBudget(value));
  assert.equal(positiveBudget('2'), 2);
});

test('persistent ledger enforces release and monthly caps atomically', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-qa-ledger-'));
  const file = path.join(dir, 'budget.json');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const common = {
    ledgerPath: file, hostName: 'test-host', enforceHost: false,
    releaseId: 'release-a', month: '2026-11', releaseLimit: 2, monthLimit: 3,
    endpoint: DEFAULT_PRODUCTION_ENDPOINT,
  };
  const attempts = await Promise.allSettled(Array.from({ length: 4 }, () =>
    Promise.resolve().then(() => claimLiveRequest(common))));
  assert.equal(attempts.filter(result => result.status === 'fulfilled').length, 2);
  assert.equal(attempts.filter(result => result.status === 'rejected').length, 2);

  assert.doesNotThrow(() => claimLiveRequest({ ...common, releaseId: 'release-b' }));
  assert.throws(() => claimLiveRequest({ ...common, releaseId: 'release-c' }), /monthly live request budget is exhausted/);
  const ledger = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(ledger.months['2026-11'].count, 3);
  assert.equal(ledger.releases['release-a'].count, 2);
  assert.equal(ledger.reservations.length, 3);

  const cappedFile = path.join(dir, 'capped.json');
  for (let index = 0; index < 10; index += 1) {
    assert.doesNotThrow(() => claimLiveRequest({
      ledgerPath: cappedFile, hostName: 'test-host', enforceHost: false,
      releaseId: 'cap-check', month: '2026-11', releaseLimit: 999, monthLimit: 999,
    }));
  }
  assert.throws(() => claimLiveRequest({
    ledgerPath: cappedFile, hostName: 'test-host', enforceHost: false,
    releaseId: 'cap-check', month: '2026-11', releaseLimit: 999, monthLimit: 999,
  }), /release .* exhausted/);
});

test('malformed ledger state and release IDs fail closed', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-qa-invalid-'));
  const file = path.join(dir, 'budget.json');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(file, JSON.stringify({
    version: 1, months: { '2026-11': { count: '2' } }, releases: {}, reservations: [],
  }));
  assert.throws(() => claimLiveRequest({
    ledgerPath: file, hostName: 'test-host', enforceHost: false,
    releaseId: 'invalid-ledger-check', month: '2026-11',
  }), /ledger is unreadable/);
  fs.writeFileSync(file, JSON.stringify({ version: 1, months: {}, releases: {}, reservations: [] }));
  assert.throws(() => claimLiveRequest({
    ledgerPath: file, hostName: 'test-host', enforceHost: false,
    releaseId: '../other-ledger', month: '2026-11',
  }), /release ID is invalid/);
});

test('capture reservations share the ledger and accept only the new production endpoint', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-qa-capture-'));
  const file = path.join(dir, 'budget.json');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  assert.equal(validateCaptureEndpoint(DEFAULT_PRODUCTION_ENDPOINT), DEFAULT_PRODUCTION_ENDPOINT);
  assert.throws(() => validateCaptureEndpoint('https://searchcloud-28-us-east-1.searchstax.com/29847/searchlabdemo-16707/emselect'), /exhausted/);
  assert.throws(() => validateCaptureEndpoint('https://example.test/anything/emselect'), /HTTPS SearchStax/);
  assert.throws(() => validateCaptureEndpoint(DEFAULT_PRODUCTION_ENDPOINT, 'https://different.searchstax.com/29847/other/emselect'), /does not match/);

  const reservations = reserveCaptureRequests(2, {
    ledgerPath: file, hostName: 'other-checkout-host', enforceHost: false,
    releaseId: 'pilot-recovery-2026-11', month: '2026-11', releaseLimit: 10, monthLimit: 100,
    endpoint: DEFAULT_PRODUCTION_ENDPOINT, purpose: 'recorded opening example capture',
  });
  assert.equal(reservations.length, 2);
  const ledger = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(ledger.months['2026-11'].count, 2);
  assert.deepEqual(ledger.reservations.map(entry => entry.purpose), [
    'recorded opening example capture', 'recorded opening example capture',
  ]);
  assert.ok(ledger.reservations.every(entry => entry.endpoint === DEFAULT_PRODUCTION_ENDPOINT));
});

test('guard enforces the same budget in every browser context before dispatch', async t => {
  let requests = 0;
  let status = 200;
  const server = http.createServer((req, res) => {
    if (req.url === '/') return res.writeHead(200, { 'content-type': 'text/html' }).end('<title>Local fixture QA</title>');
    if (!req.url.startsWith('/emselect')) return res.writeHead(404).end();
    requests++;
    res.writeHead(status, { 'content-type': 'application/json', ...(status === 302 ? { location: '/emselect?redirected' } : {}) }).end('{}');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  t.after(() => new Promise(resolve => server.close(resolve)));
  const fence = await createBrowserFence();
  t.after(() => fence.close());
  const browser = await chromium.launch({ channel: 'chrome', proxy: fence.proxy,
    args: ['--host-resolver-rules=MAP qa-upstream.test 127.0.0.1'] });
  t.after(() => browser.close());

  function ledger(budget) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-qa-test-'));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    fs.writeFileSync(path.join(dir, 'limit'), String(budget));
    return dir;
  }
  async function pageFor(dir) {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    await context.route(isSearchTraffic, createSearchGuard(dir, new URL(origin + '/emselect')));
    const page = await context.newPage();
    await page.goto(origin);
    return page;
  }
  const get = page => page.evaluate(() => fetch('/emselect?q=campus&model=SearchLabBuild').then(r => r.status).catch(() => 0));

  const local = await pageFor();
  assert.equal(await get(local), 200);
  assert.equal(requests, 0);

  // Even an accidental higher-priority continue() cannot open a direct connection.
  const bypass = await browser.newPage();
  await bypass.route('**/emselect*', route => route.continue());
  await assert.rejects(bypass.goto(origin.replace('127.0.0.1', 'qa-upstream.test') + '/emselect', { timeout: 4000 }));
  assert.equal(requests, 0);

  const shared = ledger(2);
  const [one, two] = await Promise.all([pageFor(shared), pageFor(shared)]);
  const statuses = await Promise.all([get(one), get(two), get(one), get(two)]);
  assert.deepEqual(statuses.sort(), [0, 0, 200, 200]);
  assert.equal(requests, 2);

  for (const responseStatus of [302, 429]) {
    const count = requests;
    status = responseStatus;
    const release = await pageFor(ledger(5));
    assert.equal(await get(release), responseStatus === 302 ? 0 : 429);
    assert.equal(await get(release), 0);
    assert.equal(requests, count + 1);
  }
});
