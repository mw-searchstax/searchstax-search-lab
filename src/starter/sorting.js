// UI Kit releases expose sorting metadata under slightly different names.
// Keep the exported starter controls driven by the selected profile response.
export function readSortOptions(data) {
  const options = data?.sortOptions ?? data?.sorting?.options ?? data?.sorts ?? [];
  if (!Array.isArray(options)) return [];
  const parsed = options.flatMap(option => {
    // Search API metadata reports `{ name, order, label }`; UI Kit reports
    // `{ key, value }` where key is the request order and value is its label.
    const rawOrder = typeof option?.name === 'string' && typeof option?.order === 'string'
      ? `${option.name} ${option.order}` : option?.key;
    if (typeof rawOrder !== 'string') return [];
    const order = decodedSort(rawOrder.trim());
    const normalized = /^(?:relevance|default)$/i.test(order) ? '' : order;
    // Match the Search API's publishedSorts contract. A starter must never
    // send an arbitrary field or direction supplied by an untrusted response.
    if (normalized && !/^[A-Za-z_][\w.-]* (?:asc|desc)$/.test(normalized)) return [];
    const label = option?.label ??
      (typeof option?.key === 'string' && typeof option?.value === 'string' ? option.value : normalized || 'Relevance');
    return typeof label === 'string' ? [{ label, order: normalized }] : [];
  });
  // Relevance alone is the profile default, not a sorting control.
  if (!parsed.some(option => option.order)) return [];
  const unique = [];
  const seen = new Set();
  for (const option of parsed) {
    if (seen.has(option.order)) continue;
    seen.add(option.order);
    unique.push(option);
  }
  // The API returns only explicit profile sorts. Keep Relevance selectable
  // without inventing any customer sort fields.
  if (!seen.has('') && unique.length) unique.unshift({ label: 'Relevance', order: '' });
  return unique;
}

export function readResponseSortOptions(response) {
  return readSortOptions(response?.metadata);
}

export function encodedSort(order) {
  return order ? encodeURIComponent(order) : '';
}

export function decodedSort(order) {
  if (!order) return '';
  try { return decodeURIComponent(order); } catch { return ''; }
}

// Apply the design's starting sort once. Later responses only validate the
// visitor's current choice against the profile's published options.
export function createSortController({ enabled, requested, getSearchObject, setSearchObject }) {
  let firstResponse = true;
  return {
    handle(options) {
      const current = getSearchObject();
      if (!current) return false;
      const order = decodedSort(current.order);
      const preferred = order || (firstResponse ? requested : '');
      firstResponse = false;
      const next = enabled && options.some(choice => choice.order === preferred) ? preferred : '';
      if (next === order) return false;

      // Let the kit finish its response before starting the validated request.
      // A newer query or visitor selection takes precedence.
      const query = current.query;
      queueMicrotask(() => {
        const latest = getSearchObject();
        if (latest?.query === query && decodedSort(latest.order) === order) {
          setSearchObject({ ...latest, order: encodedSort(next), page: 1 });
        }
      });
      return true;
    },
  };
}
