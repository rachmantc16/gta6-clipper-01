// Entry point for the gta6-clipper-01 make.fun entry.
//
// The actual entry is the YouTube Short named in VIDEO.json — this program's
// only job is to hand that file to the grader. It reads VIDEO.json from the
// bot directory and writes an identical copy into the output directory,
// creating that directory first if it is missing.
//
// Directory locations come from the environment so the same file works both
// inside the grading container (where the defaults /bot and /output apply)
// and in a plain local checkout (where the caller points both variables at
// the working tree).
//
// Node 22, standard library only.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_DIR = process.env.MAKEFUN_BOT_DIR || '/bot';
const TARGET_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const FILE_NAME = 'VIDEO.json';

function bail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

function handOverVideoPointer(): void {
  const sourcePath = join(SOURCE_DIR, FILE_NAME);
  const targetPath = join(TARGET_DIR, FILE_NAME);

  if (!existsSync(sourcePath)) {
    bail(`no ${FILE_NAME} found at ${sourcePath} — nothing to hand in`);
  }

  // Read the bytes once and write them back out untouched, so the copy the
  // grader sees is exactly the file committed in this repository.
  const payload = readFileSync(sourcePath);

  mkdirSync(TARGET_DIR, { recursive: true });
  writeFileSync(targetPath, payload);
}

try {
  handOverVideoPointer();
} catch (err) {
  bail(`could not deliver ${FILE_NAME}: ${(err as Error).message}`);
}
