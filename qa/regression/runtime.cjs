const assert = require('node:assert/strict');
const playwright = require('playwright-core');
const {
  createSearchGuard, isSearchTraffic, createBrowserFence, DEFAULT_PRODUCTION_ENDPOINT,
} = require('./search-traffic.cjs');

const releaseRun = process.env.QA_RELEASE_RUN;
const defaultURL = releaseRun ? 'https://mw-searchstax.github.io/searchstax-search-lab/' : 'http://127.0.0.1:4173/';
const baseURL = new URL(process.env.SEARCH_LAB_BASE_URL || process.argv[2] || defaultURL).href;
const localQA = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname);
const recordedQA = process.env.QA_RECORDED === '1';
// The fixture guard uses the same production-shaped endpoint as the hosted
// pilot. Its exact origin/path allowlist blocks the exhausted sandbox and any
// other SearchStax app during ordinary QA.
const liveEndpoint = new URL(DEFAULT_PRODUCTION_ENDPOINT);
const guard = createSearchGuard(releaseRun, liveEndpoint);
const injectFixtureMarker = !releaseRun && !recordedQA;

async function configureContext(context) {
  if (injectFixtureMarker) {
    await context.addInitScript(() => {
      if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.test')) {
        window.__SEARCH_LAB_FIXTURE__ = true;
      }
    });
  }
  return context;
}

// Cover Build, embeds, popups and unmodified ZIPs with the same network policy.
// Individual tests may fulfill their own fixtures. Pass-throughs must use route.fallback().
function qaEngine(engine) {
  return {
    async launch(options) {
      const fence = await createBrowserFence();
      let browser;
      try { browser = await engine.launch({ ...options, proxy: fence.proxy }); }
      catch (error) { await fence.close(); throw error; }
      browser.once('disconnected', () => fence.close());
      return {
        close: () => browser.close(),
        version: () => browser.version(),
        async newPage(options) {
          const page = await browser.newPage({ ...options, serviceWorkers: 'block' });
          await configureContext(page.context());
          await page.context().route(isSearchTraffic, guard);
          return page;
        },
        async newContext(options) {
          const context = await browser.newContext({ ...options, serviceWorkers: 'block' });
          await configureContext(context);
          await context.route(isSearchTraffic, guard);
          return context;
        },
      };
    },
  };
}

module.exports = {
  chromium: qaEngine(playwright.chromium), firefox: qaEngine(playwright.firefox), webkit: qaEngine(playwright.webkit),
  assert, baseURL, localQA, liveQA: Boolean(releaseRun),
};
