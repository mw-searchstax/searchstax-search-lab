// The recordings contain complete result sets. Replay only the filter clauses
// used by the Lab and UI Kits, and only sorts published for this profile.
function matchesClause(doc, clause) {
  const fieldValue = clause.trim().match(/^(-?)([\w.-]+):\s*(.+)$/);
  if (!fieldValue) return false;
  const [, negative, field, value] = fieldValue;
  const wanted = value.replace(/^\((.*)\)$/, '$1').split(/\s+OR\s+/).map(item =>
    item.trim().replace(/^"(.*)"$/, '$1').replace(/\\(["\\])/g, '$1'));
  const raw = doc[field];
  const actual = Array.isArray(raw) ? raw : [raw];
  const found = actual.some(item => item != null && wanted.includes(String(item)));
  return negative ? !found : found;
}

export function matchesFilter(doc, filter) {
  // The UI Kit and the API client both emit field:value clauses. Groups with
  // the field outside the parentheses share it across their values.
  const group = filter.trim().replace(/^\((.*)\)$/, '$1');
  if (/^-?[\w.-]+:\s*\(/.test(group)) return matchesClause(doc, group);
  return group.split(/\s+AND\s+/).every(and =>
    and.split(/\s+OR\s+/).some(or => matchesClause(doc, or)));
}

const sampleMetadata = new Map([
  ['https://mw-searchstax.github.io/university-health-search-demo/care/providers/simon-kelver', ['Accessible design', 'Design students']],
  ['https://mw-searchstax.github.io/university-health-search-demo/care/services/rehabilitation', ['Room planning', 'Students and instructors']],
]);

function addSampleMetadata(payload) {
  const examples = payload.response.docs.filter(doc => sampleMetadata.has(doc.id));
  if (!examples.length) return;
  payload.metadata.results.push(
    { name: 'sample_topic_s', title: 'Sample topic', result_card: '' },
    { name: 'sample_audience_s', title: 'Sample audience', result_card: '' },
  );
  for (const doc of examples) {
    [doc.sample_topic_s, doc.sample_audience_s] = sampleMetadata.get(doc.id);
  }
}

export function replayRecordedResponse(catalog, searchParams) {
  const model = searchParams.get('model') || '';
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  if (!Object.hasOwn(catalog, model) || !Object.hasOwn(catalog[model], query)) return;
  const recording = catalog[model][query];
  const language = searchParams.get('language');
  if (language && language !== recording.responseHeader.params.language) return;
  const payload = structuredClone(recording);
  // Add labeled practice fields to the Build example without changing the capture.
  if (model === 'SearchLabBuild' && query === 'rehabilitation') addSampleMetadata(payload);
  const params = payload.responseHeader.params;
  for (const name of ['q', 'model', 'language', 'sort', 'start', 'rows', 'facet']) {
    if (searchParams.has(name)) params[name] = searchParams.get(name);
  }
  const filters = searchParams.getAll('fq').filter(value => value.trim());
  const docs = payload.response.docs.filter(doc => filters.every(filter => matchesFilter(doc, filter)));
  const sort = payload.metadata.sorts?.find(item => item.name + ' ' + item.order === params.sort);
  if (sort) {
    const direction = sort.order === 'desc' ? -1 : 1;
    docs.sort((left, right) => {
      const a = String(left[sort.name] ?? '');
      const b = String(right[sort.name] ?? '');
      return a < b ? -direction : a > b ? direction : 0;
    });
  }
  if (filters.length) {
    for (const [field, values] of Object.entries(payload.facet_counts?.facet_fields ?? {})) {
      const counts = new Map();
      for (const doc of docs) {
        const value = doc[field];
        for (const item of new Set(Array.isArray(value) ? value : [value])) {
          if (item != null) counts.set(item, (counts.get(item) ?? 0) + 1);
        }
      }
      payload.facet_counts.facet_fields[field] = values.filter((_, i) => i % 2 === 0)
        .filter(key => counts.has(key)).flatMap(key => [key, counts.get(key)]);
    }
  }
  const start = Math.max(0, Math.trunc(Number(params.start)) || 0);
  const rows = Math.max(0, Math.trunc(Number(params.rows ?? docs.length)) || 0);
  payload.response = { ...payload.response, start, numFound: docs.length, docs: docs.slice(start, start + rows) };
  return payload;
}
