const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { unzipSync } = require('fflate');

const check = path.join(__dirname, 'sort-controls.cjs');
const kits = { javascript: '.', react: 'dist', vue: 'dist', angular: 'dist/starter/browser' };
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

async function run(command, args, cwd, env = {}) {
  const child = spawn(command, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
  await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(Error(command + ' exited with ' + code)));
  });
}

async function unpack(zip, directory) {
  for (const [name, data] of Object.entries(unzipSync(await fs.readFile(zip)))) {
    const dest = path.resolve(directory, name);
    if (!dest.startsWith(directory + path.sep)) throw Error('Invalid archive path');
    await fs.mkdir(path.dirname(dest), { recursive: true });
    if (!name.endsWith('/')) await fs.writeFile(dest, data);
  }
}

async function checkServed(directory, start) {
  const server = http.createServer(async (req, res) => {
    try {
      const file = path.resolve(directory, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
      if (!file.startsWith(directory + path.sep)) throw Error('Invalid path');
      const body = await fs.readFile(file);
      res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
  try {
    await run(process.execPath, [check], __dirname, {
      QA_STARTER_URL: 'http://127.0.0.1:' + server.address().port + '/',
      QA_SORT_LABEL: 'Order results', QA_SORT_PLACEMENT: 'below', QA_SORT_START: start,
    });
  } finally { await new Promise(resolve => server.close(resolve)); }
}

async function main() {
  const { localQA, liveQA } = require('./runtime.cjs');
  if (!localQA || liveQA) throw Error('Run the fixture download matrix against a local Build server.');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'search-lab-sort-'));
  console.log('Local sorting QA files: ' + dir);
  await run(process.execPath, [check], __dirname, { QA_STARTER_URL: '', QA_ARTIFACT_DIR: dir });
  for (const [kit, output] of Object.entries(kits)) {
    const installs = new Map();
    for (const start of ['', 'url asc', 'url desc']) {
      const base = path.join(dir, start || 'relevance', kit);
      const work = path.join(base, 'app');
      await unpack(path.join(base, 'starter.zip'), work);
      if (kit !== 'javascript') {
        const lock = await fs.readFile(path.join(work, 'package-lock.json'), 'utf8');
        if (!installs.has(lock)) {
          await run('npm', ['ci', '--prefer-offline', '--no-audit', '--no-fund'], work);
          installs.set(lock, path.join(work, 'node_modules'));
        } else await fs.symlink(installs.get(lock), path.join(work, 'node_modules'), 'dir');
        await run('npm', ['run', 'build'], work);
      }
      await checkServed(path.resolve(work, output), start);
      console.log(kit + ' passed with starting sort ' + (start || 'relevance'));
    }
  }
  console.log('All 12 downloaded starters passed with fixtures.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
