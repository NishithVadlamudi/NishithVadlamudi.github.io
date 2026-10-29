# nishithvadlamudi.github.io

Personal portfolio of Nishith Vadlamudi, software engineer at Amazon working on distributed systems and cloud
infrastructure. Live at **https://nishithvadlamudi.github.io**.

- **Apple-style design:** Apple's palette and SF Pro type, a dark frosted global nav, sections that alternate
  surface colour instead of using rules, borderless rounded cards and pill buttons.
- **Light, dark or automatic:** a toggle in the nav cycles Auto → Light → Dark and remembers the choice; Auto follows
  the system setting. The theme is applied before first paint, so there's no flash.
- **Hero:** a painted/photographed split portrait, explorer on one side and engineer on the other, with the name in a
  titanium gradient behind it. Move the pointer or the slider to shift the seam; the warm and cool light behind each
  side follows it.
- **Expertise:** three capability cards and five skill rows, each skill a chip with its technology's logo
  ([Devicon](https://devicon.dev), MIT; dark-lettered logos are inverted in dark mode).
- **Work:** vidcite as a full-width feature tile with its launch video, above an even grid of nine projects. Each card
  leads with one number from the résumé (4.7× peak, 1,000+ shipments a week, 99.97% cache hits...) and opens to the
  full before and after; vidcite's opens to its 1-minute walkthrough.
- **Ask about my work:** an assistant that answers questions about the portfolio, by text or voice, with a Siri-style
  look (below).

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
- **Siri-style feedback:** a glass orb whose soft petals turn in two counter-rotating layers (SVG, screen-blended)
  sits in the nav pill, the floating button and the panel. While the assistant listens, thinks or speaks, the panel
  fills with slowly turning Siri colours behind a rainbow border, and for voice the screen edge glows. The petals
  speed up while it works, and everything holds still for visitors who prefer reduced motion.
- **Out of the way:** the floating button appears only after the hero scrolls away; "Ask about me" in the nav opens
  the panel from anywhere.
- **Tested:** `node --test assistant/worker.test.mjs` covers the origin lock, input limits, rate limit, citation
  filtering, refusals and upstream failures, with Gemini stubbed so no key is needed.

Deploying the Worker and updating its facts: [`assistant/README.md`](assistant/README.md). After editing
`kb.json`, push and also redeploy the Worker, which carries its own copy of the facts.

## Stack

One hand-written `index.html` with no framework, build step or tracking, served by GitHub Pages. SF Pro on Apple
devices, Inter elsewhere; technology logos from Devicon via jsDelivr. The assistant runs on Cloudflare Workers with
Gemini 3.5 Flash-Lite. Respects reduced motion, reduced transparency and increased contrast settings.
