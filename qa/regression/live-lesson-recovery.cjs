const { assert, baseURL, chromium, firefox, webkit } = require('./runtime.cjs');
const { observeLesson, ranking } = require('./live-lesson-diagnostics.cjs');

const width = Number(process.env.QA_WIDTH || 390);
const initialError = 'The Central County results couldn’t load.';
const updateError = 'The search couldn’t update. The previous results are still visible.';

async function runCase(browser, lesson, scenario, steps, check) {
  const page = await browser.newPage({ viewport: { width, height: width <= 850 ? 844 : 960 } });
  page.setDefaultTimeout(18000);
  const diagnostics = observeLesson(page, lesson);
  try {
    let attempt = 0;
    await page.route(diagnostics.isLessonRequest, async route => {
      const step = steps[attempt++];
      if (step === 'timeout') return; // The lesson's real timeout cancels this pending request.
      if (step === '503') return route.fulfill({ status: 503, body: 'Service unavailable' });
      if (step === 'slow') await new Promise(resolve => setTimeout(resolve, 3000));
      return route.fallback();
    });
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Start improving' }).click();
    const choose = page.getByRole('radio', { name: new RegExp('^' + lesson.name + ' ·') });
    await choose.check();
    const sidebar = page.locator('[data-improve-controls="' + lesson.id + '"]');
    const action = sidebar.getByRole('button', {
      name: lesson === ranking ? 'Give title matches more weight' : 'Include Service name', exact: true,
    });
    const retry = sidebar.getByRole('button', { name: 'Retry search', exact: true });
    const preview = page.locator('[data-improve-lesson="' + lesson.id + '"]');
    const original = preview.getByRole('heading', { name: lesson === ranking ? 'Top 5 of 44 results' : '1 result', exact: true });
    const titles = preview.locator('[data-improve-results] > li .searchstax-search-result-title');
    const result = lesson === ranking
      ? titles.first().and(preview.getByRole('link', { name: 'North Campus Clinic', exact: true }))
      : preview.getByRole('link', { name: 'International Health', exact: true });

    async function expectError(text) {
      await retry.waitFor();
      assert.equal(await page.getByRole('button', { name: 'Retry search', exact: true }).count(), 1);
      assert.equal(await sidebar.getByRole('status').innerText(), text);
      assert.equal(await retry.getAttribute('aria-describedby'), await sidebar.getByRole('status').getAttribute('id'));
      const bounds = await action.evaluate(button => {
        const status = button.nextElementSibling;
        const retry = status.nextElementSibling;
        const primary = button.getBoundingClientRect(), message = status.getBoundingClientRect(), last = retry.getBoundingClientRect();
        return {
          primaryBottom: Math.round(primary.bottom), errorTop: Math.round(message.top),
          errorBottom: Math.round(message.bottom), retryTop: Math.round(last.top),
          retryBottom: Math.round(last.bottom), viewport: innerHeight,
          adjacent: status.matches('[data-improve-status]') && retry.matches('[data-improve-retry]'),
        };
      });
      assert.ok(bounds.adjacent);
      assert.ok(Math.abs(bounds.errorTop - bounds.primaryBottom) <= 24);
      assert.ok(Math.abs(bounds.retryTop - bounds.errorBottom) <= 24);
      if (width === 320 || width === 390) {
        assert.ok(bounds.errorTop >= 0 && bounds.retryBottom <= bounds.viewport, 'Recovery controls must fit on the phone screen: ' + JSON.stringify(bounds));
      }
      const screenshot = lesson === ranking ? process.env.QA_RANKING_RECOVERY_SCREENSHOT : process.env.QA_RECOVERY_SCREENSHOT;
      if (scenario === 'initial timeout' && screenshot) {
        await page.screenshot({ path: screenshot });
      }
      const evidence = await diagnostics.snapshot();
      assert.equal(evidence.visibleError, text);
      assert.ok(evidence.retryVisible);
      console.log(JSON.stringify({ lesson: lesson.name, scenario, width, bounds, ...evidence }));
      return evidence.requests.at(-1);
    }
    await check({ page, lesson, choose, action, retry, diagnostics, original, result, titles, expectError, sidebar });
    console.log(JSON.stringify({ lesson: lesson.name, scenario, outcome: 'passed', ...(await diagnostics.snapshot()) }));
  } catch (error) {
    console.error(JSON.stringify({ lesson: lesson.name, scenario, ...(await diagnostics.snapshot()) }));
    throw error;
  } finally {
    await page.close();
  }
}

async function initialTimeout({ action, retry, diagnostics, original, result, expectError }) {
  const request = await expectError(initialError);
  assert.equal(request.httpStatus, null);
  assert.ok(request.elapsedMs >= 11500);
  assert.equal(await action.isEnabled(), false);
  await retry.press('Enter');
  await diagnostics.waitFor(original);
  assert.ok(await action.evaluate(el => el === document.activeElement));
  assert.equal(await retry.isVisible(), false);
  await action.click();
  await diagnostics.waitFor(result);
}

async function changeTimeout({ action, retry, diagnostics, original, result, titles, expectError, lesson }) {
  await diagnostics.waitFor(original);
  const before = await titles.allTextContents();
  if (lesson === ranking) {
    assert.equal(before.length, 5);
    assert.equal(before.indexOf('North Campus Clinic'), 3);
  } else {
    assert.deepEqual(before, ['Transit Access']);
  }
  await action.click();
  const request = await expectError(updateError);
  assert.equal(request.httpStatus, null);
  assert.ok(request.elapsedMs >= 11500);
  assert.ok(await original.isVisible());
  assert.deepEqual(await titles.allTextContents(), before);
  await retry.click();
  await diagnostics.waitFor(result);
  const after = await titles.allTextContents();
  if (lesson === ranking) {
    assert.deepEqual([...after].sort(), [...before].sort());
    assert.equal(after[0], 'North Campus Clinic');
  } else {
    assert.equal(after.length, 2);
  }
}

async function repeatFailure({ page, choose, retry, original, diagnostics, expectError }) {
  // Exercise the same failure-reporting path used by the ordinary onboarding QA.
  await assert.rejects(diagnostics.waitFor(original), error =>
    error.message.includes(initialError) && error.message.includes('"httpStatus":503'));
  assert.equal((await expectError(initialError)).httpStatus, 503);
  const next = page.waitForResponse(response => diagnostics.isLessonRequest(new URL(response.url())) && response.status() === 503);
  await retry.click();
  await next;
  await retry.and(page.locator('button:not([aria-disabled="true"])')).waitFor();
  assert.equal((await expectError(initialError)).httpStatus, 503);
  await page.getByRole('radio', { name: /Synonyms/ }).check();
  assert.equal(await retry.isVisible(), false);
  await page.getByRole('button', { name: 'Add a synonym' }).click();
  await page.getByText('Otolaryngology', { exact: true }).waitFor();
  await choose.check();
  await diagnostics.waitFor(original);
}

async function slowSuccess({ sidebar, action, diagnostics, original, result }) {
  await sidebar.getByText('Loading the recorded example…', { exact: true }).waitFor();
  assert.equal(await action.isEnabled(), false);
  await diagnostics.waitFor(original);
  await action.click();
  await diagnostics.waitFor(result);
}

async function runRecovery(lesson) {
  const name = process.env.QA_BROWSER || 'chromium';
  const browser = await ({ chromium, webkit, firefox })[name].launch(name === 'chromium' ? { channel: 'chrome' } : {});
  try {
    await runCase(browser, lesson, 'initial timeout', ['timeout'], initialTimeout);
    await runCase(browser, lesson, 'timeout after applying ' + lesson.name, [null, 'timeout'], changeTimeout);
    await runCase(browser, lesson, 'repeated HTTP 503', ['503', '503'], repeatFailure);
    await runCase(browser, lesson, 'slow successful search', ['slow'], slowSuccess);
  } finally {
    await browser.close();
  }
}
module.exports = { runRecovery };
