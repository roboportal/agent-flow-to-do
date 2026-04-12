import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseValues, listValues, checkUser, type ConfigData } from "./parse-config.ts";

const sampleConfig: ConfigData = {
  model: "claude-sonnet-4-20250514",
  stack: "Next.js + TypeScript",
  allowed_users: ["alice", "bob"],
  reviewers: ["charlie"],
};

describe("parseValues", () => {
  it("returns key=value for scalar keys", () => {
    const result = parseValues(sampleConfig, ["model", "stack"]);
    assert.deepEqual(result, [
      "model=claude-sonnet-4-20250514",
      "stack=Next.js + TypeScript",
    ]);
  });

  it("returns empty string for missing keys", () => {
    const result = parseValues(sampleConfig, ["nonexistent"]);
    assert.deepEqual(result, ["nonexistent="]);
  });

  it("returns empty array for no keys", () => {
    assert.deepEqual(parseValues(sampleConfig, []), []);
  });
});

describe("listValues", () => {
  it("returns array items as strings", () => {
    const result = listValues(sampleConfig, "allowed_users");
    assert.deepEqual(result, ["alice", "bob"]);
  });

  it("returns empty array for non-array key", () => {
    assert.deepEqual(listValues(sampleConfig, "model"), []);
  });

  it("returns empty array for missing key", () => {
    assert.deepEqual(listValues(sampleConfig, "nonexistent"), []);
  });

  it("returns single-item arrays", () => {
    assert.deepEqual(listValues(sampleConfig, "reviewers"), ["charlie"]);
  });
});

describe("checkUser", () => {
  it("allows listed users", () => {
    assert.ok(checkUser(sampleConfig, "alice"));
    assert.ok(checkUser(sampleConfig, "bob"));
  });

  it("denies unlisted users", () => {
    assert.ok(!checkUser(sampleConfig, "eve"));
  });

  it("allows anyone when allowed_users is empty", () => {
    const config = { ...sampleConfig, allowed_users: [] };
    assert.ok(checkUser(config, "anyone"));
  });

  it("allows anyone when allowed_users is missing", () => {
    const config = { model: "test" };
    assert.ok(checkUser(config, "anyone"));
  });

  it("allows anyone when allowed_users is not an array", () => {
    const config = { ...sampleConfig, allowed_users: "not-an-array" };
    assert.ok(checkUser(config, "anyone"));
  });
});
