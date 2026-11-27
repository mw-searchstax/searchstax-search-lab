export const GROUPING_FIELD = 'demo_content_type_s';
export const GROUPING_DEFAULT_ITEMS = 10;
export const GROUPING_ROWS = 20;
export const GROUPING_PAGE_SIZES = [3, 5, 10, 20] as const;

export type GroupedItem = { groupHeading?: string };

export function readGroupedBy(value: string | null | undefined): '' | typeof GROUPING_FIELD {
  return value === GROUPING_FIELD ? GROUPING_FIELD : '';
}

export function readItemsPerGroup(value: string | number | null | undefined): number {
  const number = typeof value === 'number' ? value : Number(value);
  return GROUPING_PAGE_SIZES.find(size => size === number) ?? GROUPING_DEFAULT_ITEMS;
}

export function groupLabel(value: unknown, labels: Record<string, string> = {}): string {
  const key = typeof value === 'string' && value.trim() ? value : 'other';
  return Object.hasOwn(labels, key) ? labels[key] : key === 'other' ? 'Other' : key;
}

type GroupedResponse = {
  responseHeader?: { params?: { uniqueId?: string; 'group.offset'?: string | number } };
  response?: { start?: number; docs?: Record<string, unknown>[]; numFound?: number; numFoundExact?: boolean };
  grouped?: Record<string, { matches?: number; groups?: Array<{ groupValue?: string | null; doclist?: { start?: number; numFound?: number; numFoundExact?: boolean; docs?: Record<string, unknown>[] } }> }>;
};

export function normalizeGroupedResponse<T extends GroupedResponse>(payload: T): T {
  if (payload.response || !payload.grouped) return payload;
  const uniqueId = payload.responseHeader?.params?.uniqueId ?? 'id';
  const docs = new Map<string, Record<string, unknown>>();
  let total = 0;
  let start = 0;
  let exact = true;
  for (const field of Object.values(payload.grouped)) {
    total = Math.max(total, field?.matches ?? 0);
    for (const group of field?.groups ?? []) {
      const list = group?.doclist;
      start = list?.start ?? start;
      exact = list?.numFoundExact ?? exact;
      for (const doc of list?.docs ?? []) docs.set(String(doc[uniqueId] ?? docs.size), doc);
    }
  }
  payload.response = { docs: [...docs.values()], numFound: total, start, numFoundExact: exact };
  return payload;
}

export function groupHeadings<T extends GroupedItem>(items: T[], payload: GroupedResponse, labels: Record<string, string> = {}): T[] {
  const grouped = payload.grouped;
  if (!grouped) return items;
  const uniqueId = payload.responseHeader?.params?.uniqueId ?? 'id';
  const headings = new Map<string, string>();
  for (const field of Object.values(grouped)) {
    for (const group of field?.groups ?? []) {
      const heading = groupLabel(group.groupValue, labels);
      for (const doc of group?.doclist?.docs ?? []) {
        const id = String(doc[uniqueId] ?? '');
        if (id && !headings.has(id)) headings.set(id, heading);
      }
    }
  }
  const seen = new Set<string>();
  return items.map(item => {
    const id = String((item as T & { uniqueId?: unknown }).uniqueId ?? '');
    const heading = id ? headings.get(id) : undefined;
    if (!heading || seen.has(heading)) return { ...item, groupHeading: undefined };
    seen.add(heading);
    return { ...item, groupHeading: heading };
  });
}

export function groupHeadingsForDocuments<T extends GroupedItem>(items: T[], documents: Record<string, unknown>[], payload: GroupedResponse, labels: Record<string, string> = {}): T[] {
  const uniqueId = payload.responseHeader?.params?.uniqueId ?? 'id';
  const withIds = items.map((item, index) => ({ ...item, uniqueId: documents[index]?.[uniqueId] }));
  return groupHeadings(withIds, payload, labels).map(({ uniqueId: _id, ...item }) => item as unknown as T);
}

export type GroupPage = { number: number; count: number };

export function groupedPage(payload: GroupedResponse, field: string | undefined, itemsPerGroup = GROUPING_DEFAULT_ITEMS): GroupPage | undefined {
  const result = field && payload.grouped?.[field];
  if (!result) return;
  const groups = result.groups ?? [];
  const largest = groups.reduce((max, group) => Math.max(max, Number(group.doclist?.numFound) || 0), 0);
  const start = Number(payload.responseHeader?.params?.['group.offset'] ?? payload.response?.start) || 0;
  return { number: Math.floor(start / itemsPerGroup) + 1, count: Math.ceil(largest / itemsPerGroup) };
}

export function groupedPageLabel(page: GroupPage, spanish = false) {
  return (spanish ? 'Página ' : 'Page ') + page.number + (spanish ? ' de ' : ' of ') + page.count;
}

export function renderKitGroupedPager(host: HTMLElement | null, page?: GroupPage) {
  if (!host) return;
  const flat = host.nextElementSibling as HTMLElement | null;
  if (flat) flat.hidden = Boolean(page);
  host.hidden = !page?.count;
  const markup = page?.count
    ? `<nav aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-number="${page.number}">${groupedPageLabel(page)}</span>${page.number > 1 ? '<button type="button" data-page-step="previous">Previous</button>' : ''}${page.number < page.count ? '<button type="button" data-page-step="next">Next</button>' : ''}</nav>`
    : '';
  if (host.dataset.pageMarkup !== markup) {
    host.innerHTML = markup;
    host.dataset.pageMarkup = markup;
    host.firstElementChild?.classList.add(host.className);
  }
}
