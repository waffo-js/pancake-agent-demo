// Server-only Stripe client. Imported by /api/stripe/* routes; never
// imported from a client component.
//
// Returns null when STRIPE_SECRET_KEY is unset so the pricing page can
// degrade gracefully on a fresh checkout without keys.

import Stripe from "stripe";

let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    cached = null;
    return cached;
  }
  cached = new Stripe(secretKey);
  return cached;
}

export function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:4000")
  );
}

// Catalog keyed to the two live SKUs on /pricing.
// Price IDs are pre-created in the Stripe dashboard and set via env vars.
export const STRIPE_CATALOG = {
  onetime: {
    kind: "onetime" as const,
    name: "Competitor snapshot",
    mode: "payment" as const,
    priceEnvKey: "STRIPE_PRICE_ONETIME",
  },
  subscription: {
    kind: "subscription" as const,
    name: "Weekly intel brief",
    mode: "subscription" as const,
    priceEnvKey: "STRIPE_PRICE_SUBSCRIPTION",
  },
} as const;

export type StripeSku = keyof typeof STRIPE_CATALOG;
