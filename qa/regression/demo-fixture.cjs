const fixture = require('./fixtures/searchlabbuild-sorts.json');
const { matchesFilter } = require('../../src/recorded-response.js');

const demoSite = 'https://mw-searchstax.github.io/university-health-search-demo/';
const typeField = 'demo_content_type_s';
const areaField = 'demo_campus_area_s';
const types = ['location', 'provider', 'department', 'service', 'news', 'resource'];
const notice = { title: 'Flu Clinic Updates — 2026 Notice', url: demoSite + 'news/flu-clinic-update-2026/' };
const appointment = demoSite + 'care/resources/flu-shot-appointments/';

function record(title, slug, type) {
  return { id: slug, url: demoSite + slug + '/', title, [typeField]: type };
}

const campus = [...fixture.results, ...Array.from({ length: fixture.syntheticCount }, (_, i) => {
  const id = 'fixture-' + String(i + 1).padStart(2, '0');
  return record(id, 'fixture-pages/' + id, 'resource');
})].map((doc, i) => ({ ...doc, [typeField]: i < 8 ? 'location' : i < 16 ? 'provider' : types[2 + i % 4] }));

const orthopedics = record('Orthopedics', 'care/orthopedics', 'department');
const provider = record('Adrian Pell', 'providers/adrian-pell', 'provider');
const transit = record('Transit Access', 'resources/transit-access', 'resource');
const international = record('International Health', 'care/services/international-health', 'department');
const currentNotice = { ...notice, id: 'flu-notice', [typeField]: 'news' };

function recordsFor(query, profile) {
  switch (query.toLowerCase()) {
    case 'campus': return campus;
    case 'rehabilitation':
    case 'orthopedics': return [orthopedics, provider, campus[0]];
    case 'travel vaccinations': return profile === 'SearchLabAfter' ? [international, transit] : [transit];
    case 'campus flu clinic': {
      const first = [campus[1], record('Clinic physician', 'fixture-pages/clinic-physician', 'provider'), currentNotice, campus[0], campus[2]];
      if (profile === 'SearchLabRanking') first.unshift(...first.splice(3, 1));
      if (profile === fixture.profile) first.unshift(...first.splice(2, 1));
      return first.concat(Array.from({ length: 39 }, (_, i) => record('Clinic ' + i, 'clinic-fixtures/' + i, i < 7 ? 'provider' : i < 12 ? 'location' : 'department')));
    }
    default: return [];
  }
}

function orderRecords(records, sort) {
  if (!sort || sort === 'score desc') return records;
  if (!fixture.sorts.some(({ name, order }) => name + ' ' + order === sort)) throw Error('Unpublished fixture sort');
  const sorted = records.toSorted((a, b) => a.url.localeCompare(b.url));
  return sort === 'url asc' ? sorted : sorted.reverse();
}

// Synthetic search results for QA only. Each search is resolved in the test process.
function searchResponse(url) {
  const params = Object.fromEntries(url.searchParams);
  const hasCampusAreas = params.q?.toLowerCase() === 'campus' && params.model === fixture.profile;
  const fields = [{ name: typeField, label: 'Content type', values: types }];
  let original = recordsFor(params.q || '', params.model);
  if (hasCampusAreas) {
    fields.push({ name: areaField, label: 'Campus area', values: ['North', 'South'] });
    original = original.map((doc, index) => ({ ...doc, [areaField]: index % 3 === 0 ? 'North' : 'South' }));
  }
  const filters = url.searchParams.getAll('fq').filter(filter => filter.trim());
  const records = original.filter(doc => filters.every(filter => matchesFilter(doc, filter)));
  const start = Number(params.start || 0);
  const docs = orderRecords(records, params.sort).slice(start, start + Number(params.rows ?? 10));
  const counts = Object.fromEntries(fields.map(({ name, values }) => [name, values.flatMap(value => {
    const count = records.filter(doc => doc[name] === value).length;
    return count ? [value, count] : [];
  })]));
  const promotion = params.model === fixture.profile && params.q === 'campus flu clinic';
  const highlight = params.model === fixture.profile && params.q === 'rehabilitation' && params.hl !== 'false';
  return {
    responseHeader: { params: { ...params, uniqueId: 'id', hl: highlight } },
    highlighting: highlight ? Object.fromEntries(docs.map(doc => [doc.id, {
      description: ['Find <em>rehabilitation</em> services and appointments.'],
    }])) : {},
    response: { start, numFound: records.length, docs: docs.map(doc => ({ ...doc, description: 'Sample passage for ' + doc.title,
      '[elevated]': promotion && doc.id === currentNotice.id })) },
    metadata: {
      sorts: params.model === fixture.profile ? fixture.sorts : [],
      facets: fields.map(({ name, label }) => ({ name, label })),
      results: [{ name: 'title', result_card: 'title' }, { name: 'url', result_card: 'url' },
        { name: 'description', result_card: 'description' }, { name: typeField, result_card: 'ribbon' }],
    },
    facet_counts: { facet_fields: counts },
    externalLinks: promotion ? [{ name: 'Flu shot appointment information', url: appointment }] : [],
  };
}

module.exports = { campus, searchResponse };
