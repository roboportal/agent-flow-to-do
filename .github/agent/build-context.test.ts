import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isTextFile, scoreFile, buildOutput, type FileEntry } from "./build-context.ts";

describe("isTextFile", () => {
  it("accepts regular source files", () => {
    assert.ok(isTextFile("src/index.ts"));
    assert.ok(isTextFile("lib/utils.py"));
    assert.ok(isTextFile("README.md"));
  });

  it("rejects binary files", () => {
    assert.ok(!isTextFile("logo.png"));
    assert.ok(!isTextFile("font.woff2"));
    assert.ok(!isTextFile("archive.zip"));
    assert.ok(!isTextFile("deep/path/image.jpg"));
  });

  it("rejects lock files", () => {
    assert.ok(!isTextFile("package-lock.json"));
    assert.ok(!isTextFile("yarn.lock"));
    assert.ok(!isTextFile("Cargo.lock"));
    assert.ok(!isTextFile("go.sum"));
  });

  it("rejects .github/agent/ internal files", () => {
    assert.ok(!isTextFile(".github/agent/config.yml"));
    assert.ok(!isTextFile(".github/agent/build-context.ts"));
  });

  it("accepts files without extensions", () => {
    assert.ok(isTextFile("Makefile"));
    assert.ok(isTextFile("Dockerfile"));
  });

  it("accepts non-agent github files", () => {
    assert.ok(isTextFile(".github/workflows/ci.yml"));
  });
});

describe("scoreFile", () => {
  const noContent = undefined;

  it("gives always-include files top priority", () => {
    const score = scoreFile("README.md", [], new Set(["README.md"]), noContent);
    assert.ok(score >= 100);
  });

  it("scores keyword matches in file path", () => {
    const score = scoreFile("src/auth/login.ts", ["auth"], new Set(), noContent);
    assert.ok(score >= 10);
  });

  it("scores keyword matches in content", () => {
    const reader = () => "function authenticate() {}";
    const score = scoreFile("src/utils.ts", ["authenticate"], new Set(), reader);
    assert.ok(score >= 5);
  });

  it("gives bonus for README files", () => {
    const base = scoreFile("docs/guide.txt", [], new Set(), noContent);
    const readme = scoreFile("README.md", [], new Set(), noContent);
    assert.ok(readme > base);
  });

  it("gives bonus for source code files", () => {
    const txt = scoreFile("notes.txt", [], new Set(), noContent);
    const ts = scoreFile("app.ts", [], new Set(), noContent);
    assert.ok(ts > txt);
  });

  it("gives bonus for Dockerfiles and Makefiles", () => {
    const txt = scoreFile("notes.txt", [], new Set(), noContent);
    const docker = scoreFile("Dockerfile", [], new Set(), noContent);
    assert.ok(docker > txt);
  });

  it("accumulates multiple keyword matches", () => {
    const one = scoreFile("src/auth.ts", ["auth"], new Set(), noContent);
    const two = scoreFile("src/auth.ts", ["auth", "src"], new Set(), noContent);
    assert.ok(two > one);
  });

  it("returns 0 for file with no matches and no bonuses", () => {
    const score = scoreFile("data/stuff.csv", [], new Set(), noContent);
    assert.equal(score, 0);
  });
});

describe("buildOutput", () => {
  it("includes files within budget", () => {
    const files: FileEntry[] = [
      { path: "a.ts", content: "hello" },
      { path: "b.ts", content: "world" },
    ];
    const output = buildOutput(files, 10_000);
    assert.ok(output.includes("--- FILE: a.ts ---"));
    assert.ok(output.includes("hello"));
    assert.ok(output.includes("--- FILE: b.ts ---"));
    assert.ok(output.includes("world"));
    assert.ok(output.includes("--- END FILE ---"));
  });

  it("respects token budget", () => {
    const files: FileEntry[] = [
      { path: "a.ts", content: "a".repeat(100) },
      { path: "b.ts", content: "b".repeat(100) },
    ];
    // Budget only fits one file
    const output = buildOutput(files, 150);
    assert.ok(output.includes("a.ts"));
    assert.ok(!output.includes("b.ts"));
  });

  it("truncates first file if it exceeds budget alone", () => {
    const files: FileEntry[] = [
      { path: "big.ts", content: "x".repeat(1000) },
    ];
    const output = buildOutput(files, 200);
    assert.ok(output.includes("big.ts"));
    assert.ok(output.length <= 200);
  });

  it("returns empty string for empty input", () => {
    assert.equal(buildOutput([], 10_000), "");
  });

  it("skips oversized files but includes later smaller ones", () => {
    const files: FileEntry[] = [
      { path: "small.ts", content: "ok" },
      { path: "big.ts", content: "x".repeat(10_000) },
      { path: "also-small.ts", content: "fine" },
    ];
    const output = buildOutput(files, 200);
    assert.ok(output.includes("small.ts"));
    assert.ok(!output.includes("big.ts"));
    assert.ok(output.includes("also-small.ts"));
  });
});
