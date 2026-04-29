# Pancake Agent Demo

A screen-recorded demo built for bank / senior-management audiences. Three messages about Pancake:

1. **Built for AI developers** — SDK + MCP + the official Claude skill at `docs.waffo.ai/integrate/skill` let developers' agents onboard merchants end-to-end.
2. **100% agentic integration** — zero manual setup; agents migrate merchants off Stripe autonomously.
3. **Billing models agents need** — one-time, subscription, usage-based (roadmap), and **result-based** (new).

## What's inside

| Piece | Path | Purpose |
|---|---|---|
| Landing page | `app/page.tsx` | Hero + combined reel + 3 per-message sections + billing table |
| Pricing demo | `app/pricing/page.tsx` | Live billing page — one-time & subscription hit **Stripe Checkout**, result-based hits the **mock Pancake API** |
| Kestrel mock | `app/kestrel/page.tsx` | Fictional research-as-a-service merchant |
| Mock result-contract API | `app/mock/result-contract/*` | In-memory stub of the future Pancake result-based endpoints |
| Stripe checkout API | `app/api/stripe/checkout/route.ts` | Creates real Checkout Sessions on your test keys |
| Remotion compositions | `remotion/scenes/*.tsx` | V1, V2, V3, and the combined 68-second reel |

## Prerequisites

- Node.js 20+ (24 LTS recommended)
- Stripe test API keys (for the `/pricing` demo) — get them at <https://dashboard.stripe.com/test/apikeys>

## First-time setup

```bash
cd pancake-agent-demo
npm install
cp .env.example .env.local       # then paste your Stripe test keys
```

## Run the site

```bash
npm run dev                      # http://localhost:4000
```

Pages:

- <http://localhost:4000> — landing with combined reel
- <http://localhost:4000/pricing> — the four billing models, live
- <http://localhost:4000/kestrel> — fictional merchant

## Render the videos

The scenes are **Remotion compositions** — React components rendered frame-by-frame to MP4. No screen capture, no flakiness.

```bash
# Live-preview the scenes in Remotion Studio (timeline scrubber + hot reload)
npm run studio

# Render all four compositions: v1, v2, v3, combined
npm run render

# Or render one at a time
npm run render:v1
npm run render:v2
npm run render:v3
npm run render:combined
```

Videos land in `videos/`. The landing page's `VideoEmbed` probes them via HEAD on load — once a file exists, it swaps from the "run `npm run render`" placeholder to the `<video>` element.

### Tweaking the scenes

Each scene has its dialogue as a `lines` array at the top of the file — frames are plain numbers at 30fps. Edit in place and re-render (or use `npm run studio` for instant preview).

- `remotion/scenes/V1Scene.tsx` — developer experience with the exact Waffo onboarding prompt
- `remotion/scenes/V2Scene.tsx` — Stripe → Pancake migration
- `remotion/scenes/V3Scene.tsx` — result-based billing between Ava and Kestrel
- `remotion/constants.ts` — global durations, dimensions, and palette

## /pricing — live Stripe checkout

The pricing page has four cards:

| Card | Action |
|---|---|
| Competitor snapshot ($29) | `POST /api/stripe/checkout { sku: "onetime" }` → Stripe Checkout (payment mode) |
| Weekly intel brief ($99/mo) | `POST /api/stripe/checkout { sku: "subscription" }` → Stripe Checkout (subscription mode) |
| Research API access ($0.001/token) | Disabled — marked "roadmap" |
| Bespoke deep-dive (pay on pass) | Runs the full `create-request → create-quote → accept-quote → submit-deliverable` flow against the local mock API, showing live progress |

Stripe test card: `4242 4242 4242 4242` · any future date · any CVC.

If `STRIPE_SECRET_KEY` is unset, the Stripe buttons return a 503 with a clear setup message (page still loads, result-based demo still works).

## Environment variables

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # currently unused but reserved
NEXT_PUBLIC_BASE_URL=http://localhost:4000       # optional — used for Stripe redirect URLs
```

## Scope deliberately cut (for v1)

- Voiceover / music — captions only, baked into the Remotion scenes
- Real Claude Code ↔ Pancake MCP integration — V1 is a scripted simulation that references the actual Waffo docs
- Real Stripe → Pancake migration — V2 fakes it
- Real LLM judge — `submit-deliverable` uses a deterministic rule-based judge
- Webhooks on Stripe side — `/pricing/success` is informational, not a signed webhook endpoint
- Mobile polish — target viewport is desktop (1280×800)
- Auth / persistent storage

See `../docs/superpowers/specs/2026-04-22-demo-concept-design.md` for the concept spec and `../docs/superpowers/specs/2026-04-22-result-based-billing-design.md` for the mechanism spec.

## Project layout

```
pancake-agent-demo/
├── app/
│   ├── page.tsx                     # landing
│   ├── kestrel/page.tsx             # merchant mock
│   ├── pricing/
│   │   ├── page.tsx                 # 4-card pricing demo
│   │   ├── success/page.tsx         # Stripe post-checkout
│   │   └── cancel/page.tsx
│   ├── api/stripe/checkout/route.ts # Stripe Checkout Session creator
│   └── mock/result-contract/        # mocked result-based billing endpoints
├── components/                      # Hero, Section, VideoEmbed, PricingCards, ReelSection, ...
├── lib/
│   ├── mockStore.ts                 # in-memory store for result-contract state
│   ├── responses.ts                 # Pancake { data, errors } envelope
│   └── stripe.ts                    # Stripe client + catalog
├── remotion/
│   ├── index.ts                     # Remotion entry
│   ├── Root.tsx                     # composition registrations
│   ├── constants.ts                 # durations, dimensions, colors
│   ├── components/                  # TopBar, Terminal, Caption
│   └── scenes/                      # V1Scene, V2Scene, V3Scene, Combined
├── videos/                          # output .mp4 (gitignored)
├── remotion.config.ts
├── tailwind.config.ts
└── package.json
```
