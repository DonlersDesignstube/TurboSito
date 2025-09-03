const fse = require('fs-extra');
const fg = require('fast-glob');
const path = require('path');
const posthtml = require('posthtml');
const include = require('posthtml-include');

const SRC = '.';
const OUT = 'dist';
(async () => {
  // Clean dist
  await fse.remove(OUT);
  await fse.ensureDir(OUT);

  // 1) Assets & sonstige Dateien kopieren (alles außer .html, node_modules, dist, .git)
  const assets = await fg(['**/*', '!**/*.html', '!node_modules/**', '!dist/**', '!.git/**']);
  await Promise.all(assets.map(async (p) => {
    const dest = path.join(OUT, p);
    await fse.ensureDir(path.dirname(dest));
    await fse.copy(p, dest);
  }));

  // 2) HTML-Dateien rendern (Partials zusammenführen)
  const htmlFiles = await fg(['**/*.html', '!node_modules/**', '!dist/**', '!.git/**']);
  for (const file of htmlFiles) {
    const src = await fse.readFile(file, 'utf8');
    const { html } = await posthtml([ include({ root: '.' }) ]).process(src, { from: file });
    const dest = path.join(OUT, file);
    await fse.ensureDir(path.dirname(dest));
    await fse.writeFile(dest, html, 'utf8');
  }

  // 3) .nojekyll ins dist (Pages ignoriert _-Ordner sonst)
  await fse.writeFile(path.join(OUT, '.nojekyll'), '');
  console.log('Build complete → dist/');
})();
