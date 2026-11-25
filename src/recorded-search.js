// Keep starter examples useful without spending Search App requests. The
// installer intercepts only its same-origin relative fixture endpoint.
import { replayRecordedResponse } from './recorded-response.js';

const recordedEndpoint = './__search-lab-recorded-search';

function emptyResponse(params) {
  return {
    responseHeader: { params },
    response: { start: Number(params.start || 0), numFound: 0, docs: [] },
    metadata: { sorts: [], facets: [], results: [] },
    facet_counts: { facet_fields: {} },
  };
}

export function installRecordedSearch(recordings) {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;
  if (window.__searchLabRecordedSearchInstalled) return;
  window.__searchLabRecordedSearchInstalled = true;
  const browserFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const rawURL = typeof input === 'string' ? input
      : input instanceof URL ? input.href
        : typeof Request !== 'undefined' && input instanceof Request ? input.url : input?.url;
    let url;
    try { url = new URL(rawURL, window.location.href); } catch { return browserFetch(input, init); }
    const endpointPath = new URL(recordedEndpoint, window.location.href).pathname;
    if (url.origin !== window.location.origin || url.pathname !== endpointPath) return browserFetch(input, init);
    const response = replayRecordedResponse(recordings, url.searchParams)
      || emptyResponse(Object.fromEntries(url.searchParams.entries()));
    return Promise.resolve(new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
  };
}

export { recordedEndpoint };
