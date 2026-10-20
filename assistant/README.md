# Portfolio assistant

Visitors ask about Nishith's work by text or voice; a Cloudflare Worker answers with Gemini from `kb.json` only,
citing the facts it used, and refuses anything the facts don't cover. The API key lives only in Cloudflare.

- `kb.json` — the facts, from the published résumé and this site. Edit it to change what the assistant knows.
- `worker.js` — the Worker: origin lock, question limits, per-visitor rate limit, grounded prompt, citation check.
- `worker.test.mjs` — `node --test assistant/worker.test.mjs` (Gemini is stubbed; no key needed).

## Deploy (once)

```bash
cd assistant
npx wrangler login                      # opens Cloudflare in the browser
npx wrangler deploy                     # prints the URL, e.g. https://nishith-assistant.<you>.workers.dev
npx wrangler secret put GEMINI_API_KEY  # paste the key at the prompt, not anywhere else
```

Then set `ASSIST_URL` in `index.html` to that URL. Until it's set, or whenever the Worker is unreachable or out of
quota, the panel falls back to showing the best-matching facts from `kb.json`.

Use a Gemini key from a separate Google project, so the public assistant can't use another project's quota.
