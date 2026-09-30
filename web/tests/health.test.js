import assert from "node:assert/strict";
import test from "node:test";
import { isHealthResponse } from "../lib/health.js";

const expected = {
  schemaVersion: "0.1", service: "breast-ai-api",
  status: "ok", modelStatus: "not_loaded",
};

test("accept the actual foundation response", () => {
  assert.equal(isHealthResponse(expected), true);
});

test("reject another service, unsupported version and invented model readiness", () => {
  for (const change of [
    { service: "other-api" }, { schemaVersion: "0.2" },
    { modelStatus: "ready" }, { unexpected: true },
  ]) {
    assert.equal(isHealthResponse({ ...expected, ...change }), false);
  }
  for (const value of [null, undefined, [], "ok", { status: "ok" }]) {
    assert.equal(isHealthResponse(value), false);
  }
});
