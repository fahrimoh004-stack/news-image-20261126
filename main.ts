// News Image 26 November 2026 — entry program (Node 22, standard library only).
// It copies the image held in this repository to the grader's output path.
// The image itself is a newspaper front page drawn for Thursday 26 November
// 2026: five stories reported that day, with the date in the masthead.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const entryPath = new URL("./entry.png", import.meta.url);
if (!existsSync(entryPath)) {
  throw new Error("entry.png is missing from the repository");
}
const bytes = readFileSync(entryPath);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (bytes.length < 33 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a valid PNG file (bad signature)");
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png must be at most 1 MiB, got ${bytes.length} bytes`);
}
if (bytes.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png is not a valid PNG file (first chunk is not IHDR)");
}
if (bytes.readUInt32BE(16) !== 1024 || bytes.readUInt32BE(20) !== 1024) {
  throw new Error(
    `entry.png must be 1024x1024, got ${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
copyFileSync(entryPath, join(outDir, "entry.png"));
