const searchFields = { name: 'Search Fields', id: 'missing-page', query: 'travel vaccinations' };
const ranking = { name: 'Ranking', id: 'flu-clinic-order', query: 'campus flu clinic' };

function observeLesson(page, lesson, app = page) {
  // Keep URLs and headers out of QA logs. Only observe the fictional lesson's preset search.
  const isLessonRequest = url => url.pathname.endsWith('/emselect') && url.searchParams.get('q') === lesson.query;
  const calls = new Map();
  page.on('request', request => {
    if (isLessonRequest(new URL(request.url()))) {
      calls.set(request, { started: Date.now(), state: 'pending', httpStatus: null });
    }
  });
  page.on('response', response => {
    const call = calls.get(response.request());
    if (call) {
      call.httpStatus = response.status();
      call.state = 'received response';
    }
  });
  function finish(request, state) {
    const call = calls.get(request);
    if (call) Object.assign(call, { state, elapsedMs: Date.now() - call.started });
  }
  page.on('requestfinished', request => finish(request, 'finished'));
  page.on('requestfailed', request => {
    finish(request, 'failed');
    const call = calls.get(request);
    if (call) call.failure = request.failure()?.errorText;
  });

  const panel = app.locator(':is([data-improve-controls="' + lesson.id + '"], [data-improve-lesson="' + lesson.id + '"])');
  const message = panel.locator('[data-improve-status]:visible:not(.search-lab__sr-only)');
  const error = panel.locator('[data-improve-status][data-tone="error"]:visible');
  async function snapshot() {
    const visibleMessages = await message.allInnerTexts();
    return {
      requests: Array.from(calls.values(), ({ started, ...call }) => ({
        ...call, elapsedMs: call.elapsedMs ?? Date.now() - started,
      })),
      visibleStatus: visibleMessages.join(' ') || null,
      visibleError: (await error.allInnerTexts()).join(' ') || null,
      retryVisible: await panel.getByRole('button', { name: 'Retry search', exact: true }).isVisible(),
    };
  }
  async function waitFor(expected) {
    try {
      await expected.or(error).first().waitFor();
      if (await error.isVisible()) throw new Error(lesson.name + ' displayed a search error');
    } catch (cause) {
      throw new Error(cause.message + '\n' + lesson.name + ' QA: ' + JSON.stringify(await snapshot()), { cause });
    }
  }
  return { snapshot, waitFor, isLessonRequest };
}

module.exports = { searchFields, ranking, observeLesson };
