// Interactive fixture QA for Build or any locally served JavaScript, React, Vue or Angular download.
const { chromium, baseURL } = require('./runtime.cjs');
(async () => {
  const target = new URL(process.env.QA_STARTER_URL || baseURL);
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname) || process.env.QA_RELEASE_RUN)
    throw Error('Use a loopback URL for the interactive fixture preview.');
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  try {
    const page = await browser.newPage();
    if (!process.env.QA_STARTER_URL && !target.hash) target.hash = 'lab-design';
    const closed = page.waitForEvent('close', { timeout: 0 });
    await page.goto(target.href);
    console.log('Fixture QA is open. Close the QA window to finish.');
    await closed;
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
