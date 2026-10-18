import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rm, stat, utimes, writeFile } from "node:fs/promises";
import { basename, dirname, relative, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(new URL(".", import.meta.url).pathname);
const dist = resolve(root, "dist");
const stage = resolve(root, ".stage");
const version = "1.0.0";
const archiveTime = new Date("2026-01-01T00:00:00.000Z");
await rm(dist, { recursive: true, force: true });
await rm(stage, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

async function copy(rel) {
  const src = resolve(root, rel);
  const dst = resolve(stage, rel);
  await mkdir(dirname(dst), { recursive: true });
  await cp(src, dst, { recursive: true, errorOnExist: true });
}

async function normalizeTimes(target) {
  const entry = await stat(target);
  if (entry.isDirectory()) {
    for (const name of (await readdir(target)).sort()) {
      await normalizeTimes(resolve(target, name));
    }
  }
  await utimes(target, archiveTime, archiveTime);
}
await copy("ipollowork.plugin.json");
await copy("skills");
await normalizeTimes(stage);
execFileSync("zip", ["-X", "-q", "-r", resolve(dist, `multi-repo-task-router-${version}.ipollowork-plugin`), "ipollowork.plugin.json", "skills"], { cwd: stage });
execFileSync("zip", ["-X", "-q", "-r", resolve(dist, `multi-repo-task-router-${version}-skill.zip`), "multi-repo-task-router"], { cwd: resolve(stage, "skills") });

const sourceFiles = [".github", ".gitignore", "CHANGELOG.md", "LICENSE", "README.md", "README.zh-CN.md", "docs", "examples", "ipollowork.plugin.json", "package.json", "package.mjs", "skills", "tests", "topics.json"];
const sourceStage = resolve(root, ".source-stage", "multi-repo-task-router");
await rm(resolve(root, ".source-stage"), { recursive: true, force: true });
for (const rel of sourceFiles) {
  await mkdir(dirname(resolve(sourceStage, rel)), { recursive: true });
  await cp(resolve(root, rel), resolve(sourceStage, rel), { recursive: true });
}
await normalizeTimes(resolve(root, ".source-stage"));
execFileSync("zip", ["-X", "-q", "-r", resolve(dist, `multi-repo-task-router-${version}-source.zip`), "multi-repo-task-router"], { cwd: dirname(sourceStage) });

const names = (await readdir(dist)).sort();
const lines = [];
for (const name of names) {
  const buf = await readFile(resolve(dist, name));
  lines.push(`${createHash("sha256").update(buf).digest("hex")}  ${name}`);
}
await writeFile(resolve(dist, "SHA256SUMS.txt"), `${lines.join("\n")}\n`);
await rm(stage, { recursive: true, force: true });
await rm(resolve(root, ".source-stage"), { recursive: true, force: true });
console.log(`Built ${names.length} archives and SHA256SUMS.txt`);
