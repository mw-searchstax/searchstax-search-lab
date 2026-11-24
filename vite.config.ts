import { readFile } from 'node:fs/promises';
import { defineConfig, transformWithOxc } from 'vite';

export default defineConfig({
  base: './',
  plugins: [{
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
