/* Build estático: copia el sitio (HTML/CSS/JS/imagenes) a dist/ sin procesar.
   Hostinger ejecuta `npm run build` y sirve dist/. No requiere framework. */
const fs = require('fs');
const path = require('path');

const DIST = 'dist';
// Lo que NO debe ir a producción:
const EXCLUDE = new Set([
  'dist', '_legacy', 'node_modules', '.git', '.githooks', '.gitignore',
  'package.json', 'package-lock.json', 'build.js', 'README.md'
]);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

let count = 0;
for (const name of fs.readdirSync('.')) {
  if (EXCLUDE.has(name)) continue;
  fs.cpSync(name, path.join(DIST, name), { recursive: true });
  count++;
}
console.log('Build estático listo: ' + count + ' entradas copiadas a ' + DIST + '/');
