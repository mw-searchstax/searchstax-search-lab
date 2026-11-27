import type { DesignSettings } from './design.js';
import { promotionEntries } from './promotion-display.js';
import { webURL } from './web-url.js';
import type { AppConfiguration, Profile } from './app-configuration.js';
import { resultCards, type ResultResponse, type ThumbnailPolicy } from './result-card.js';
import { readSearchCorrection, type SearchCorrection } from './spelling.js';
export { readCustomerEndpoint } from './web-url.js';

export type CustomerConnection = ThumbnailPolicy & {
  endpoint: string;
  token: string;
  profile: string;
  language: string;
  configuration?: AppConfiguration;
  settings?: Profile;
  relatedURL?: string;
  discoveryKey?: string;
  answerEndpoint?: string;
  suggestEndpoint?: string;
  sampleThumbnails?: boolean;
};

export type CustomerSearch<Value = string> = {
  query: string;
  start: number;
  rows: number;
  sort: string;
  filters: Map<string, Value>;
  facetMode?: DesignSettings['facetMode'];
  excludeFilters?: Map<string, string>;
  autoCorrect?: boolean | null;
  suppressCorrection?: boolean;
};

export type BuildSearch = CustomerSearch<string[]>;

type SearchPayload = ResultResponse & {
  response?: { numFound: number; docs: Record<string, unknown>[] };
  metadata?: ResultResponse['metadata'] & {
    facets?: { name: string; label: string }[];
    sorts?: { name: string; order: string; label: string }[];
  };
  facet_counts?: { facet_fields?: Record<string, unknown[]> };
  externalLinks?: { name?: unknown; url?: unknown; description?: unknown }[];
};

const fieldName = /^[A-Za-z_][\w.-]*$/;

export function publishedSorts(metadata: SearchPayload['metadata']) {
  return (Array.isArray(metadata?.sorts) ? metadata.sorts : [])
    .filter(sort => sort && typeof sort.name === 'string' && fieldName.test(sort.name) && (sort.order === 'asc' || sort.order === 'desc'))
    .map(sort => ({ value: sort.name + ' ' + sort.order, label: typeof sort.label === 'string' && sort.label || sort.name }));
}

export class CustomerSearchError extends Error {}
export class CustomerSearchTokenError extends CustomerSearchError {}

function firstText(value: unknown): string {
  if (Array.isArray(value)) return value.find((item): item is string => typeof item === 'string') ?? '';
  return typeof value === 'string' ? value : '';
}

async function requestSearch(connection: CustomerConnection, options: CustomerSearch<string | string[]>, signal: AbortSignal): Promise<SearchPayload> {
  const url = new URL(connection.endpoint);
  url.search = new URLSearchParams({
    q: options.query,
    start: String(options.start),
    rows: String(options.rows),
    facet: 'true',
  }).toString();
  if (connection.settings?.highlighting !== undefined) url.searchParams.set('hl', String(connection.settings.highlighting));
  if (connection.language) url.searchParams.set('language', connection.language);
  if (connection.profile) url.searchParams.set('model', connection.profile);
  if (options.suppressCorrection) url.searchParams.set('spellcheck.correct', 'false');
  else if (typeof options.autoCorrect === 'boolean') url.searchParams.set('spellcheck.correct', String(options.autoCorrect));
  if (options.sort) url.searchParams.set('sort', options.sort);
  const clause = (field: string, value: string) => field + ':"' + value.replace(/[\\"]/g, '\\$&') + '"';
  const selected: string[] = [];
  for (const [field, values] of options.filters) {
    if (!fieldName.test(field)) continue;
    for (const value of Array.isArray(values) ? values : [values]) selected.push(clause(field, value));
  }
  if (options.facetMode === 'or' || options.facetMode === 'showUnavailable') {
    if (selected.length) url.searchParams.append('fq', selected.join(' OR '));
  } else {
    for (const filter of selected) url.searchParams.append('fq', filter);
  }
  options.excludeFilters?.forEach((value, field) => {
    if (fieldName.test(field)) url.searchParams.append('fq', '-' + clause(field, value));
  });

  const response = await fetch(url, {
    headers: { Authorization: 'Token ' + connection.token },
    credentials: 'omit',
    redirect: 'error',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    signal,
  });
  if (response.status === 401 || response.status === 403) {
    throw new CustomerSearchTokenError('The Search App rejected the token. Check that it’s an active read-only token for this app.');
  }
  if (response.status === 404) throw new CustomerSearchError('Search API endpoint not found. Copy the Select endpoint from App Settings.');
  if (response.status === 400) throw new CustomerSearchError('The Search App rejected the request. Check the profile, language, and search term.');
  if (response.status === 429) throw new CustomerSearchError('The Search App is receiving too many requests. Try again in a moment.');
  if (!response.ok) throw new CustomerSearchError('The Search App is unavailable. Try again in a moment.');
  return await response.json() as SearchPayload;
}

async function readPage(connection: CustomerConnection, options: CustomerSearch<string | string[]>, signal: AbortSignal) {
  const payload = await requestSearch(connection, options, signal);
  const response = payload?.response;
  if (!response || !Number.isSafeInteger(response.numFound) || response.numFound < 0 || !Array.isArray(response.docs)) {
    throw new CustomerSearchError('The endpoint didn’t return search results. Check the Select endpoint and Search Profile.');
  }
  const externalPromotions = promotionEntries(payload.externalLinks);

  const facets = (Array.isArray(payload.metadata?.facets) ? payload.metadata.facets : []).filter(field => field && typeof field.name === 'string' && fieldName.test(field.name)).map(field => {
    const counts = payload.facet_counts?.facet_fields?.[field.name] ?? [];
    const choices: { value: string; count: number }[] = [];
    for (let index = 0; index < counts.length; index += 2) {
      const value = counts[index];
      const count = counts[index + 1];
      if (typeof value === 'string' && value && typeof count === 'number') choices.push({ value, count });
    }
    return { field: field.name, label: field.label || field.name, choices };
  });
  const sorts = publishedSorts(payload.metadata);
  return { payload, response, total: response.numFound, resultCount: response.docs.length, externalPromotions, facets, sorts };
}

export async function searchBuildApp(connection: CustomerConnection, options: BuildSearch, signal: AbortSignal, knownSorts: ReturnType<typeof publishedSorts> = []) {
  let sort = knownSorts.some(choice => choice.value === options.sort) ? options.sort : '';
  let start = options.start;
  const fetchPage = () => readPage(connection, { ...options, sort, start }, signal);
  let result = await fetchPage();
  // A new profile supplies its own choices. Validate a saved order before
  // sending it, and discard a sorted batch if its response withdraws that sort.
  if (!sort && options.sort && result.sorts.some(choice => choice.value === options.sort)) {
    sort = options.sort;
    start = 0;
    result = await fetchPage();
  }
  if (sort && !result.sorts.some(choice => choice.value === sort)) {
    sort = '';
    start = 0;
    result = await fetchPage();
  }
  const { payload, response, ...page } = result;
  const params = payload.responseHeader?.params;
  const profile = connection.profile || params?.model;
  const language = (connection.language || params?.language)?.toLowerCase().replaceAll('-', '_');
  const matches = connection.configuration?.profiles.filter(item => item.profile === profile && (!language || item.language === language));
  const settings = connection.settings ?? (matches?.length === 1 ? matches[0] : undefined);
  const { cards, ...metadata } = resultCards(payload, response.docs, settings?.highlighting, profile, language, connection);
  return { ...page, ...metadata, settings, language, start, sort,
    correction: readSearchCorrection(payload),
    cards: cards.filter(card => card.url || card.thumbnail || card.values.length) };
}

// The prepared Improve lessons use the demo’s original linked-result projection.
export async function searchCustomerApp(connection: CustomerConnection, options: CustomerSearch, signal: AbortSignal) {
  const { payload, response, ...page } = await readPage(connection, options, signal);
  const mappings = Array.isArray(payload.metadata?.results) ? payload.metadata.results : [];
  const mappedName = (role: string) => mappings.find(field => field.result_card === role)?.name ?? role;
  const urlField = mappedName('url');
  const titleField = mappedName('title');
  const descriptionField = mappedName('description');
  const results = response.docs.flatMap(doc => {
    const url = webURL(firstText(doc[urlField]));
    return url ? [{
      url,
      title: firstText(doc[titleField]) || url,
      description: firstText(doc[descriptionField]),
      promoted: doc['[elevated]'] === true,
    }] : [];
  });

  return { ...page, results };
}

export type BuildPage = Awaited<ReturnType<typeof searchBuildApp>>;
export type CustomerPage = Awaited<ReturnType<typeof searchCustomerApp>>;
