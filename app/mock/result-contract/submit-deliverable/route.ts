import { getStore, now } from "@/lib/mockStore";
import { fail, ok } from "@/lib/responses";

type Body = {
  contractId: string;
  deliverableText: string;   // demo: text body; real product would host a file
};

// Scripted judge — deterministic PASS for the demo's happy path.
// A real judge would call judgeModel with (deliverable, rubric) and parse a verdict.
function runJudge(rubric: string, text: string): { verdict: "pass" | "fail"; notes: string } {
  const meetsLength = text.length >= 80;
  const mentionsRubricKeyword =
    rubric.length === 0 ||
    rubric
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((w) => w.length > 4)
      .some((w) => text.toLowerCase().includes(w));
  if (meetsLength && mentionsRubricKeyword) {
    return {
      verdict: "pass",
      notes: "Deliverable satisfies the pre-agreed rubric: covers requested scope, adequate depth.",
    };
  }
  return {
    verdict: "fail",
    notes: "Deliverable does not meet the pre-agreed rubric (insufficient depth or coverage).",
  };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.contractId || !body?.deliverableText) {
    return fail("Missing contractId or deliverableText", 400);
  }
  const store = getStore();
  const contract = store.contracts.get(body.contractId);
  if (!contract) return fail(`Unknown contractId: ${body.contractId}`, 404);
  if (contract.status !== "accepted") {
    return fail(`Contract is ${contract.status}; expected 'accepted'`, 409);
  }

  // DELIVER → JUDGE → SETTLE in one call for demo clarity
  contract.status = "delivered";
  contract.deliverableUrl = `/mock/deliverables/${contract.id}`;
  contract.updatedAt = now();

  const { verdict, notes } = runJudge(contract.rubric, body.deliverableText);
  contract.status = "judged";
  contract.verdict = verdict;
  contract.verdictNotes = notes;
  contract.updatedAt = now();

  contract.status = verdict === "pass" ? "settled" : "refunded";
  contract.updatedAt = now();

  return ok({ contract });
}
