import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const site = new URL('https://mw-searchstax.github.io/searchstax-search-lab/');
const revision = execFileSync('git', ['rev-parse', '--verify', 'origin/gh-pages^{commit}'], { encoding: 'utf8' }).trim();
const index = await readFile('dist/index.html', 'utf8');
const files = await readdir('dist', { recursive: true, withFileTypes: true });
const paths = files.filter(entry => entry.isFile()).map(entry => join(entry.parentPath, entry.name));

// A stale Pages branch can contain assets from previous releases. Check the
// current entry points and every file emitted by this build.
for (const [, asset] of index.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)) {
  await readFile(join('dist', asset));
}
for (const path of paths.sort()) {
  const name = relative('dist', path).split(sep).join('/');
  const local = await readFile(path);
  const committed = execFileSync('git', ['show', revision + ':' + name], { maxBuffer: 32 * 1024 * 1024 });
  if (!local.equals(committed)) throw new Error(name + ' differs from Pages commit ' + revision);
  const response = await fetch(new URL(name === 'index.html' ? './' : name, site), {
    cache: 'no-store', signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(name + ' returned HTTP ' + response.status);
  if (!local.equals(Buffer.from(await response.arrayBuffer()))) throw new Error(name + ' differs from the live site');
  console.log(createHash('sha256').update(local).digest('hex'), name);
}
console.log('Build, Pages commit ' + revision + ' and live site match.');
