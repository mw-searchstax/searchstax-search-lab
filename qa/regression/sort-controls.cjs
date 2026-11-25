const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium, assert, baseURL } = require('./runtime.cjs');
const fixture = require('./fixtures/searchlabbuild-sorts.json');

const frameworks = ['javascript', 'react', 'vue', 'angular'];
const choices = [
  { value: '', label: 'Relevance' },
  ...fixture.sorts.map(sort => ({ value: sort.name + ' ' + sort.order, label: sort.label })),
];
const demoSite = 'https://mw-searchstax.github.io/university-health-search-demo/';
const records = [...fixture.results, ...Array.from({ length: fixture.syntheticCount }, (_, i) => {
  const id = 'fixture-' + String(i + 1).padStart(2, '0');
  return { id, url: demoSite + 'fixture-pages/' + id + '/', title: id };
})];

function orderedRecords(sort) {
  if (!sort) return records;
  const ascending = records.toSorted((a, b) => a.url.localeCompare(b.url));
  if (sort === 'url asc') return ascending;
  assert.equal(sort, 'url desc', 'Only published sorts can be sent');
  return ascending.reverse();
}

async function useSearchFixture(page) {
  await page.route(url => url.pathname.endsWith('/emselect'), async route => {
    const params = Object.fromEntries(new URL(route.request().url()).searchParams);
    const start = Number(params.start || 0);
    const rows = Number(params.rows || 10);
    const docs = orderedRecords(params.sort);
    await route.fulfill({ json: {
      responseHeader: { params: { ...params, uniqueId: 'id' } },
      response: { numFound: docs.length, start, docs: docs.slice(start, start + rows) },
      metadata: { sorts: fixture.sorts, facets: [], results: [
        { name: 'title', result_card: 'title' }, { name: 'url', result_card: 'url' },
      ] },
      facet_counts: { facet_fields: {} },
    } });
  });
}

async function waitForOrder(page, sort) {
  const urls = orderedRecords(sort).slice(0, 10).map(doc => doc.url);
  await page.waitForFunction(expected => {
    const links = [...document.querySelectorAll('.searchstax-search-result a')]
      .filter(link => link.getClientRects().length);
    return links.length === expected.length && links.every((link, i) => link.href === expected[i]);
  }, urls);
}

async function checkMenu(page, label, placement, start) {
  const menu = page.getByRole('combobox', { name: label, exact: true });
  await waitForOrder(page, start);
  await menu.waitFor();
  assert.deepEqual(await menu.locator('option').evaluateAll(options => options.map(({ text, value }) => ({ label: text, value }))), choices);
  assert.equal(await menu.inputValue(), start);
  const aboveResults = await menu.evaluate(el => Boolean(
    el.compareDocumentPosition(document.querySelector('.searchstax-search-result')) & Node.DOCUMENT_POSITION_FOLLOWING));
  assert.equal(aboveResults, placement === 'above');

  for (const { value } of choices) {
    if (await menu.inputValue() !== value) {
      const nextResponse = page.waitForResponse(res => {
        const url = new URL(res.url());
        return url.pathname.endsWith('/emselect') && url.searchParams.get('q') === 'campus' &&
          (url.searchParams.get('sort') || '') === value;
      });
      await menu.selectOption(value);
      assert.ok((await nextResponse).ok());
    }
    await waitForOrder(page, value);
  }
}

async function searchCampus(page, input) {
  const nextResponse = page.waitForResponse(res => {
    const url = new URL(res.url());
    return url.pathname.endsWith('/emselect') && url.searchParams.get('q') === 'campus';
  });
  await input.fill('campus');
  await input.press('Enter');
  assert.ok((await nextResponse).ok());
}

async function checkBuild(browser, start, artifactDir) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await useSearchFixture(page);
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Start designing' }).click();
    await page.getByRole('tab', { name: 'Appearance', exact: true }).click();
    await page.getByText('Sorting', { exact: true }).click();
    await page.getByLabel('Sort label', { exact: true }).fill('Order results');
    await page.getByRole('tab', { name: 'Features', exact: true }).click();
    await page.getByText('Filters and sorting', { exact: true }).click();
    await page.getByLabel('Starting sort', { exact: true }).selectOption(start);
    await page.locator('#lab-advanced > summary').click();
    await page.getByLabel('Sort placement').selectOption('below');
    await searchCampus(page, page.locator('#lab-query'));
    await page.getByText('37 results for “campus”', { exact: true }).waitFor();
    await checkMenu(page, 'Order results', 'below', start);
    await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
    for (const framework of frameworks) {
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + framework + '"]').click()]);
      const destination = path.join(artifactDir, start || 'relevance', framework);
      fs.mkdirSync(destination, { recursive: true });
      await download.saveAs(path.join(destination, 'starter.zip'));
    }
    console.log('Build passed and four ZIPs downloaded with starting sort ' + (start || 'relevance'));
  } finally { await page.close(); }
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    if (process.env.QA_STARTER_URL) {
      const page = await browser.newPage();
      await useSearchFixture(page);
      await page.goto(process.env.QA_STARTER_URL, { waitUntil: 'domcontentloaded' });
      const start = process.env.QA_SORT_START || '';
      await waitForOrder(page, start);
      const input = page.locator('input[type=search]:visible').first();
      // A starter can already open on campus if it was downloaded after this search.
      if (await input.inputValue() !== 'campus') await searchCampus(page, input);
      await checkMenu(page, process.env.QA_SORT_LABEL || 'Sort by', process.env.QA_SORT_PLACEMENT || 'above', start);
      console.log('Starter passed all three campus orders with starting sort ' + (start || 'relevance'));
    } else {
      const dir = process.env.QA_ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'search-lab-sort-controls-'));
      assert.equal(records.length, 37);
      assert.deepEqual(['', 'url asc', 'url desc'].map(sort => orderedRecords(sort)[0].id),
        [fixture.baselines.relevance, fixture.baselines.urlAsc, fixture.baselines.urlDesc]);
      for (const { value } of choices) await checkBuild(browser, value, dir);
      console.log('Local fixture checks passed. Twelve ZIPs saved in ' + dir);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
