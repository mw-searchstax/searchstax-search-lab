import { webURL } from './web-url.js';
export { readCustomerEndpoint } from './web-url.js';

export type CustomerConnection = {
  endpoint: string;
  token: string;
  profile: string;
  language: string;
  relatedURL?: string;
  discoveryKey?: string;
  answerEndpoint?: string;
  suggestEndpoint?: string;
};

export type CustomerSearch = {
  query: string;
  start: number;
  rows: number;
  sort: string;
  filters: Map<string, string>;
  excludeFilters?: Map<string, string>;
};

type SearchPayload = {
  response?: { numFound: number; docs: Record<string, unknown>[] };
  metadata?: {
    results?: { name: string; result_card: string }[];
    facets?: { name: string; label: string }[];
    sorts?: { name: string; order: string; label: string }[];
  };
  facet_counts?: { facet_fields?: Record<string, unknown[]> };
  externalLinks?: { name?: unknown; url?: unknown; description?: unknown }[];
};

const fieldName = /^[A-Za-z_][\w.-]*$/;

export class CustomerSearchError extends Error {}
export class CustomerSearchTokenError extends CustomerSearchError {}

function firstText(value: unknown): string {
  if (Array.isArray(value)) return value.find((item): item is string => typeof item === 'string') ?? '';
  return typeof value === 'string' ? value : '';
}

async function requestSearch(connection: CustomerConnection, options: CustomerSearch, signal: AbortSignal): Promise<SearchPayload> {
  const url = new URL(connection.endpoint);
  url.search = new URLSearchParams({
    q: options.query,
    start: String(options.start),
    rows: String(options.rows),
    facet: 'true',
  }).toString();
  if (connection.language) url.searchParams.set('language', connection.language);
  if (connection.profile) url.searchParams.set('model', connection.profile);
  if (options.sort) url.searchParams.set('sort', options.sort);
  for (const [filters, prefix] of [[options.filters, ''], [options.excludeFilters, '-']] as const) {
    filters?.forEach((value, field) => {
      if (fieldName.test(field)) url.searchParams.append('fq', prefix + field + ':"' + value.replace(/[\\"]/g, '\\$&') + '"');
    });
  }

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

export async function searchCustomerApp(connection: CustomerConnection, options: CustomerSearch, signal: AbortSignal) {
  const payload = await requestSearch(connection, options, signal);
  const response = payload?.response;
  if (!response || !Number.isSafeInteger(response.numFound) || response.numFound < 0 || !Array.isArray(response.docs)) {
    throw new CustomerSearchError('The endpoint didn’t return search results. Check the Select endpoint and Search Profile.');
  }
  const mappings = payload.metadata?.results ?? [];
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

  const externalPromotions = (Array.isArray(payload.externalLinks) ? payload.externalLinks : []).flatMap(item => {
    const url = webURL(firstText(item?.url));
    return url ? [{ url, title: firstText(item?.name).trim() || url, description: firstText(item?.description).trim() }] : [];
  });

  const facets = (payload.metadata?.facets ?? []).filter(field => fieldName.test(field.name)).map(field => {
    const counts = payload.facet_counts?.facet_fields?.[field.name] ?? [];
    const choices: { value: string; count: number }[] = [];
    for (let index = 0; index < counts.length; index += 2) {
      const value = counts[index];
      const count = counts[index + 1];
      if (typeof value === 'string' && value && typeof count === 'number') choices.push({ value, count });
    }
    return { field: field.name, label: field.label || field.name, choices };
  });
  const sorts = (payload.metadata?.sorts ?? [])
    .filter(sort => fieldName.test(sort.name) && (sort.order === 'asc' || sort.order === 'desc'))
    .map(sort => ({ value: sort.name + ' ' + sort.order, label: sort.label || sort.name }));
  return { total: response.numFound, resultCount: response.docs.length, results, externalPromotions, facets, sorts };
}

export type CustomerPage = Awaited<ReturnType<typeof searchCustomerApp>>;
