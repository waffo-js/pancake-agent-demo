import { STRIPE_CATALOG, type StripeSku, baseUrl, getStripe } from "@/lib/stripe";
import { fail, ok } from "@/lib/responses";

type Body = { sku: StripeSku };

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return fail(
      "Stripe is not configured. Copy .env.example → .env.local and add STRIPE_SECRET_KEY.",
      503,
      "stripe",
    );
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  const item = body?.sku ? STRIPE_CATALOG[body.sku] : null;
  if (!item) return fail(`Unknown sku. Valid: ${Object.keys(STRIPE_CATALOG).join(", ")}`, 400, "stripe");

  const priceId = process.env[item.priceEnvKey];
  if (!priceId) {
    return fail(`${item.priceEnvKey} is not set.`, 503, "stripe");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: item.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl()}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/pricing`,
    });
    return ok({ url: session.url, sessionId: session.id });
  } catch (e) {
    return fail(`Checkout session create failed: ${(e as Error).message}`, 502, "stripe");
  }
}
