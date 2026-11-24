const { runRecovery } = require('./live-lesson-recovery.cjs');
const { searchFields } = require('./live-lesson-diagnostics.cjs');
runRecovery(searchFields).catch(error => { console.error(error.stack || error); process.exitCode = 1; });
