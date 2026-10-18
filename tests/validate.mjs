import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const manifest = JSON.parse(await readFile(resolve(root, "ipollowork.plugin.json"), "utf8"));
assert.equal(manifest.schemaVersion, 2);
assert.equal(manifest.source.trusted, false);
assert.equal("permissions" in manifest, false);
assert.match(manifest.package.publisher.id, /^[a-z0-9][a-z0-9._-]*$/);
assert.equal(manifest.resources.length, 1);
assert.equal(manifest.resources[0].type, "skill");
assert.equal(manifest.resources[0].path, "skills/multi-repo-task-router");

const skill = await readFile(resolve(root, "skills/multi-repo-task-router/SKILL.md"), "utf8");
assert.match(skill, /^---\nname: multi-repo-task-router\ndescription: Use when /);
for (const heading of ["## Inputs", "## Workflow", "## Boundaries", "## Output"]) assert.ok(skill.includes(heading));
for (const ref of ["references/routing-rules.md", "references/task-map-template.md"]) {
  assert.ok(skill.includes(ref));
  await stat(resolve(root, "skills/multi-repo-task-router", ref));
}

const expected = await readFile(resolve(root, "examples/expected-task-map.md"), "utf8");
for (const heading of ["## Outcome", "## Repository scope", "## Shared-contract ledger", "## Dependency graph", "## Work packets", "## Cross-repository verification", "## Coordination ledger", "## Unresolved routing questions"]) assert.ok(expected.includes(heading));
for (const repo of ["acme/payments", "acme/order-api", "acme/web-store", "acme/mobile"]) assert.ok(expected.includes(repo));
assert.ok(expected.includes("additive"));

const topics = JSON.parse(await readFile(resolve(root, "topics.json"), "utf8"));
for (const topic of ["ipollowork", "ipollowork-plugin", "github-copilot", "multi-repository", "slack", "microsoft-teams"]) assert.ok(topics.includes(topic));

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    if ([".git", "dist", "node_modules"].includes(name)) continue;
    const path = resolve(dir, name);
    const info = await stat(path);
    if (info.isSymbolicLink()) throw new Error(`symlink forbidden: ${path}`);
    if (info.isDirectory()) out.push(...await walk(path)); else out.push(path);
  }
  return out;
}
const forbiddenCredentialMarker = ["codex.daily-ai", "github.credentials"].join(".");
for (const path of await walk(root)) {
  const rel = relative(root, path).split(sep).join("/");
  assert.ok(!rel.includes(".."));
  const text = await readFile(path).catch(() => Buffer.alloc(0));
  assert.ok(!text.toString().includes(forbiddenCredentialMarker), `credential service leaked in ${rel}`);
}
console.log("Validated manifest, routing references, cross-repository scenario, topics, paths, and secret hygiene.");
