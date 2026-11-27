// Use the unmodified visitor transport. Only the fake hosted origin and its
// intercepted Select response differ from Pages. The QA network fence stays active.
process.env.QA_RECORDED = '1';
const { assert, baseURL, chromium, localQA, liveQA } = require('./runtime.cjs');
const { endpoint } = require('../../public/config/searchlabpilot.json');
const { searchResponse } = require('./demo-fixture.cjs');

async function run() {
  assert.ok(localQA && !liveQA, 'This regression requires a local build and fixture responses.');
  const origin = 'https://pilot.example.test';
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    const calls = [];
    page.setDefaultTimeout(15000);
    await page.route(u => u.origin === origin, async route => {
      const u = new URL(route.request().url());
      const response = await route.fetch({ url: new URL(u.pathname + u.search, baseURL).href });
      if (route.request().resourceType() !== 'document') return route.fulfill({ response });
      const body = (await response.text()).replace(/data-search-credential="[^"]*"/, 'data-search-credential="fixture-only"');
      await route.fulfill({ response, body });
    });
    await page.route(endpoint + '**', route => {
      const url = new URL(route.request().url());
      calls.push(url.searchParams.get('q'));
      return route.fulfill({ json: searchResponse(url) });
    });
    const main = page.locator('[data-lab-demo-output]');
    const search = page.getByRole('searchbox', { name: 'Search the website', exact: true });
    const submit = async term => { await search.fill(term); await search.press('Enter'); };
    const opening = main.locator('article h4').first();
    await page.goto(origin);
    await page.getByRole('link', { name: 'Start designing' }).click();
    await opening.filter({ hasText: 'Simon Kelver' }).waitFor();
    await main.getByText('8 results for “rehabilitation”', { exact: true }).waitFor();
    await page.getByRole('tab', { name: 'Appearance', exact: true }).click();
    await page.getByText('Result cards', { exact: true }).click();
    const thumbnailSize = page.getByLabel('Thumbnail size');
    const sampleThumbnails = page.getByRole('checkbox', { name: 'Show sample thumbnails' });
    const thumbnail = main.locator('.search-lab__result-thumbnail').first();
    assert.equal(await thumbnailSize.evaluate(el => el.closest('.search-lab__card-settings').contains(document.getElementById('lab-thumbnails'))), true);
    await thumbnail.waitFor({ state: 'hidden' });
    await sampleThumbnails.check();
    await thumbnail.waitFor();
    await thumbnailSize.selectOption('large');
    const metadata = main.locator('article').first().locator('[data-card-field]');
    assert.deepEqual(await metadata.allTextContents(), ['Sample topic: Accessible design', 'Sample audience: Design students']);
    await page.getByLabel('Metadata field').selectOption({ label: 'Sample topic' });
    await page.getByLabel('Metadata label').fill('Focus area');
    await main.getByText('Focus area: Accessible design', { exact: true }).waitFor();
    await page.getByRole('tab', { name: 'Features', exact: true }).click();
    await page.getByText('Advanced Options', { exact: true }).click();
    await page.getByLabel('Metadata order').selectOption({ label: 'Sample audience' });
    await page.getByRole('button', { name: 'Move earlier' }).click();
    assert.deepEqual(await metadata.allTextContents(), ['Sample audience: Design students', 'Focus area: Accessible design']);
    await page.getByRole('button', { name: 'Use profile order' }).click();
    assert.deepEqual(await metadata.allTextContents(), ['Focus area: Accessible design', 'Sample audience: Design students']);
    await page.getByRole('tab', { name: 'Appearance', exact: true }).click();
    await page.getByRole('radio', { name: /Cards/ }).check();
    assert.deepEqual(calls, []);
    await submit('campus flu clinic');
    const promoted = main.locator('.search-promotion-marker:visible').first();
    await promoted.waitFor();
    assert.equal(await main.locator('[data-card-field="sample_topic_s"]').count(), 0);
    await submit('orthopedics');
    await main.getByText('3 results for “orthopedics”', { exact: true }).waitFor();
    await submit('campus flu clinic');
    await promoted.waitFor();
    assert.deepEqual(calls, ['campus flu clinic', 'orthopedics']);

    await page.getByRole('link', { name: 'Back to Search Lab', exact: true }).click();
    await page.getByRole('link', { name: 'Start improving' }).click();
    await page.getByRole('radio', { name: /Search Fields/ }).check();
    await page.getByRole('heading', { name: '1 result', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Include Service name', exact: true }).click();
    await page.getByRole('link', { name: 'International Health', exact: true }).waitFor();

    await page.goto(origin + '/?lab_profile_tabs=on#lab-design');
    const panel = page.locator('#lab-experiences');
    await panel.getByRole('tab', { name: 'SearchLabBuild', exact: true }).waitFor();
    await panel.getByRole('link', { name: /Simon Kelver/ }).waitFor();
    assert.deepEqual(calls, ['campus flu clinic', 'orthopedics']);
    await panel.getByRole('tab', { name: 'Main Profile', exact: true }).click();
    await panel.getByRole('link', { name: /Adrian Pell/ }).waitFor();
    assert.deepEqual(calls, ['campus flu clinic', 'orthopedics', 'rehabilitation']);
    console.log('Hosted fixture passed recorded Build, shared profile opening and Improve. Two typed queries and one explicit profile switch dispatched. Repeating a query reused its response.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
