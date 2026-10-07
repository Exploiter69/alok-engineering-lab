import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");

test("content editor UI defines every action it wires", () => {
  assert.match(source, /async function editor\(/);
  assert.match(source, /function collectMetadata\(/);
  assert.match(source, /data-field/);
  assert.match(source, /id="save"/);
});

test("new content action has a safe default collection", () => {
  assert.match(source, /state\.collection \|\| Object\.keys\(state\.schema\.collections\)\[0\]/);
});
