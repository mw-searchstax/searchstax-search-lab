const fs = require('node:fs');
const net = require('node:net');
const playwright = require('playwright-core');
const path = require('node:path');
const { endpoint } = require('../../public/config/searchlabdemo.json');
const { searchResponse } = require('./demo-fixture.cjs');

const demo = new URL(endpoint);
function isSearchTraffic(url) {
  return url.origin === demo.origin || /\/(?:emselect|select|emsuggest|autocomplete|answer|related-search|related-content)(?:\/|$)/i.test(url.pathname);
}

// Only the QA page and its static assets need direct browser connections. Anything else
// goes to a loopback socket that closes without forwarding, including route.continue().
async function createBrowserFence() {
  const server = net.createServer(socket => socket.destroy());
  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
  const direct = ['localhost', '127.0.0.1', '[::1]', 'mw-searchstax.github.io', 'cdn.jsdelivr.net',
    'fonts.googleapis.com', 'fonts.gstatic.com', 'support.searchstax.com', '*.zendesk.com', '*.zdassets.com'];
  return {
    proxy: { server: 'http://127.0.0.1:' + server.address().port, bypass: direct.join(',') },
    close: () => new Promise(resolve => server.close(resolve)),
  };
}

function positiveBudget(value) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) throw Error('Set a positive integer request budget.');
  return Number(value);
}

// One atomic slot per attempted upstream call, shared by every browser and child process in the release run.
function claimSlot(dir) {
  if (fs.existsSync(path.join(dir, 'stopped'))) return false;
  const limit = positiveBudget(fs.readFileSync(path.join(dir, 'limit'), 'utf8'));
  for (let i = 1; i <= limit; i++) {
    try {
      fs.writeFileSync(path.join(dir, 'request-' + i), '', { flag: 'wx' });
      return true;
    } catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  stopRun(dir, 'Request budget exhausted');
  return false;
}

function stopRun(dir, message) {
  try { fs.writeFileSync(path.join(dir, 'stopped'), message, { flag: 'wx' }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
}

function createSearchGuard(dir, allowed = demo) {
  return async route => {
    const url = new URL(route.request().url());
    if (url.origin !== allowed.origin || url.pathname !== allowed.pathname || route.request().method() !== 'GET') {
      return route.abort('blockedbyclient');
    }
    if (!dir) return route.fulfill({ json: searchResponse(url) });
    if (!claimSlot(dir)) return route.abort('blockedbyclient');
    // Fetch once. Browser-managed redirects or HTTP retries could otherwise escape the budget.
    let upstream;
    try {
      upstream = await playwright.request.newContext();
      const response = await upstream.fetch(route.request(), { maxRedirects: 0, maxRetries: 0, timeout: 15000 });
      if (response.status() === 429) stopRun(dir, 'Search service returned HTTP 429');
      if (response.status() >= 300 && response.status() < 400) {
        stopRun(dir, 'Search endpoint redirected');
        return await route.abort('blockedbyclient');
      }
      await route.fulfill({ response });
    } catch {
      // The upstream request has already consumed a slot, even if the service disconnects.
      await route.abort('failed').catch(() => {});
    } finally { await upstream?.dispose(); }
  };
}
module.exports = { isSearchTraffic, createSearchGuard, positiveBudget, createBrowserFence };
