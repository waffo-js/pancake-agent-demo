# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js on http://localhost:4000
npm run build        # production build
npm run lint         # ESLint

npm run studio       # Remotion Studio — live preview with timeline scrubber
npm run render       # render all compositions to videos/
npm run render:v1    # render a single composition (v1, v2, checkout, result, summary, combined, pancake-demo)

npm run record:checkout  # Playwright → Stripe checkout → ffmpeg → public/videos/checkout.mp4
                         # requires: npm run dev running, STRIPE_SECRET_KEY set, ffmpeg on PATH
```

There is no test suite — `tsc --noEmit` is the correctness check.

## Architecture

This repo is two things sharing one codebase: a **Next.js demo website** (the `/` and `/pricing` routes) and a **Remotion video pipeline** (the `remotion/` tree) that renders the scenes embedded on the landing page.

### Next.js site

`app/page.tsx` is a static marketing page. `VideoEmbed` probes each video file via `HEAD` on mount — if the file exists, it renders a `<video>` tag; otherwise it shows a "run `npm run render`" placeholder. This means you can develop the site before any videos are rendered.

`/pricing` has four cards. Two hit **Stripe Checkout** via `POST /api/stripe/checkout`. One is a disabled roadmap card. One runs the **result-contract mock** entirely in the browser — no server round-trip except to the local mock API routes under `app/mock/result-contract/`.

The mock API (`app/mock/result-contract/`) is a four-endpoint stub of a future Pancake feature. It stores state in a module-singleton (`lib/mockStore.ts`) attached to `globalThis` so it survives Next.js hot reload in dev.

**API response shape** (used by both Stripe routes and mock routes, enforced by `lib/responses.ts`):
```
Success: { data: {...} }
Error:   { data: null, errors: [{ message, layer }] }
```

### Stripe integration

`lib/stripe.ts` holds the singleton client, the two-SKU catalog (`onetime` → `mode: "payment"`, `subscription` → `mode: "subscription"`), and `baseUrl()`. Price IDs come from `STRIPE_PRICE_ONETIME` / `STRIPE_PRICE_SUBSCRIPTION` env vars — pre-create them in the Stripe dashboard. The client returns `null` when `STRIPE_SECRET_KEY` is unset; routes return 503 with a setup message, leaving the rest of the page functional.

### Remotion video pipeline

`remotion/constants.ts` is the single source of truth for all scene durations (in seconds, converted to frames by `× FPS`). Every scene reads from it, and the `Combined` composition offsets each scene by cumulating the preceding durations. **Change a scene's length here, not in the composition file.**

Each scene file (`remotion/scenes/V1Scene.tsx`, etc.) has its dialogue as a `lines` array at the top — frames are plain numbers at 30fps. `remotion/components/` holds reusable Chrome, terminal, and caption primitives.

`scripts/record-checkout.mjs` is a Playwright script that navigates the real Stripe checkout flow, records it as webm, and transcodes to mp4 via ffmpeg. The output lands in `public/videos/checkout.mp4` for use as a `staticFile` in `CheckoutScene.tsx`.

### Design tokens

Tailwind custom colours live in `tailwind.config.ts` under the `pancake.*` namespace (e.g. `bg-pancake-primary`, `text-pancake-text-muted`). The Remotion scenes use the same palette mirrored in `remotion/constants.ts → COLORS`. Keep them in sync if the brand colours change.

## Environment

```bash
cp .env.example .env.local
# Fill in STRIPE_SECRET_KEY, STRIPE_PRICE_ONETIME, STRIPE_PRICE_SUBSCRIPTION
```

`NEXT_PUBLIC_BASE_URL` defaults to `http://localhost:4000` in dev; set it on Vercel to the deployment URL for correct Stripe redirect URLs.
