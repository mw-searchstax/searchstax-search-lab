const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  positiveBudget, resolveReleaseId, ledgerPath, RELEASE_LIMIT, MONTH_LIMIT,
} = require('./search-traffic.cjs');

function main(args) {
  // Named npm shortcuts place their check before the user-supplied --budget.
  if (args[1] === '--budget') args = [...args.slice(1), args[0]];
  const [flag, value, ...checks] = args;
  const allowed = ['load-more', 'facets', 'sort-controls', 'sorting-defaults', 'promotions', 'entry', 'pilot-smoke'];
  if (flag !== '--budget' || !checks.length || checks.some(check => !allowed.includes(check))) {
    throw Error('Usage: npm run qa:release -- --budget N CHECK [CHECK ...]. Checks: ' + allowed.join(', '));
  }
  const limit = positiveBudget(value);
  if (limit > RELEASE_LIMIT) throw Error('A release can use at most ' + RELEASE_LIMIT + ' live requests.');
  const releaseId = process.env.QA_RELEASE_ID || resolveReleaseId();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-lab-live-'));
  try {
    fs.writeFileSync(path.join(dir, 'limit'), String(limit));
    for (const check of checks) {
      const run = spawnSync(process.execPath, [path.join(__dirname, check + '.cjs')], {
        env: {
          ...process.env,
          QA_RELEASE_RUN: dir,
          QA_RELEASE_ID: releaseId,
          QA_BUDGET_LEDGER: ledgerPath(),
        }, stdio: 'inherit',
      });
      if (run.error) throw run.error;
      if (run.status !== 0 || fs.existsSync(path.join(dir, 'stopped'))) { process.exitCode = 1; break; }
    }
  } finally {
    const used = fs.readdirSync(dir).filter(file => file.startsWith('request-')).length;
    const stopped = path.join(dir, 'stopped');
    console.log('Live release ' + releaseId + ' used ' + used + ' of ' + limit +
      ' run requests. Monthly account cap: ' + MONTH_LIMIT + '.' +
      (fs.existsSync(stopped) ? ' ' + fs.readFileSync(stopped, 'utf8') + '.' : ''));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
