const path = require('node:path');
const checkDownloads = require('./download-matrix.cjs');

const variants = ['', 'url asc', 'url desc'].map(start => [start || 'relevance', {
  QA_SORT_LABEL: 'Order results', QA_SORT_PLACEMENT: 'below', QA_SORT_START: start,
}]);
checkDownloads('sort', path.join(__dirname, 'sort-controls.cjs'), variants)
  .catch(error => { console.error(error.message); process.exitCode = 1; });
