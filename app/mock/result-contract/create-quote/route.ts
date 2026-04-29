import { getStore, now, shortId } from "@/lib/mockStore";
import { fail, ok } from "@/lib/responses";

type Body = {
  requestId: string;
  sellerApiKeyId: string;
  price: { amount: string; currency: string };
  judgeModel: string;
  etaSeconds: number;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.requestId || !body?.sellerApiKeyId || !body?.price || !body?.judgeModel) {
    return fail("Missing one of: requestId, sellerApiKeyId, price, judgeModel, etaSeconds", 400);
  }
  const store = getStore();
  const request = store.requests.get(body.requestId);
  if (!request) return fail(`Unknown requestId: ${body.requestId}`, 404);

  const id = shortId("QUO");
  const quote = {
    id,
    requestId: body.requestId,
    sellerApiKeyId: body.sellerApiKeyId,
    price: body.price,
    judgeModel: body.judgeModel,
    etaSeconds: body.etaSeconds,
    createdAt: now(),
    acceptedAs: null,
  };
  store.quotes.set(id, quote);
  request.quoteIds.push(id);
  return ok({ quote });
}
