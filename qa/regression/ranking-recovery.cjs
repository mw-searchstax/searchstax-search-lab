const { runRecovery } = require('./live-lesson-recovery.cjs');
const { ranking } = require('./live-lesson-diagnostics.cjs');
runRecovery(ranking).catch(error => { console.error(error.stack || error); process.exitCode = 1; });
