const { chromium, assert, baseURL } = require('./runtime.cjs');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function loadFflate() {
  const candidates = [process.env.FFLATE_MODULE, 'fflate'].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); } catch { /* try the next location */ }
  }
  throw new Error('Set FFLATE_MODULE to the installed fflate module.');
}

const { unzipSync, strFromU8 } = loadFflate();
const frameworks = ['javascript', 'react', 'vue', 'angular'];
const modes = {
  single: { lab_profile_tabs: 'off', lab_languages: 'off', lab_page_size: '5' },
  tabs: { lab_profile_tabs: 'on', lab_languages: 'off', lab_page_size: '5' },
  lang: { lab_profile_tabs: 'off', lab_languages: 'on', lab_page_size: '5' },
  both: { lab_profile_tabs: 'on', lab_languages: 'on', lab_page_size: '5' },
};
const artifactRoot = process.env.QA_ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'search-lab-starters-'));

function pageURL(mode) {
  const query = new URLSearchParams(modes[mode]);
  return baseURL + '?' + query + '#lab-design';
}

function writeArchive(mode, framework, bytes) {
  const dir = path.join(artifactRoot, mode, framework);
  fs.mkdirSync(dir, { recursive: true });
  const archivePath = path.join(dir, 'starter.zip');
  fs.writeFileSync(archivePath, bytes);
  const files = unzipSync(bytes);
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(dir, 'extracted', name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return { archivePath, files };
}

function textFile(files, name) {
  assert.ok(files[name], 'archive includes ' + name);
  return strFromU8(files[name]);
}

function checkArchive(mode, framework, files) {
  const readme = textFile(files, 'README.md');
  assert.match(readme, /tracking[^.]{0,48}off/i, mode + '/' + framework + ' README documents the default');
  assert.ok(files['search.css'], mode + '/' + framework + ' includes search.css');
  const profile = mode !== 'single';
  assert.equal(Boolean(files['src/profile-experiences.js']), profile, mode + '/' + framework + ' profile runtime');
  if (profile) {
    assert.ok(files['src/search-recovery.js'], mode + '/' + framework + ' includes the profile retry handler');
    const config = textFile(files, 'src/config.js');
    const match = config.match(/export const settings = ([\s\S]*?);\n\n/);
    assert.ok(match, mode + '/' + framework + ' settings config');
    const settings = JSON.parse(match[1]);
    assert.equal(settings.navigation.profileTabs, mode === 'tabs' || mode === 'both');
    assert.equal(settings.navigation.languagePicker, mode === 'lang' || mode === 'both');
    assert.equal(settings.navigation.showSorting, true);
    assert.equal(settings.navigation.resultsPerPage, 5);
    assert.equal(settings.profiles.length, 4);
    assert.deepEqual([...new Set(settings.profiles.map(item => item.language))].sort(), ['en', 'es']);
    assert.ok(config.includes("export const connection = { endpoint: '', token: '' }"));
  } else {
    const source = framework === 'javascript' ? textFile(files, 'search.js') : textFile(files, 'src/config.js');
    assert.match(source, /["']?resultsPerPage["']?\s*:\s*5/);
    assert.match(source, /["']?showSorting["']?\s*:\s*true/);
    assert.match(source, /["']?analyticsBaseUrl["']?\s*:\s*["']\s*["']/);
    assert.match(source, /["']?trackApiKey["']?\s*:\s*["']\s*["']/);
  }
  assert.ok(!Object.keys(files).some(name => /\.env|token|credential|secret/i.test(name)), mode + '/' + framework + ' has no credential files');
}

async function download(page, mode, framework) {
  const pair = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-lab-download-starter="' + framework + '"]').click(),
  ]);
  const file = await pair[0].path();
  assert.ok(file, mode + '/' + framework + ' download completed');
  const result = writeArchive(mode, framework, fs.readFileSync(file));
  checkArchive(mode, framework, result.files);
  return result;
}

async function downloadCSS(page, mode) {
  const pair = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-lab-download-css]').click(),
  ]);
  const file = await pair[0].path();
  assert.ok(file, mode + ' CSS download completed');
  const bytes = fs.readFileSync(file);
  fs.mkdirSync(path.join(artifactRoot, mode), { recursive: true });
  fs.writeFileSync(path.join(artifactRoot, mode, 'downloaded-search.css'), bytes);
  return bytes;
}

(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
  try {
    for (const mode of Object.keys(modes)) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(pageURL(mode), { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Get starter code', exact: true }).click();
      assert.equal(await page.getByLabel('Show profile tabs').isChecked(), mode === 'tabs' || mode === 'both');
      assert.equal(await page.getByLabel('Show language picker').isChecked(), mode === 'lang' || mode === 'both');
      const cssBytes = await downloadCSS(page, mode);
      for (const framework of frameworks) {
        const result = await download(page, mode, framework);
        assert.equal(Buffer.compare(Buffer.from(result.files['search.css']), cssBytes), 0, mode + '/' + framework + ' CSS matches Download CSS');
      }
      assert.deepEqual(pageErrors, [], mode + ' has no page errors');
      await context.close();
      console.log(mode + ': downloaded and inspected ' + frameworks.length + ' starter archives');
    }
  } finally {
    await browser.close();
  }
  console.log('Artifacts: ' + artifactRoot);
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
