const { assert, baseURL, chromium, firefox, webkit } = require('./runtime.cjs');
const { observeLesson, searchFields } = require('./live-lesson-diagnostics.cjs');

const engineName = process.env.QA_BROWSER || 'chromium';
const engines = { chromium, firefox, webkit };

async function run() {
  const engine = engines[engineName];
  assert.ok(engine, 'Choose chromium, firefox, or webkit');
  const browser = await engine.launch(engineName === 'chromium' ? { channel: 'chrome' } : {});
  try {
    const width = Number(process.env.QA_WIDTH || 1440);
    const articleURL = process.env.QA_HELP_CENTER_URL;
    const context = await browser.newContext({
      viewport: { width, height: width <= 850 ? 844 : 960 },
      storageState: process.env.QA_STORAGE_STATE || undefined,
    });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async () => { throw new DOMException('Clipboard denied in QA', 'NotAllowedError'); },
      } });
      document.execCommand = () => false;
    });
    const page = await context.newPage();
    page.setDefaultTimeout(18000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(articleURL || baseURL, { waitUntil: 'domcontentloaded' });
    const app = articleURL ? page.frameLocator('iframe[title="SearchStax Search Lab"]') : page;
    const link = name => app.getByRole('link', { name, exact: true });
    const button = name => app.getByRole('button', { name, exact: true });
    await link('Start designing').waitFor();
    assert.equal(await app.getByText('Browse Lab topics', { exact: true }).count(), 0);
    assert.ok(await link('Start improving').isVisible());
    await link('Start designing').press('Enter');
    const previewMode = button('Preview');
    const narrow = await previewMode.isVisible();
    if (narrow) await previewMode.click();
    const query = app.getByRole('searchbox', { name: 'Search the website' });
    await query.fill('campus flu clinic');
    await query.press('Enter');
    const count = app.getByText(/^\d+ results for “campus flu clinic”$/);
    await count.waitFor();
    const resultCount = await count.innerText();
    if (narrow) await button('Edit').click();
    await app.getByText('Filters and sorting', { exact: true }).click();
    await button('Change filter placement').press('Enter');
    const placement = app.getByLabel('Desktop filter placement');
    assert.ok(await placement.evaluate(el => el === el.ownerDocument.activeElement));
    await placement.selectOption('top');
    await app.getByLabel('Top filter style').selectOption('row');
    await app.getByRole('radio', { name: /Cards/ }).check();
    await app.getByRole('tab', { name: 'Appearance', exact: true }).press('Home');
    assert.equal(await app.getByRole('tab', { name: 'Features' }).getAttribute('aria-selected'), 'true');
    if (narrow) await previewMode.click();
    assert.equal(await query.inputValue(), 'campus flu clinic');
    assert.equal(await count.innerText(), resultCount);
    if (narrow) await button('Filters').click();
    const providers = app.getByRole('checkbox', { name: /^Providers/ });
    await providers.check();
    await app.getByText(/^8 results for “campus flu clinic”$/).waitFor();
    assert.ok(await providers.isChecked());
    await button('Share Design').click();
    await button('Copy design link').click();
    const shareField = app.getByRole('textbox', { name: 'Design link' });
    await shareField.waitFor();
    const recipient = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await recipient.goto(await shareField.inputValue());
    await recipient.getByRole('tab', { name: 'Appearance', exact: true }).click();
    assert.ok(await recipient.getByRole('radio', { name: /Cards/ }).isChecked());
    assert.equal(await recipient.getByLabel('Desktop filter placement').inputValue(), 'top');
    assert.equal(await recipient.getByLabel('Top filter style').inputValue(), 'row');
    await recipient.close();
    await link('Back to Search Lab').click();
    await link('Start improving').click();
    const fields = observeLesson(page, searchFields, app);
    await app.getByRole('radio', { name: /Search Fields/ }).check();
    await fields.waitFor(app.getByRole('heading', { name: '1 result', exact: true }));
    await button('Include Service name').press('Enter');
    await fields.waitFor(link('International Health'));
    await app.getByRole('button', {name: /See what changed/}).press('Enter');
    const applied = await app.getByText('New match', {exact:true}).filter({visible:true}).isVisible();
    assert.ok(applied);
    const overflow = await link('International Health').evaluate(el => {
      const doc = el.ownerDocument.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    assert.ok(overflow <= 1, 'Horizontal overflow: ' + overflow);
    await link('Back to Search Lab').click();
    await link('Start designing').waitFor();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ browser: engineName, version: browser.version(), width, narrow, article: Boolean(articleURL), resultCount, searchFields: 'New match', overflow }));
  } finally {
    await browser.close();
  }
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
