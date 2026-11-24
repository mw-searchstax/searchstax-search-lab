const fs = require('node:fs');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium, firefox, webkit } = require('./runtime.cjs');

const name = process.env.QA_BROWSER || 'chromium';
const engine = { chromium, firefox, webkit }[name];
const tab = (page, section) => page.getByRole('tab', { name: section, exact: true });

async function start(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 920 } });
  page.setDefaultTimeout(12000);
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'Start designing' }).click();
  assert.equal(await page.locator('#lab-preview').count(), 1);
  return page;
}

async function spanishDesign(browser) {
  const page = await start(browser, 1440);
  await page.locator('#lab-advanced > summary').click();
  await page.getByLabel('Show profile tabs').check();
  await page.getByLabel('Show language picker').check();
  const preview = page.locator('#lab-experiences');
  await preview.locator('[data-exp-language] select').selectOption('es');
  await tab(preview, 'Ubicaciones').click();
  const input = preview.getByRole('searchbox');
  await input.fill('clínica');
  await input.press('Enter');
  const facet = preview.locator('[data-exp-facets] input').nth(1);
  await facet.check();
  const results = preview.locator('li a');
  await results.waitFor();
  const title = await results.innerText();
  await input.fill('an unfinished query');
  const original = await page.locator('#lab-preview').elementHandle();
  await tab(page, 'Appearance').click();
  await tab(page, 'Appearance').press('ArrowLeft');
  assert.equal(await tab(page, 'Features').getAttribute('aria-selected'), 'true');
  assert.equal(await input.inputValue(), 'an unfinished query');
  assert.equal(await preview.locator('[data-exp-language] select').inputValue(), 'es');
  assert.equal(await tab(preview, 'Ubicaciones').getAttribute('aria-selected'), 'true');
  assert.ok(await facet.isChecked());
  assert.equal(await results.innerText(), title);
  assert.match(await preview.locator('[data-exp-summary]').innerText(), /clínica/);
  assert.ok(await original.evaluate(el => el === document.querySelector('#lab-preview')));
  await page.close();
  console.log('Passed Spanish profile, selected facet, submitted search, draft, and shared preview.');
}

async function connectedDesign(browser) {
  const page = await start(browser, 1440);
  const endpoint = 'https://review.searchstax.com/fixture/emselect';
  const sentinel = 'qa-only-secret-marker';
  const tracking = [];
  let requests = 0;
  page.on('request', req => {
    if (/emsearchclick|_searchclick|analytics|tracking/i.test(new URL(req.url()).pathname)) tracking.push(req.method());
  });
  await page.route(endpoint + '**', route => {
    requests++;
    const params = new URL(route.request().url()).searchParams;
    const start = Number(params.get('start') || 0);
    const size = Math.min(Number(params.get('rows') || 10), 27 - start);
    const docs = Array.from({ length: size }, (_, i) => ({
      title: 'Clinic ' + (start + i + 1), url: 'https://example.org/clinic/' + (start + i + 1),
      description: 'A fictional clinic',
    }));
    return route.fulfill({ json: { metadata: { results: ['title', 'url', 'description'].map(name => ({ name, result_card: name })), facets: [{ name: 'type', label: 'Content type' }] },
      facet_counts: { facet_fields: { type: ['Clinic', 27] } }, response: { numFound: 27, docs } } });
  });
  await page.getByRole('button', { name: 'Preview with your Search App' }).click();
  await page.locator('#lab-customer-endpoint').fill(endpoint);
  await page.locator('#lab-customer-token').fill(sentinel);
  await page.locator('#lab-customer-query').fill('campus clinic');
  await page.locator('[data-customer-options] summary').click();
  await page.locator('#lab-related-endpoint').fill('https://review.searchstax.com/fixture/related-search');
  await page.locator('[data-customer-submit]').click();
  await page.getByText(/Enter both the HTTPS Related Searches endpoint/).waitFor();
  await page.locator('#lab-related-endpoint').fill('');
  await page.locator('[data-customer-submit]').click();
  const grid = page.locator('[data-customer-grid]');
  await grid.getByRole('link', { name: 'Clinic 1', exact: true }).waitFor();
  await page.locator('[data-customer-next]').press('Enter');
  const second = grid.getByRole('link', { name: 'Clinic 12', exact: true });
  await second.waitFor();
  const range = await page.locator('[data-customer-range]').innerText();
  assert.match(range, /11.*20/);
  const before = requests;
  await page.locator('#lab-query').fill('unfinished');
  await tab(page, 'Appearance').click();
  await tab(page, 'Features').click();
  await tab(page, 'Features').press('End');
  assert.equal(await page.locator('#lab-query').inputValue(), 'unfinished');
  assert.equal(await page.locator('[data-customer-range]').innerText(), range);
  assert.ok(await second.isVisible());
  await page.getByRole('button', { name: 'Get starter code' }).click();
  for (const framework of ['javascript', 'react', 'vue', 'angular']) {
    const [file] = await Promise.all([page.waitForEvent('download'),
      page.locator('[data-lab-download-starter="' + framework + '"]').click()]);
    const entries = Object.values(unzipSync(fs.readFileSync(await file.path())));
    assert.ok(entries.every(bytes => !Buffer.from(bytes).includes(sentinel)), framework + ' ZIP contains the QA token');
  }
  assert.equal(requests, before);
  assert.deepEqual(tracking, []);
  const saved = await page.evaluate(() => [location.href, JSON.stringify(localStorage), JSON.stringify(sessionStorage)]);
  assert.ok(saved.every(value => !value.includes(sentinel)));
  await page.getByRole('button', { name: 'Return to the fictional demo' }).click();
  assert.equal(await page.locator('#lab-customer-token').inputValue(), '');
  await page.close();
  console.log('Passed pairing validation, page two, draft, four credential-free ZIPs, default tracking and disconnect.');
}

async function mobileEditor(browser) {
  const page = await start(browser, 390);
  await page.locator('#lab-advanced > summary').click();
  await page.getByLabel('Show profile tabs').check();
  await tab(page, 'Appearance').click();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const preview = page.locator('#lab-experiences');
  await preview.getByRole('searchbox').fill('health');
  await preview.getByRole('searchbox').press('Enter');
  await preview.getByRole('link', { name: 'Public Health' }).waitFor();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  assert.equal(await tab(page, 'Appearance').getAttribute('aria-selected'), 'true');
  await tab(page, 'Features').click();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  assert.equal(await preview.getByRole('searchbox').inputValue(), 'health');
  assert.ok(await preview.getByRole('link', { name: 'Public Health' }).isVisible());
  await page.close();
  console.log('Passed phone Edit/Preview and retained results.');
}

async function run() {
  assert.ok(engine, 'Choose chromium, firefox, or webkit');
  const browser = await engine.launch(name === 'chromium' ? { channel: 'chrome' } : {});
  try {
    await spanishDesign(browser);
    await connectedDesign(browser);
    await mobileEditor(browser);
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
