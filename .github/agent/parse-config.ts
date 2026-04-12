#!/usr/bin/env npx tsx
/**
 * parse-config.ts — Extract values from config.yml for GitHub Actions.
 *
 * Usage:
 *   npx tsx parse-config.ts model stack          # prints key=value lines
 *   npx tsx parse-config.ts --list reviewers     # prints list items, one per line
 *   npx tsx parse-config.ts --check-user <user>  # exits 0 if user is in allowed_users (or list is empty)
 *
 * Output format (default): key=value lines suitable for >> $GITHUB_OUTPUT
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export type ConfigData = Record<string, unknown>;

export function loadConfig(configPath: string): ConfigData {
  const raw = readFileSync(configPath, "utf-8");
  return (yaml.load(raw) as ConfigData) ?? {};
}

export function parseValues(config: ConfigData, keys: string[]): string[] {
  return keys.map((key) => `${key}=${String(config[key] ?? "")}`);
}

export function listValues(config: ConfigData, key: string): string[] {
  const val = config[key];
  if (!Array.isArray(val)) return [];
  return val.map(String);
}

export function checkUser(config: ConfigData, user: string): boolean {
  const allowed = config.allowed_users;
  if (!Array.isArray(allowed) || allowed.length === 0) return true;
  return allowed.includes(user);
}

function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const configPath = resolve(scriptDir, "config.yml");
  const config = loadConfig(configPath);
  const args = process.argv.slice(2);

  if (args[0] === "--list") {
    for (const item of listValues(config, args[1])) {
      console.log(item);
    }
  } else if (args[0] === "--check-user") {
    console.log(`authorized=${checkUser(config, args[1])}`);
  } else {
    for (const line of parseValues(config, args)) {
      console.log(line);
    }
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main();
}
