const assert = require('node:assert/strict');
const playwright = require('playwright-core');
const { createSearchGuard, isSearchTraffic, createBrowserFence } = require('./search-traffic.cjs');

const releaseRun = process.env.QA_RELEASE_RUN;
const defaultURL = releaseRun ? 'https://mw-searchstax.github.io/searchstax-search-lab/' : 'http://127.0.0.1:4173/';
const baseURL = new URL(process.env.SEARCH_LAB_BASE_URL || process.argv[2] || defaultURL).href;
const localQA = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname);
const guard = createSearchGuard(releaseRun);

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
          await page.context().route(isSearchTraffic, guard);
          return page;
        },
        async newContext(options) {
          const context = await browser.newContext({ ...options, serviceWorkers: 'block' });
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
