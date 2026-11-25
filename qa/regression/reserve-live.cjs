const { reserveCaptureRequests, positiveBudget, resolveReleaseId } = require('./search-traffic.cjs');

function option(args, name) {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

try {
  const args = process.argv.slice(2);
  const count = positiveBudget(option(args, '--count'));
  const endpoint = option(args, '--endpoint');
  const purpose = option(args, '--purpose') || 'recorded-data capture';
  const releaseId = process.env.QA_RELEASE_ID || resolveReleaseId();
  const reservations = reserveCaptureRequests(count, { endpoint, purpose, releaseId });
  console.log(JSON.stringify({ releaseId, purpose, endpoint, reservations }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
