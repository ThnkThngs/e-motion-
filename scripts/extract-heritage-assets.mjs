#!/usr/bin/env node
// Extract 20 base64 JPEG previews from the Warisan Edition HTML into public/heritage/<id>.jpg.
// Usage: node scripts/extract-heritage-assets.mjs <path-to-html>

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const outDir = resolve(repoRoot, "public/heritage");

const htmlPath = process.argv[2];
if (!htmlPath) {
  console.error("usage: node scripts/extract-heritage-assets.mjs <path-to-html>");
  process.exit(1);
}

const html = readFileSync(resolve(htmlPath), "utf8");

// Each template card looks like:
//   <div class="tpl-card ... " onclick="selectTemplate(this,'songket-riau')" data-tpl-id="songket-riau">
//     <div class="tpl-preview" style="background-image:url('data:image/jpeg;base64,/9j/4...')">
//       ...
//     </div>
//     <div class="tpl-meta">
//       <div class="tpl-name">Songket Riau</div>
//       <div class="tpl-tag free">Percuma</div>  // or motion / cinematic
//     </div>
//   </div>
const cardRe =
  /data-tpl-id="([^"]+)"[\s\S]*?style="background-image:url\('data:image\/jpeg;base64,([^']+)'\)[\s\S]*?<div class="tpl-name">([^<]+)<\/div>[\s\S]*?<div class="tpl-tag (free|motion|cinematic)">/g;

mkdirSync(outDir, { recursive: true });

const index = [];
let match;
while ((match = cardRe.exec(html)) !== null) {
  const [, id, b64, displayName, tier] = match;
  const buf = Buffer.from(b64, "base64");
  const file = resolve(outDir, `${id}.jpg`);
  writeFileSync(file, buf);
  index.push({ id, name: displayName.trim(), tier, thumb: `/heritage/${id}.jpg` });
  console.log(`✓ ${id} → ${(buf.length / 1024).toFixed(0)} KB (${tier})`);
}

writeFileSync(resolve(outDir, "index.json"), JSON.stringify(index, null, 2));
console.log(`\nWrote ${index.length} templates to ${outDir}`);
