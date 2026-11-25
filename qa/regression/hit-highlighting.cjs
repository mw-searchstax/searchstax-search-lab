const { chromium, assert, baseURL } = require('./runtime.cjs');

(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    const profile = 'SearchLabBuild';
    let setting = true;
    let requests = 0;
    const fragment = 'A later <em>rehabilitation</em> passage and <strong>therapy</strong>.';
    const passage = 'A later rehabilitation passage and therapy.';
    const original = 'The original first paragraph.';
    const settings = { language: 'en', profile };
    await page.route('**/config/searchlabpilot.json', async route => {
      const source = await (await route.fetch()).json();
      await route.fulfill({ json: { endpoint: source.endpoint, profiles: [settings] } });
    });
    await page.route(/\/emselect\?/, async route => {
      requests++;
      const params = Object.fromEntries(new URL(route.request().url()).searchParams);
      const docs = ['one', 'two'].map(key => ({ key, heading: 'Care', story: original }));
      await route.fulfill({ json: {
        responseHeader: { params: { ...params, uniqueId: 'key', hl: setting } },
        response: { docs, start: 0, numFound: 2 },
        metadata: { results: [{ name: 'heading', result_card: 'title' }, { name: 'story', result_card: 'description' }], facets: [] },
        highlighting: { one: { story: [fragment] } }, facet_counts: { facet_fields: {} },
      } });
    });
    await page.goto(baseURL + '#lab-design');
    const cards = page.locator('#lab-results-list');
    const mark = cards.locator('mark').first();
    await mark.waitFor();
    const descriptions = cards.locator('.search-lab__result-description');
    assert.deepEqual(await descriptions.allTextContents(), [passage, original]);
    await page.getByRole('tab', { name: 'Appearance' }).click();
    const style = page.getByLabel('Matched text', { exact: true });
    const computed = () => mark.evaluate(el => {
      const css = getComputedStyle(el);
      return { weight: css.fontWeight, italic: css.fontStyle, background: css.backgroundColor, ink: css.color };
    });
    const baseline = requests;
    assert.equal(await style.inputValue(), 'default');
    await style.selectOption('bold'); assert.equal((await computed()).weight, '700');
    await style.selectOption('italic'); assert.equal((await computed()).italic, 'italic');
    await style.selectOption('color');
    await page.getByLabel('Highlight background').fill('#ffffff');
    await page.getByLabel('Matched text color').fill('#ffffff');
    assert.match(await page.locator('#lab-hit-contrast').innerText(), /1.00:1.*accessible text/);
    assert.equal((await computed()).ink, 'rgb(0, 0, 0)');
    await page.getByLabel('Matched text color').fill('#113355');
    assert.equal((await computed()).ink, 'rgb(17, 51, 85)');
    await page.emulateMedia({ forcedColors: 'active' });
    const forced = await computed();
    assert.notEqual(forced.ink, forced.background);
    await style.selectOption('plain');
    const plain = await computed();
    assert.equal(plain.background, 'rgba(0, 0, 0, 0)');
    assert.equal(plain.italic, 'normal'); assert.equal(plain.weight, '400');
    assert.deepEqual(await descriptions.allTextContents(), [passage, original]);
    assert.equal(requests, baseline, 'changing presentation must not run another search');
    await page.emulateMedia({ forcedColors: 'none' });
    await page.reload();
    await mark.waitFor();
    assert.equal(await style.inputValue(), 'plain');
    await page.getByRole('button', { name: 'Share Design', exact: true }).click();
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
    await page.getByRole('button', { name: 'Copy design link' }).click();
    const share = new URL(await page.getByLabel('Design link', { exact: true }).inputValue());
    assert.equal(share.searchParams.get('lab_highlight'), 'plain');
    assert.equal(share.searchParams.get('lab_hit_text'), '113355');
    await page.getByRole('button', { name: 'Reset design' }).click();
    assert.equal(await style.inputValue(), 'default');
    await page.getByRole('button', { name: 'Undo reset' }).click();
    assert.equal(await style.inputValue(), 'plain');
    for (const [value, label] of [[false, /Enable hit highlighting/], [undefined, /unknown/]]) {
      setting = value;
      await page.goto('about:blank');
      await page.goto(share.href);
      await descriptions.first().waitFor();
      assert.deepEqual(await descriptions.allTextContents(), [original, original]);
      assert.equal(await mark.count(), 0);
      assert.match(await page.locator('#lab-hit-hint').textContent(), label);
      assert.equal(await style.inputValue(), 'plain');
    }
    console.log('Passed mapped hit passages, all five treatments, contrast fallback, forced colors, share, reload, reset/undo and off/unknown metadata.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
