const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium, assert, baseURL, liveQA } = require('./runtime.cjs');
const fixture = require('./fixtures/searchlabbuild-sorts.json');

const frameworks = ['javascript', 'react', 'vue', 'angular'];
const choices = [
  { value: '', label: 'Relevance' },
  ...fixture.sorts.map(sort => ({ value: sort.name + ' ' + sort.order, label: sort.label })),
];
const { campus: records } = require('./demo-fixture.cjs');
function expectedURLs(sort) {
  const urls = records.map(doc => doc.url);
  if (!sort) return urls;
  urls.sort();
  return sort === 'url asc' ? urls : urls.reverse();
}
const livePages = new WeakMap();

function observeCampus(page) {
  const batches = new Map();
  livePages.set(page, batches);
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.pathname.endsWith('/emselect') && url.searchParams.get('model') === fixture.profile &&
        url.searchParams.get('q') === 'campus' && !Number(url.searchParams.get('start'))) {
      batches.set(url.searchParams.get('sort') || '', response);
    }
  });
}

async function waitForOrder(page, sort) {
  let urls;
  if (liveQA) {
    // Start with the first page of the actual response; middle results can change as the index evolves.
    const responses = livePages.get(page);
    const response = responses.get(sort) || await page.waitForResponse(res => {
      const u = new URL(res.url());
      return u.pathname.endsWith('/emselect') && u.searchParams.get('q') === 'campus' &&
        u.searchParams.get('model') === fixture.profile && (u.searchParams.get('sort') || '') === sort;
    });
    assert.ok(response.ok(), 'Live campus query returned HTTP ' + response.status());
    const body = await response.json();
    assert.equal(body.response.numFound, 37);
    const urlField = body.metadata.results.find(mapping => mapping.result_card === 'url').name;
    urls = body.response.docs.map(doc => Array.isArray(doc[urlField]) ? doc[urlField][0] : doc[urlField]);
    assert.equal(urls[0], expectedURLs(sort)[0]);
    if (sort) {
      const expected = urls.toSorted();
      assert.deepEqual(urls, sort === 'url desc' ? expected.reverse() : expected);
    }
  } else urls = expectedURLs(sort).slice(0, 10);
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
    observeCampus(page);
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
      observeCampus(page);
      await page.goto(process.env.QA_STARTER_URL, { waitUntil: 'domcontentloaded' });
      const start = process.env.QA_SORT_START || '';
      const menu = page.getByRole('combobox', { name: process.env.QA_SORT_LABEL || 'Sort by', exact: true });
      await menu.waitFor();
      await page.waitForFunction(({ name, start }) => Array.from(document.querySelectorAll('select')).some(
        select => select.labels?.[0]?.textContent.includes(name) && select.value === start),
        { name: process.env.QA_SORT_LABEL || 'Sort by', start });
      const input = page.locator('input[type=search]:visible').first();
      // A starter can already open on campus if it was downloaded after this search.
      if (await input.inputValue() !== 'campus') await searchCampus(page, input);
      await checkMenu(page, process.env.QA_SORT_LABEL || 'Sort by', process.env.QA_SORT_PLACEMENT || 'above', start);
      console.log('Starter passed all three campus orders with starting sort ' + (start || 'relevance'));
    } else if (liveQA) {
      const page = await browser.newPage();
      observeCampus(page);
      await page.goto(baseURL + '#lab-design');
      await searchCampus(page, page.locator('#lab-query'));
      await checkMenu(page, 'Sort by', 'above', '');
      console.log('Verified live campus results in all three sort orders.');
    } else {
      const dir = process.env.QA_ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'search-lab-sort-controls-'));
      assert.equal(records.length, 37);
      assert.deepEqual(['', 'url asc', 'url desc'].map(sort => expectedURLs(sort)[0]),
        [fixture.baselines.relevance, fixture.baselines.urlAsc, fixture.baselines.urlDesc]
          .map(id => fixture.results.find(doc => doc.id === id).url));
      for (const { value } of choices) await checkBuild(browser, value, dir);
      console.log('Local fixture checks passed. Twelve ZIPs saved in ' + dir);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
