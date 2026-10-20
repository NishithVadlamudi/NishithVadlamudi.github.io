// Run: node --test assistant/worker.test.mjs   (no key or network: Gemini is replaced by a stub)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Cloudflare bundles the JSON import; for Node, inline it.
const here = new URL(".", import.meta.url);
const src = readFileSync(new URL("worker.js", here), "utf8")
  .replace('import kb from "./kb.json";', `const kb = ${readFileSync(new URL("kb.json", here), "utf8")};`);
const file = join(mkdtempSync(join(tmpdir(), "worker-")), "worker.mjs");
writeFileSync(file, src);
const worker = (await import(file)).default;

const SITE = "https://nishithvadlamudi.github.io";
const env = { GEMINI_API_KEY: "test-key" };
let ip = 0;
const ask = (body, { origin = SITE, method = "POST", from = `10.0.0.${++ip}` } = {}) =>
  worker.fetch(new Request("https://assistant.example/", { method, headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": from },
    body: method === "POST" ? JSON.stringify(body) : undefined }), env);
let sent;
const gemini = (text, status = 200) => { globalThis.fetch = async (url, init) => { sent = { url, init: JSON.parse(init.body), key: init.headers["x-goog-api-key"] };
  return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status }); }; };

test("preflight from the site is allowed", async () => {
  const r = await ask(null, { method: "OPTIONS" });
  assert.equal(r.status, 204);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), SITE);
});

test("other origins are refused", async () => {
  assert.equal((await ask({ question: "Where does he work?" }, { origin: "https://evil.example" })).status, 403);
});

test("question length is bounded", async () => {
  assert.equal((await ask({ question: "x".repeat(301) })).status, 400);
  assert.equal((await ask({ question: " " })).status, 400);
});

test("a grounded answer keeps known citations and drops invented ones", async () => {
  gemini("Nishith validated 4.7 times projected peak [F7]. He also likes chess [F99].");
  const r = await (await ask({ question: "How did he prepare for peak traffic?" })).json();
  assert.deepEqual(r.cites, ["F7"]);
  assert.ok(!r.answer.includes("F99"));
  assert.equal(sent.key, "test-key");
  assert.equal(sent.init.contents[0].parts[0].text, "How did he prepare for peak traffic?");  // the visitor's text stays out of the system prompt
  assert.ok(sent.init.systemInstruction.parts[0].text.includes("[F7]"));
});

test("not covered, or no citations, comes back as no answer", async () => {
  gemini("NOT_COVERED");
  assert.equal((await (await ask({ question: "What is his salary?" })).json()).answer, null);
  gemini("He is great at everything.");
  assert.equal((await (await ask({ question: "Is he good?" })).json()).answer, null);
});

test("an upstream failure is reported, not hidden", async () => {
  gemini("", 500);
  assert.equal((await ask({ question: "Where does he work?" })).status, 503);
});

test("each visitor is limited per hour", async () => {
  gemini("Nishith works at Amazon [F2].");
  const codes = [];
  for (let i = 0; i < 21; i++) codes.push((await ask({ question: "Where does he work?" }, { from: "10.9.9.9" })).status);
  assert.equal(codes.filter((c) => c === 200).length, 20);
  assert.equal(codes.at(-1), 429);
});
