import { getStore } from "@/lib/mockStore";
import { fail, ok } from "@/lib/responses";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const contract = getStore().contracts.get(id);
  if (!contract) return fail(`Unknown contractId: ${id}`, 404);
  return ok({ contract });
}
