const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const playwright = require('playwright-core');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { endpoint } = require('../../public/config/searchlabdemo.json');
const { searchResponse } = require('./demo-fixture.cjs');

const demo = new URL(endpoint);
const DESIGNATED_HOST = 'Matts-MacBook-Pro.local';
const RELEASE_LIMIT = 10;
const MONTH_LIMIT = 100;
const DEFAULT_PRODUCTION_ENDPOINT = 'https://searchcloud-28-us-east-1.searchstax.com/29847/searchlabpilot-16785/emselect';
const DEFAULT_LEDGER = path.join(os.homedir(), 'Library', 'Application Support', 'Search Lab', 'qa-live-budget.json');
const RELEASE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

function isPlainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype;
}

function validateReleaseId(value) {
  if (typeof value !== 'string' || !RELEASE_ID_PATTERN.test(value)) {
    throw Error('The release ID is invalid. Use letters, numbers, dots, underscores, or hyphens only.');
  }
  return value;
}

function validateMonth(value) {
  if (typeof value !== 'string' || !MONTH_PATTERN.test(value)) {
    throw Error('The budget month is invalid. Refusing to send a request.');
  }
  return value;
}

function validateCounter(value, ceiling, label) {
  if (!Number.isSafeInteger(value) || value < 0 || value > ceiling) {
    throw Error('The live request budget ledger has an invalid ' + label + '. Refusing to send a request.');
  }
}

function validateLedger(value) {
  if (!isPlainRecord(value) || value.version !== 1 || !isPlainRecord(value.months) ||
      !isPlainRecord(value.releases) || !Array.isArray(value.reservations)) {
    throw Error('invalid');
  }
  for (const [month, entry] of Object.entries(value.months)) {
    validateMonth(month);
    if (!isPlainRecord(entry)) throw Error('invalid');
    validateCounter(entry.count, MONTH_LIMIT, 'monthly counter');
  }
  for (const [releaseId, entry] of Object.entries(value.releases)) {
    validateReleaseId(releaseId);
    if (!isPlainRecord(entry)) throw Error('invalid');
    validateCounter(entry.count, RELEASE_LIMIT, 'release counter');
  }
  for (const entry of value.reservations) {
    if (!isPlainRecord(entry) || typeof entry.releaseId !== 'string' ||
        typeof entry.month !== 'string' || typeof entry.at !== 'string' ||
        typeof entry.purpose !== 'string' || (entry.endpoint !== null && typeof entry.endpoint !== 'string')) {
      throw Error('invalid');
    }
    validateReleaseId(entry.releaseId);
    validateMonth(entry.month);
  }
  return value;
}

function resolveReleaseId() {
  if (process.env.QA_RELEASE_ID?.trim()) return validateReleaseId(process.env.QA_RELEASE_ID.trim());
  try {
    return validateReleaseId(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() || 'unknown');
  } catch {
    return 'unknown';
  }
}

function monthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric', month: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return values.year + '-' + values.month;
}

function ledgerPath(value) {
  return value || DEFAULT_LEDGER;
}

function ensureBudgetHost(hostName = os.hostname(), enforce = true) {
  if (enforce && hostName !== DESIGNATED_HOST) {
    throw Error('Live request budgets are enabled only on ' + DESIGNATED_HOST + '.');
  }
}

function readLedger(file) {
  try {
    return validateLedger(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 1, months: {}, releases: {}, reservations: [] };
    throw Error('The live request budget ledger is unreadable. Refusing to send a request.');
  }
}

function lockLedger(file) {
  const lock = file + '.lock';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    try {
      const handle = fs.openSync(lock, 'wx');
      return { lock, handle };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  throw Error('The live request budget ledger is locked. Refusing to send a request.');
}

function unlockLedger(lock) {
  try { fs.closeSync(lock.handle); } finally { fs.unlinkSync(lock.lock); }
}

function writeLedger(file, ledger) {
  const temporary = file + '.tmp-' + process.pid + '-' + Math.random().toString(36).slice(2);
  fs.writeFileSync(temporary, JSON.stringify(ledger, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(temporary, file);
}

function claimLiveRequest(options = {}) {
  const file = ledgerPath(options.ledgerPath);
  ensureBudgetHost(options.hostName, options.enforceHost !== false);
  const releaseId = validateReleaseId(options.releaseId || resolveReleaseId());
  const month = validateMonth(options.month || monthKey(options.now));
  const requestedReleaseLimit = options.releaseLimit ?? RELEASE_LIMIT;
  const requestedMonthLimit = options.monthLimit ?? MONTH_LIMIT;
  if (!Number.isSafeInteger(requestedReleaseLimit) || requestedReleaseLimit < 1 ||
      !Number.isSafeInteger(requestedMonthLimit) || requestedMonthLimit < 1) {
    throw Error('The live request budget limits are invalid. Refusing to send a request.');
  }
  // Lower limits are useful in fixture tests; callers can never raise the
  // production ceilings through a flag, environment variable, or config file.
  const releaseLimit = Math.min(requestedReleaseLimit, RELEASE_LIMIT);
  const monthLimit = Math.min(requestedMonthLimit, MONTH_LIMIT);
  const lock = lockLedger(file);
  try {
    const ledger = readLedger(file);
    const currentMonth = ledger.months[month] || { count: 0 };
    const release = ledger.releases[releaseId] || { count: 0 };
    if (currentMonth.count >= monthLimit) throw Error('The monthly live request budget is exhausted.');
    if (release.count >= releaseLimit) throw Error('The live request budget for release ' + releaseId + ' is exhausted.');
    currentMonth.count += 1;
    release.count += 1;
    ledger.months[month] = currentMonth;
    ledger.releases[releaseId] = release;
    ledger.reservations = Array.isArray(ledger.reservations) ? ledger.reservations : [];
    ledger.reservations.push({
      releaseId, month, at: new Date().toISOString(),
      purpose: options.purpose || 'release verification', endpoint: options.endpoint || null,
    });
    writeLedger(file, ledger);
    return { releaseId, month, releaseUsed: release.count, monthUsed: currentMonth.count, ledgerPath: file };
  } finally {
    unlockLedger(lock);
  }
}

function validateCaptureEndpoint(value, expected = DEFAULT_PRODUCTION_ENDPOINT) {
  let url;
  try { url = new URL(value); } catch { throw Error('Capture endpoint must be an HTTPS SearchStax Select endpoint.'); }
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.searchstax.com') || !url.pathname.endsWith('/emselect')) {
    throw Error('Capture endpoint must be an HTTPS SearchStax /emselect endpoint.');
  }
  if (url.pathname.includes('searchlabdemo-16707')) throw Error('The exhausted SearchLabDemo endpoint cannot be used for capture.');
  if (expected && value !== expected) throw Error('Capture endpoint does not match SEARCH_LAB_PRODUCTION_ENDPOINT.');
  return url.href;
}

function reserveCaptureRequests(count, options = {}) {
  const total = positiveBudget(String(count));
  const endpointValue = validateCaptureEndpoint(options.endpoint);
  const reservations = [];
  for (let index = 0; index < total; index += 1) {
    reservations.push(claimLiveRequest({ ...options, endpoint: endpointValue, purpose: options.purpose || 'recorded-data capture' }));
  }
  return reservations;
}
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
  let claimed = false;
  for (let i = 1; i <= limit; i++) {
    try {
      fs.writeFileSync(path.join(dir, 'request-' + i), '', { flag: 'wx' });
      claimed = true;
      break;
    } catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  if (!claimed) {
    stopRun(dir, 'Request budget exhausted');
    return false;
  }
  if (process.env.QA_RELEASE_RUN) {
    try {
      const configuredLedger = process.env.QA_BUDGET_LEDGER;
      const stableLedger = ledgerPath();
      if (process.env.QA_DRY_RUN !== '1' && configuredLedger && path.resolve(configuredLedger) !== path.resolve(stableLedger)) {
        throw Error('The live request ledger override is not allowed.');
      }
      const claimLedger = process.env.QA_DRY_RUN === '1'
        ? path.join(dir, 'dry-run-budget.json')
        : stableLedger;
      claimLiveRequest({
        ledgerPath: claimLedger,
        releaseId: process.env.QA_RELEASE_ID,
        endpoint: DEFAULT_PRODUCTION_ENDPOINT,
      });
    } catch (error) {
      stopRun(dir, error.message);
      return false;
    }
  }
  return true;
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
    // Dry runs still claim a release slot and exercise the exact production
    // URL, but the upstream response is fulfilled locally. This requires an
    // explicit QA flag and is never enabled by ordinary fixture mode.
    if (process.env.QA_DRY_RUN === '1') {
      return route.fulfill({ json: searchResponse(new URL(route.request().url())) });
    }
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
module.exports = {
  isSearchTraffic, createSearchGuard, positiveBudget, createBrowserFence,
  claimLiveRequest, reserveCaptureRequests, resolveReleaseId, ledgerPath,
  monthKey, validateCaptureEndpoint, DEFAULT_PRODUCTION_ENDPOINT,
  DESIGNATED_HOST, RELEASE_LIMIT, MONTH_LIMIT,
};
