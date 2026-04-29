import { getStore, now, plus, shortId } from "@/lib/mockStore";
import { fail, ok } from "@/lib/responses";

type Body = { quoteId: string };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.quoteId) return fail("Missing quoteId", 400);

  const store = getStore();
  const quote = store.quotes.get(body.quoteId);
  if (!quote) return fail(`Unknown quoteId: ${body.quoteId}`, 404);
  if (quote.acceptedAs) return fail("Quote already accepted", 409);

  const request = store.requests.get(quote.requestId);
  if (!request) return fail("Orphaned quote — request missing", 500);

  const id = shortId("RCT");
  const contract = {
    id,
    buyerApiKeyId: request.buyerApiKeyId,
    sellerApiKeyId: quote.sellerApiKeyId,
    rubric: request.rubric,
    judgeModel: quote.judgeModel,
    price: quote.price,
    status: "accepted" as const,
    verdict: null,
    verdictNotes: null,
    deliverableUrl: null,
    createdAt: now(),
    updatedAt: now(),
    expiresAt: plus(quote.etaSeconds + 300),
  };
  store.contracts.set(id, contract);
  quote.acceptedAs = id;
  return ok({ contract });
}
