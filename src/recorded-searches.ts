import type { CustomerConnection } from './customer-search';
import { readCustomerEndpoint } from './web-url.js';
import { replayRecordedResponse } from './recorded-response.js';
import recordedCatalogURL from './recorded-searches.json?url';

export const recordedSearchEndpoint = new URL('./__search-lab-recorded-search', document.baseURI).href;
const fixedLessonToken = 'recorded-lesson';
type Catalog = Record<string, Record<string, Record<string, unknown>>>;
type SavedResponse = { body: ArrayBuffer; status: number; headers: Headers };

const browserFetch = window.fetch.bind(window);
let catalogPromise: Promise<Catalog> | undefined;
let live = false;

function catalog() {
  return catalogPromise ??= browserFetch(recordedCatalogURL).then(response => {
    if (!response.ok) throw Error('The recorded example could not load.');
    return response.json() as Promise<Catalog>;
  }).catch(error => {
    catalogPromise = undefined;
    throw error;
  });
}

function localhost() {
  return ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
}

function fixtureBrowser() {
  return (localhost() || location.hostname.endsWith('.test')) &&
    (window as Window & { __SEARCH_LAB_FIXTURE__?: boolean }).__SEARCH_LAB_FIXTURE__ === true;
}

function unavailable() {
  return Response.json({ error: 'This search is unavailable in the recorded preview.' }, { status: 503 });
}

export function recordedSearchCanGoLive(endpoint: string, token: string) {
  return Boolean(readCustomerEndpoint(endpoint)) && (fixtureBrowser() || (!localhost() && !!token && token !== 'recorded-only'));
}

// Wrap only GET requests for our built-in app. A connected customer's
// endpoints, streamed responses and tracking calls keep their own fetch path.
export function installRecordedSearchTransport(actualEndpoint: () => string) {
  const endpoint = readCustomerEndpoint(actualEndpoint());
  const cache = new Map<string, { response: Promise<SavedResponse>; signal?: AbortSignal }>();
  window.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input), document.baseURI);
    const address = url.origin + url.pathname;
    const virtual = address === recordedSearchEndpoint;
    if (!virtual && address !== endpoint) return browserFetch(input, init);

    const request = new Request(input, init);
    if (request.method !== 'GET') return virtual ? unavailable() : browserFetch(input, init);
    const auth = request.headers.get('authorization') || '';
    const fixture = fixtureBrowser();
    if (virtual && !fixture && (!live || auth === 'Token ' + fixedLessonToken)) {
      const recorded = replayRecordedResponse(await catalog(), url.searchParams);
      return recorded ? Response.json(recorded) : unavailable();
    }
    if (!endpoint || (!fixture && (localhost() || !auth || auth === 'Token recorded-only'))) return unavailable();

    const target = new URL(endpoint);
    target.search = url.search;
    const outbound = new Request(target, request);
    if (fixture) outbound.headers.set('authorization', 'Token local-fixture');
    const params = new URLSearchParams(target.search);
    params.sort();
    const key = auth + ' ' + params.toString();
    let entry = cache.get(key);
    if (!entry || entry.signal?.aborted) {
      if (cache.size >= 64) cache.delete(cache.keys().next().value!);
      // The kit aborts its previous fetch when the next search begins. Finish
      // reading the body before retaining it so reuse doesn't depend on that stream.
      const response = browserFetch(outbound).then(async result => ({
        body: await result.arrayBuffer(), status: result.status, headers: result.headers,
      }));
      entry = { response, signal: outbound.signal };
      cache.set(key, entry);
      const current = entry;
      function forget() { if (cache.get(key) === current) cache.delete(key); }
      void entry.response.then(response => {
        if (response.status < 200 || response.status >= 300) forget();
        else current.signal = undefined;
      }, forget);
    }
    const saved = await entry.response;
    return new Response(saved.body.slice(0), { status: saved.status, headers: saved.headers });
  };
}

export function recordedConnection(connection: CustomerConnection): CustomerConnection {
  return { ...connection, endpoint: recordedSearchEndpoint, token: fixedLessonToken };
}

export function useLiveRecordedSearches(value = true) { live = value; }
export function recordedSearchMode() { return live ? 'live' : 'recorded'; }
