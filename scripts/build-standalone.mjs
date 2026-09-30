import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceDirectory = resolve('legacy/source');
const outputDirectory = resolve('dist');
const output = resolve(outputDirectory, 'enigma_simulator.html');
const legacySnapshot = resolve('legacy/enigma_simulator_v1.5.html');
const webSnapshot = resolve('apps/web/public/enigma_simulator.html');

let html = await readFile(resolve(sourceDirectory, 'enigma-shell.html'), 'utf8');
const replacements = new Map([
  ['<!-- CODEBOOK_CSS -->', await readFile(resolve(sourceDirectory, 'codebook.css'), 'utf8')],
  [
    '<!-- ENGINE_SCRIPT -->',
    `<script>\n${await readFile(resolve(sourceDirectory, 'enigma-engine.js'), 'utf8')}\n</script>`,
  ],
  [
    '<!-- UI_SCRIPT -->',
    `<script>\n${await readFile(resolve(sourceDirectory, 'enigma-ui.js'), 'utf8')}\n</script>`,
  ],
  [
    '<!-- CODEBOOK_SCRIPT -->',
    `<script>\n${await readFile(resolve(sourceDirectory, 'enigma-codebook.js'), 'utf8')}\n</script>`,
  ],
]);

for (const [marker, value] of replacements) {
  if (!html.includes(marker)) throw new Error(`Thiếu build marker: ${marker}`);
  // Callback prevents $&, $`, and $' inside source from being interpreted as replacement tokens.
  html = html.replace(marker, () => value);
}

if ((html.match(/<\/body><\/html>/g) ?? []).length !== 1 || !html.trimEnd().endsWith('</body></html>')) {
  throw new Error('Cấu trúc HTML bị hỏng sau khi build.');
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(output, html),
  writeFile(legacySnapshot, html),
  writeFile(webSnapshot, html),
]);
const file = await stat(output);
console.log(`Standalone HTML: ${output} (${file.size} bytes)`);
