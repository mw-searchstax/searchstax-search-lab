const fs = require('node:fs');
const path = require('node:path');
const { unzipSync } = require('fflate');
const { assert, baseURL, chromium, webkit } = require('./runtime.cjs');

const frameworks = ['javascript', 'react', 'vue', 'angular'];
const sortBy = page => page.getByRole('combobox', { name: 'Sort by', exact: true });
const languageToggle = page => page.getByLabel('Show language picker');
const sortingToggle = page => page.getByLabel('Show sort options');

async function expectOrder(page, value, label) {
  const select = sortBy(page);
  await select.waitFor();
  assert.equal(await select.locator('option:checked').textContent(), label);
  assert.equal(await select.inputValue(), value);
}

async function exerciseSorting(page) {
  const results = page.locator('.searchstax-search-result a:visible');
  await results.first().waitFor();
  const original = await results.evaluateAll(links => links.map(link => link.href));
  assert.ok(original.length > 1, 'The demo query needs multiple results');
  await expectOrder(page, '', 'Relevance');
  for (const [value, label] of [['url asc', 'Page address (A–Z)'], ['url desc', 'Page address (Z–A)'], ['', 'Relevance']]) {
    await sortBy(page).selectOption(value);
    const expected = value === '' ? original : [...original].sort();
    if (value === 'url desc') expected.reverse();
    await page.waitForFunction(order => {
      const links = [...document.querySelectorAll('.searchstax-search-result a')].filter(el => el.getClientRects().length);
      return links.length === order.length && links.every((link, index) => link.href === order[index]);
    }, expected);
    await expectOrder(page, value, label);
  }
}

async function checkDownloads(page, enabled) {
  await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
  for (const framework of frameworks) {
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-lab-download-starter="' + framework + '"]').click()]);
    const files = unzipSync(fs.readFileSync(await download.path()));
    assert.equal('src/profile-experiences.js' in files, false);
    const config = files[framework === 'javascript' ? 'search.js' : 'src/config.js'];
    assert.match(Buffer.from(config).toString(), new RegExp('"showSorting":\\s*' + enabled));
    if (process.env.QA_SORT_EXPORT_DIR) {
      const dest = path.resolve(process.env.QA_SORT_EXPORT_DIR, enabled ? 'on' : 'off', framework);
      for (const [name, data] of Object.entries(files)) {
        const target = path.resolve(dest, name);
        assert.ok(target.startsWith(dest + path.sep));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, data);
      }
    }
  }
  await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
}

async function run() {
  const browser = process.env.QA_BROWSER === 'webkit' ? await webkit.launch() : await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (process.env.QA_STARTER_URL) {
      await page.goto(process.env.QA_STARTER_URL);
      await page.locator('.searchstax-search-result a:visible').first().waitFor();
      assert.equal(await page.locator('[data-exp-language] select:visible').count(), 0);
      if (process.env.QA_SORTING === 'off') assert.equal(await sortBy(page).isVisible(), false);
      else await exerciseSorting(page);
    } else {
      await page.goto(baseURL);
      await page.getByRole('link', { name: 'Start designing' }).click();
      assert.equal(await languageToggle(page).isChecked(), false);
      assert.equal(await page.locator('[data-exp-language] select:visible').count(), 0);
      await exerciseSorting(page);
      await page.getByText('Filters and sorting', { exact: true }).click();
      assert.ok(await sortingToggle(page).isChecked());
      await checkDownloads(page, true);
      const reset = page.getByRole('button', { name: 'Reset design', exact: true });
      await sortBy(page).selectOption('url desc');
      await reset.click();
      await expectOrder(page, '', 'Relevance');
      await page.locator('[data-lab-undo-reset]').click();
      await expectOrder(page, 'url desc', 'Page address (Z–A)');
      if (!await sortingToggle(page).isVisible()) await page.getByText('Filters and sorting', { exact: true }).click();
      await sortingToggle(page).uncheck();
      assert.equal(await sortBy(page).isVisible(), false);
      await checkDownloads(page, false);
      await page.reload();
      assert.equal(await sortingToggle(page).isChecked(), false);
      assert.equal(await sortBy(page).isVisible(), false);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
        document.execCommand = () => false;
      });
      await page.getByRole('button', { name: 'Share Design', exact: true }).click();
      await page.getByRole('button', { name: 'Copy design link' }).click();
      const link = page.getByRole('textbox', { name: 'Design link' });
      await link.waitFor();
      const shared = new URL(await link.inputValue());
      assert.equal(shared.searchParams.get('lab_sorting'), 'off');
      const recipient = await browser.newPage();
      await recipient.goto(shared.href);
      assert.equal(await sortingToggle(recipient).isChecked(), false);
      shared.searchParams.delete('lab_sorting');
      await recipient.goto(shared.href);
      assert.equal(await sortingToggle(recipient).isChecked(), false);
      await reset.click();
      await expectOrder(page, '', 'Relevance');
      assert.equal(await languageToggle(page).isChecked(), false);
    }
    assert.deepEqual(errors, []);
    console.log('Sorting defaults, visibility and relevance order passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
