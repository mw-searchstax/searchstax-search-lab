const path = require('node:path');
const { assert, baseURL, chromium, webkit } = require('./runtime.cjs');

const spacing = '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }';
const enlarge = 'html { font-size: 200% !important; }';

async function checkSelection(page) {
  const tabs = page.getByRole('tablist', { name: 'Design settings' });
  const features = tabs.getByRole('tab', { name: 'Features' });
  const appearance = tabs.getByRole('tab', { name: 'Appearance' });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ forcedColors: 'active', colorScheme });
    assert.ok(await page.evaluate(() => matchMedia('(forced-colors: active)').matches));
    for (const [from, key, selected, inactive] of [
      [features, 'ArrowRight', appearance, features],
      [appearance, 'ArrowLeft', features, appearance],
    ]) {
      await from.press(key);
      assert.equal(await selected.getAttribute('aria-selected'), 'true');
      assert.ok(await selected.evaluate(el => el.matches(':focus-visible') && getComputedStyle(el).outlineStyle !== 'none'));
      await selected.press('Tab');
      const panel = page.getByRole('tabpanel', { name: await selected.innerText(), exact: true });
      assert.ok(await panel.evaluate(el => el.contains(document.activeElement)));
      assert.match(await selected.evaluate(el => getComputedStyle(el).textDecorationLine), /underline/);
      assert.doesNotMatch(await inactive.evaluate(el => getComputedStyle(el).textDecorationLine), /underline/);
      if (process.env.QA_SCREENSHOT_DIR && colorScheme === 'dark' && selected === appearance) {
        await tabs.screenshot({ path: path.join(process.env.QA_SCREENSHOT_DIR, 'selected-tab-high-contrast.png') });
      }
    }
    console.log('Selected tab and keyboard focus remain distinct in forced colors (' + colorScheme + ').');
  }
  await page.emulateMedia({ forcedColors: 'none', colorScheme: 'light' });
}

// A page can fit the viewport while a label overlaps an adjacent control.
async function checkBounds(page, label) {
  const measured = await page.evaluate(() => {
    const root = document.documentElement;
    const overflow = new Set();
    const nodes = document.querySelectorAll('#lab-design-controls, #lab-design-controls *, .search-lab__handoff-actions button, .search-lab__design-switch button');
    for (const el of nodes) {
      const box = el.getBoundingClientRect();
      if (!box.width || el.tagName === 'OPTION') continue;
      const name = el.id || el.textContent.trim().slice(0, 40);
      if (box.left < -1 || box.right > root.clientWidth + 1) overflow.add(name);
      const field = el.closest('.search-lab__field');
      if (field) {
        const bounds = field.getBoundingClientRect();
        if (box.left < bounds.left - 1 || box.right > bounds.right + 1) overflow.add(name);
      }
      for (const child of el.childNodes) {
        if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(child);
        for (const rect of range.getClientRects()) {
          if (rect.left < box.left - 1 || rect.right > box.right + 1) overflow.add(name);
        }
      }
    }
    const colors = ['#lab-accent', '#lab-background'].map(selector => document.querySelector(selector).closest('.search-lab__field').getBoundingClientRect());
    return { extent: root.scrollWidth, width: root.clientWidth, overflow: [...overflow], stacked: colors[1].top >= colors[0].bottom };
  });
  assert.equal(measured.extent, measured.width, label + ' document width');
  assert.deepEqual(measured.overflow, [], label + ' clipped or overflowing labels and controls');
  return measured;
}

async function run() {
  const useWebKit = process.env.QA_BROWSER === 'webkit';
  const browser = useWebKit ? await webkit.launch() : await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseURL + '#lab-design');
    if (!useWebKit) await checkSelection(page);
    await page.locator('#lab-advanced > summary').click();
    await page.getByLabel('Desktop filter placement').selectOption('top');
    await page.getByLabel('Top filter style').selectOption('row');
    await page.getByRole('tab', { name: 'Appearance', exact: true }).click();
    await page.getByLabel('Matched text', { exact: true }).selectOption('color');
    for (const width of [286, 320, 390, 851, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const [mode, css] of [['default', 'html {}'], ['text spacing', spacing], ['200% text', enlarge], ['200% text and spacing', enlarge + spacing]]) {
        const override = await page.addStyleTag({ content: css });
        try {
          const measured = await checkBounds(page, width + 'px ' + mode);
          if (mode.startsWith('200%') && width <= 320) assert.ok(measured.stacked, 'Color controls should stack at ' + width + 'px');
          if (width === 320 && mode === '200% text and spacing') {
            await page.getByLabel('Search page font').selectOption('georgia');
            assert.equal(await page.getByLabel('Search page font').inputValue(), 'georgia');
            if (process.env.QA_SCREENSHOT_DIR) {
              const colorField = page.locator('.search-lab__field').filter({ has: page.getByLabel('Background color') });
              await colorField.screenshot({ path: path.join(process.env.QA_SCREENSHOT_DIR, 'appearance-enlarged-reflow.png') });
            }
          }
        } finally { await override.evaluate(el => el.remove()); }
      }
      console.log('Appearance labels and controls fit at ' + width + ' CSS px at default and double text size, with and without increased spacing.');
    }
  } finally { await browser.close(); }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
