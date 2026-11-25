import { readFile } from 'node:fs/promises';
import { defineConfig, transformWithOxc } from 'vite';

export default defineConfig({
  base: './',
  plugins: [{
    name: 'hosted-pilot-connection',
    apply: 'build',
    transformIndexHtml(html) {
      const token = process.env.SEARCH_LAB_PILOT_READ_TOKEN;
      if (!token) return html;
      if (!/^[a-f0-9]{40}$/i.test(token)) throw new Error('Invalid pilot read-only token format');
      return html.replace('data-search-credential="recorded-only"', 'data-search-credential="' + token + '"');
    },
  }, {
    name: 'starter-javascript-source',
    async load(id) {
      if (!id.endsWith('.ts?starter-js')) return;
      const file = id.slice(0, -'?starter-js'.length);
      this.addWatchFile(file);
      const { code } = await transformWithOxc(await readFile(file, 'utf8'), file);
      return 'export default ' + JSON.stringify(code);
    },
  }],
});
