import { getStore, now, shortId } from "@/lib/mockStore";
import { fail, ok } from "@/lib/responses";

type Body = {
  buyerApiKeyId: string;
  topic: string;
  rubric: string;
  budgetMax: { amount: string; currency: string };
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || !body.buyerApiKeyId || !body.topic || !body.rubric || !body.budgetMax) {
    return fail("Missing one of: buyerApiKeyId, topic, rubric, budgetMax", 400);
  }

  const id = shortId("REQ");
  const request = {
    id,
    buyerApiKeyId: body.buyerApiKeyId,
    topic: body.topic,
    rubric: body.rubric,
    budgetMax: body.budgetMax,
    createdAt: now(),
    quoteIds: [],
  };
  getStore().requests.set(id, request);
  return ok({ request });
}
