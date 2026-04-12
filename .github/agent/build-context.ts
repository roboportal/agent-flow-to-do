#!/usr/bin/env npx tsx
/**
 * build-context.ts — Smart file picker for agent context.
 * Selects relevant repository files within a token budget.
 *
 * Usage: npx tsx build-context.ts [keyword1] [keyword2] ...
 * Reads config from .github/agent/config.yml
 * Outputs formatted file contents to stdout.
 */

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export interface Config {
  max_context_tokens?: number;
  always_include?: string[];
  [key: string]: unknown;
}

export const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg",
  ".woff", ".woff2", ".ttf", ".eot",
  ".mp3", ".mp4", ".zip", ".tar", ".gz", ".pdf",
  ".exe", ".dll", ".so", ".dylib", ".o", ".pyc",
]);

export const LOCK_FILES = new Set([
  "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "Gemfile.lock", "poetry.lock", "Cargo.lock", "go.sum",
]);

export const SOURCE_EXTENSIONS = new Set([
  ".py", ".js", ".ts", ".tsx", ".jsx", ".go", ".rs",
  ".rb", ".java", ".kt", ".swift", ".c", ".cpp", ".h",
]);

export function loadConfig(configPath: string): Config {
  const raw = readFileSync(configPath, "utf-8");
  return (yaml.load(raw) as Config) ?? {};
}

export function getTrackedFiles(repoRoot: string): string[] {
  try {
    const output = execSync("git ls-files", { cwd: repoRoot, encoding: "utf-8" });
    return output.split("\n").filter(Boolean);
  } catch {
    const output = execSync("find . -type f -not -path './.git/*'", {
      cwd: repoRoot,
      encoding: "utf-8",
    });
    return output.split("\n").filter(Boolean).map((f) => f.replace(/^\.\//, ""));
  }
}

export function isTextFile(file: string): boolean {
  const ext = extname(file).toLowerCase();
  if (BINARY_EXTENSIONS.has(ext)) return false;
  if (LOCK_FILES.has(file)) return false;
  if (file.startsWith(".github/agent/")) return false;
  return true;
}

export function scoreFile(
  file: string,
  keywords: string[],
  alwaysInclude: Set<string>,
  contentReader?: (file: string) => string | null,
): number {
  let score = 0;

  if (alwaysInclude.has(file)) score += 100;

  const fileLower = file.toLowerCase();
  for (const kw of keywords) {
    if (fileLower.includes(kw)) score += 10;
  }

  if (keywords.length > 0 && contentReader) {
    const content = contentReader(file);
    if (content) {
      const head = content.split("\n").slice(0, 500).join("\n").toLowerCase();
      for (const kw of keywords) {
        if (head.includes(kw)) score += 5;
      }
    }
  }

  const base = basename(file);
  if (/^(README|CONTRIBUTING|CHANGELOG)/i.test(base)) score += 3;
  else if (base.endsWith(".md")) score += 1;
  if (/^(Makefile|Dockerfile|docker-compose)/i.test(base)) score += 2;

  const ext = extname(file).toLowerCase();
  if (SOURCE_EXTENSIONS.has(ext)) score += 2;

  return score;
}

export interface FileEntry {
  path: string;
  content: string;
}

export function buildOutput(files: FileEntry[], maxChars: number): string {
  let currentChars = 0;
  const parts: string[] = [];

  for (const { path, content } of files) {
    const header = `\n--- FILE: ${path} ---\n`;
    const footer = `\n--- END FILE ---\n`;
    const totalAddition = header.length + content.length + footer.length;

    if (currentChars + totalAddition > maxChars) {
      if (currentChars === 0) {
        const remaining = maxChars - header.length - footer.length;
        parts.push(header + content.slice(0, remaining) + footer);
      }
      continue;
    }

    parts.push(header + content + footer);
    currentChars += totalAddition;
  }

  return parts.join("");
}

function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(scriptDir, "../..");
  const configPath = resolve(scriptDir, "config.yml");

  const config = loadConfig(configPath);
  const maxTokens = config.max_context_tokens ?? 80_000;
  const maxChars = maxTokens * 4;
  const alwaysInclude = new Set(config.always_include ?? []);
  const keywords = process.argv.slice(2).map((k) => k.toLowerCase());

  const allFiles = getTrackedFiles(repoRoot);

  const contentReader = (file: string): string | null => {
    try {
      return readFileSync(resolve(repoRoot, file), "utf-8");
    } catch {
      return null;
    }
  };

  const scored = allFiles
    .filter((f) => isTextFile(f) && existsSync(resolve(repoRoot, f)))
    .map((file) => ({
      file,
      score: scoreFile(file, keywords, alwaysInclude, contentReader),
    }))
    .sort((a, b) => b.score - a.score);

  const entries: FileEntry[] = [];
  for (const { file } of scored) {
    const content = contentReader(file);
    if (content !== null) {
      entries.push({ path: file, content });
    }
  }

  process.stdout.write(buildOutput(entries, maxChars));
}

// Run only when executed directly
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main();
}
