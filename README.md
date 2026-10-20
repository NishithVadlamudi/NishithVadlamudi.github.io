# nishithvadlamudi.github.io

Personal portfolio of Nishith Vadlamudi, software engineer at Amazon working on distributed systems and cloud
infrastructure. Live at **https://nishithvadlamudi.github.io**.

- **Hero:** a painted/photographed split portrait, explorer on one side and engineer on the other. Move the pointer
  or the slider to shift the seam; the light behind each side follows it.
- **Work:** projects told as before and after, with the numbers from the résumé. vidcite leads with its launch video
  and opens to a 1-minute walkthrough.
- **Ask about my work:** an assistant that answers questions about the portfolio, by text or voice (below).

## Ask about my work

Visitors can ask things like "What did he do at Amazon?" or "Tell me about vidcite", by typing or speaking, and get
a short answer written by Gemini. Every claim cites the fact it came from, and each citation chip opens that
project or scrolls to that section of the page.

- **Grounded:** answers come only from [`assistant/kb.json`](assistant/kb.json), 27 facts taken from the published
  résumé and this site. Questions the facts don't cover, such as salary, are refused rather than guessed. An answer
  that cites nothing it was given counts as not covered, and invented citations are removed.
- **Key kept off the page:** a Cloudflare Worker ([`assistant/worker.js`](assistant/worker.js)) holds the Gemini
  key. It only accepts requests from this site, caps questions at 300 characters and each visitor at 20 an hour,
  and treats the visitor's question as untrusted input.
- **Never fails silently:** if the Worker is unreachable or out of quota, the panel shows the best-matching facts
  from `kb.json` instead.
- **Voice:** the browser's own speech recognition (Chrome, Edge, Safari) takes the question, and spoken questions
  get the answer read aloud.
- **Tested:** `node --test assistant/worker.test.mjs` covers the origin lock, input limits, rate limit, citation
  filtering, refusals and upstream failures, with Gemini stubbed so no key is needed.

Deploying the Worker and updating its facts: [`assistant/README.md`](assistant/README.md). After editing
`kb.json`, push and also redeploy the Worker, which carries its own copy of the facts.

## Stack

One hand-written `index.html` with no framework, build step or tracking, served by GitHub Pages. SF Pro on Apple
devices, Inter elsewhere. The assistant runs on Cloudflare Workers with Gemini 3.5 Flash-Lite.
