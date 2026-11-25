// Download-focused fixture regression. This deliberately exercises the public
// Search Lab entry point and the generated archives without using a Search App.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium } = require('./runtime.cjs');

const frameworks = ['javascript', 'react', 'vue', 'angular'];
const modes = {
  ordinary: { lab_profile_tabs: 'off', lab_languages: 'off' },
  navigation: { lab_profile_tabs: 'on', lab_languages: 'off' },
};
const artifactRoot = process.env.QA_ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'search-lab-starter-fixture-'));
const demoEndpoint = require('../../public/config/searchlabdemo.json').endpoint;
const pilotEndpoint = require('../../public/config/searchlabpilot.json').endpoint;
const blockedValues = [new URL(demoEndpoint).host, new URL(pilotEndpoint).host];

function pageURL(mode) {
  const values = { lab_page_size: '5', ...modes[mode] };
  return baseURL + '?' + new URLSearchParams(values) + '#lab-design';
}

function archiveText(files) {
  return Object.entries(files).map(([name, bytes]) => name + '\n' + Buffer.from(bytes).toString()).join('\n');
}

function inspectArchive(mode, framework, bytes, connected = false) {
  const files = unzipSync(bytes);
  const text = archiveText(files);
  for (const value of blockedValues) assert.equal(text.includes(value), false, mode + '/' + framework + ' excludes ' + value);
  assert.equal(text.includes('searchlabdemo-16707'), false, mode + '/' + framework + ' excludes exhausted demo app');
  assert.equal(text.includes('searchlabpilot-16785'), false, mode + '/' + framework + ' excludes pilot app');
  assert.ok(files['README.md'], mode + '/' + framework + ' README');
  const profile = mode === 'navigation';
  if (profile) {
    assert.ok(files['src/profile-experiences.js'], mode + '/' + framework + ' profile runtime');
    assert.ok(files['src/config.js'], mode + '/' + framework + ' profile config');
    assert.ok(files['src/recorded-search.js'], mode + '/' + framework + ' recorded runtime');
    assert.ok(files['src/recorded-searches.js'], mode + '/' + framework + ' recordings');
    assert.match(Buffer.from(files['src/config.js']).toString(), /"endpoint":"\.\/__search-lab-recorded-search"/);
  } else if (framework === 'javascript') {
    assert.ok(files['search.js'], mode + '/' + framework + ' runtime');
    assert.ok(files['recorded-search.js'], mode + '/' + framework + ' recorded runtime');
    assert.ok(files['recorded-searches.js'], mode + '/' + framework + ' recordings');
    const source = Buffer.from(files['search.js']).toString();
    assert.match(source, /recorded-search/);
    if (connected) {
      assert.match(source, /"searchURL": ""/);
      assert.match(source, /"searchAuth": ""/);
    }
  } else {
    assert.ok(files['src/config.js'], mode + '/' + framework + ' config');
    assert.ok(files['src/recorded-search.js'], mode + '/' + framework + ' recorded runtime');
    assert.ok(files['src/recorded-searches.js'], mode + '/' + framework + ' recordings');
    const config = Buffer.from(files['src/config.js']).toString();
    if (connected) {
      assert.match(config, /"searchURL": ""/);
      assert.match(config, /"searchAuth": ""/);
    } else {
      assert.match(config, /__search-lab-recorded-search/);
    }
  }
  const dir = path.join(artifactRoot, connected ? 'connected' : mode, framework);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'starter.zip'), bytes);
  return files;
}

async function download(page, mode, framework, connected = false) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-lab-download-starter="' + framework + '"]').click(),
  ]);
  const file = await download.path();
  assert.ok(file, mode + '/' + framework + ' download completed');
  return inspectArchive(mode, framework, fs.readFileSync(file), connected);
}

async function run() {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
  try {
    for (const mode of Object.keys(modes)) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      if (mode === 'ordinary' || mode === 'navigation') {
        // Local builds intentionally omit the pilot token. The recorded
        // transport accepts this marker, which lets us exercise the hosted
        // profile-tab path without authorizing a live request.
        await page.addInitScript(() => {
          const apply = () => document.querySelector('[data-search-credential]')?.setAttribute('data-search-credential', 'recorded-only');
          new MutationObserver(apply).observe(document, { childList: true, subtree: true });
          apply();
        });
      }
      await page.goto(pageURL(mode), { waitUntil: 'domcontentloaded' });
      const starterButton = page.getByRole('button', { name: 'Get starter code', exact: true });
      await starterButton.waitFor();
      await starterButton.click();
      const query = page.getByRole('searchbox', { name: 'Search the website' });
      await query.fill('rehabilitation');
      await query.press('Enter');
      const summary = page.getByText(/(?:^\d+ results? for “rehabilitation”$|Showing \d+ through \d+ results? from \d+)/).filter({ visible: true }).first();
      await summary.waitFor();
      assert.ok(Number((await summary.innerText()).match(/(?:^|from )([0-9]+)/)?.[1] || 0) > 0, mode + ' has sample results');
      await page.locator('.searchstax-search-result-title:visible, .mapped-result-card:visible').first().waitFor();
      assert.ok(await page.getByText(/^(Programs|Locations|Providers)$/, { exact: true }).count() >= 1,
        mode + ' has a facet label');
      for (const framework of frameworks) await download(page, mode, framework);
      assert.deepEqual(errors, [], mode + ' has no page errors');
      await page.close();
    }

    // Connect a synthetic customer app through the normal editor entry point,
    // then verify all four connected archives are blank for visitor settings.
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(15000);
    const origin = 'https://review.searchstax.com';
    const query = 'qa-starter-customer';
    await page.route(origin + '/**', route => route.fulfill({ json: {
      response: { numFound: 1, docs: [{ id: 'customer', url: 'https://example.org/customer', title: 'Customer fixture', description: 'Fixture result' }] },
      responseHeader: { params: { uniqueId: 'id' } },
      metadata: { results: [{ name: 'title', result_card: 'title' }, { name: 'url', result_card: 'url' }, { name: 'description', result_card: 'description' }] },
    } }));
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: 'Start designing' }).click();
    await page.getByRole('button', { name: 'Preview with your Search App' }).click();
    await page.locator('[data-customer-options] summary').click();
    await page.locator('#lab-customer-endpoint').fill(origin + '/qa/emselect');
    await page.locator('#lab-customer-token').fill('qa-select-sentinel');
    await page.locator('#lab-customer-query').fill(query);
    await page.locator('#lab-customer-profile').fill('Main');
    await page.locator('#lab-customer-language').fill('en');
    await page.locator('#lab-app-configuration').setInputFiles(path.join(__dirname, '../../public/examples/search-lab-configuration.json'));
    await page.locator('[data-customer-submit]').click();
    await page.getByRole('link', { name: 'Customer fixture' }).waitFor();
    await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
    for (const framework of frameworks) {
      const files = await download(page, 'connected', framework, true);
      const prefix = framework === 'javascript' ? '' : 'src/';
      const configName = prefix + (framework === 'javascript' ? 'search.js' : 'config.js');
      assert.ok(files[configName], 'connected/' + framework + ' config');
    }
    await page.close();
  } finally {
    await browser.close();
  }
  console.log('Starter fixture archives verified: ' + artifactRoot);
}

run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
