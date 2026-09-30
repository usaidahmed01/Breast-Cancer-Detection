import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../app/api/health/route.js";

const payload = {
  schemaVersion: "0.1", service: "breast-ai-api",
  status: "ok", modelStatus: "not_loaded",
};

test("proxy forwards only a supported uncached API response", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal);
    return Response.json(payload);
  });
  const response = await GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), payload);
});

test("proxy reports an unavailable service without leaking internal error details", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("private internal details"); });
  const response = await GET();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.text()).includes("private internal details"), false);
});

test("proxy rejects invalid data even when upstream returns HTTP 200", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ status: "ok" }));
  assert.equal((await GET()).status, 503);
});
