const assert = require('node:assert/strict');
const { test } = require('node:test');
const recordings = require('../../src/recorded-searches.json');

test('recordings cover every guided search with complete, public result sets', () => {
  const ranking = ['campus flu clinic', 'rehabilitation', 'transit access'];
  const queries = {
    'Main Profile': [...ranking, 'travel vaccinations'],
    SearchLabAfter: ['travel vaccinations'],
    SearchLabBuild: ['rehabilitation'],
    SearchLabRanking: ranking,
  };
  assert.deepEqual(Object.keys(recordings).sort(), Object.keys(queries).sort());
  for (const [profile, terms] of Object.entries(queries)) {
    assert.deepEqual(Object.keys(recordings[profile]).sort(), [...terms].sort());
    for (const term of terms) {
      const { responseHeader: { params }, response, metadata } = recordings[profile][term];
      assert.equal(params.model, profile);
      assert.equal(params.q, term);
      assert.equal(response.start, 0);
      assert.equal(response.docs.length, response.numFound);
      const urlField = metadata.results.find(field => field.result_card === 'url').name;
      for (const doc of response.docs) {
        assert.ok(doc[params.uniqueId]);
        assert.match(String(doc[urlField]), /^https:\/\/mw-searchstax\.github\.io\/university-health-search-demo\//);
      }
    }
  }
});

test('the recordings demonstrate the opening highlight, new match, ranking change and content-type filters', () => {
  const build = recordings.SearchLabBuild.rehabilitation;
  assert.ok(Object.values(build.highlighting).some(hit => /<em>rehabilitation<\/em>/i.test(String(hit.description))));
  const before = recordings['Main Profile'];
  const after = recordings.SearchLabAfter['travel vaccinations'];
  const international = doc => String(doc.url).includes('/international-health/');
  assert.ok(after.response.docs.some(international));
  assert.ok(!before['travel vaccinations'].response.docs.some(international));
  const campus = before['campus flu clinic'].response.docs;
  const boosted = recordings.SearchLabRanking['campus flu clinic'].response.docs;
  assert.notEqual(campus[0].id, boosted[0].id);
  assert.match(String(boosted[0].title), /North Campus Clinic/);
  assert.equal(campus.length, 44);
  assert.equal(campus.filter(doc => doc.demo_content_type_s === 'location').length, 8);
  assert.equal(campus.filter(doc => doc.demo_content_type_s !== 'news').length, 40);
});

test('recorded paging, filters and published sorting preserve the original recording', async () => {
  const { replayRecordedResponse } = await import('../../src/recorded-response.js');
  const params = new URLSearchParams({ model: 'SearchLabBuild', q: 'Rehabilitation', rows: '5', start: '5', sort: 'url desc' });
  params.append('fq', ''); // The kit includes an empty clause on its opening search.
  const source = recordings.SearchLabBuild.rehabilitation;
  const expected = source.response.docs.map(doc => String(doc.url)).sort().reverse().slice(5);
  const page = replayRecordedResponse(recordings, params);
  assert.deepEqual(page.response.docs.map(doc => String(doc.url)), expected);
  assert.equal(page.response.numFound, 8);
  assert.equal(source.response.docs.length, 8);
  params.set('q', 'unknown example');
  assert.equal(replayRecordedResponse(recordings, params), undefined);
  params.set('q', 'campus flu clinic');
  params.set('model', 'Main Profile');
  params.set('start', '0');
  params.append('fq', 'demo_content_type_s:"location" OR demo_content_type_s:"provider"');
  const filtered = replayRecordedResponse(recordings, params);
  assert.equal(filtered.response.numFound, 16);
  assert.deepEqual(filtered.facet_counts.facet_fields.demo_content_type_s, ['location', 8, 'provider', 8]);
});
