// main.ts — Frost Trophy Guide entrypoint: hands the entry in.
// Copies app/ and screenshots/ to the output directory and writes dossier.json
// with buildDossier from vendor/makefun-frontend.ts (the kit library, unchanged).
// Runs on Node 22 with no install: `MAKEFUN_OUTPUT_DIR=out node main.ts`.
// The output is deterministic: the same repository writes the same bytes.
import { buildDossier } from './vendor/makefun-frontend.ts';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
}));
