const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright-core');
const { createSearchGuard, isSearchTraffic, positiveBudget, createBrowserFence } = require('./search-traffic.cjs');

test('release budget requires an explicit positive integer', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', 'Infinity', '999999999999999999999']) assert.throws(() => positiveBudget(value));
  assert.equal(positiveBudget('2'), 2);
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

  for (status of [302, 429]) {
    const count = requests;
    const release = await pageFor(ledger(5));
    assert.equal(await get(release), status === 302 ? 0 : 429);
    assert.equal(await get(release), 0);
    assert.equal(requests, count + 1);
  }
});
