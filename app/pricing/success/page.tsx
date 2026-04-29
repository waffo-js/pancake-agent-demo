import Link from "next/link";

type SearchParams = { session_id?: string };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { session_id } = await searchParams;
  return (
    <main className="min-h-screen">
      <header className="border-b border-pancake-border">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link href="/pricing" className="font-mono text-xs text-pancake-text-dim hover:text-pancake-primary">
            ← back to pricing
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-2xl px-6 pt-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pancake-primary text-2xl font-bold text-black">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Payment confirmed.
        </h1>
        <p className="mt-3 text-pancake-text-muted">
          Stripe Checkout redirected here. Your webhook endpoint at <code className="font-mono text-pancake-primary">/api/stripe/webhook</code> just received a <code className="font-mono text-pancake-primary">checkout.session.completed</code> event.
        </p>
        {session_id && (
          <div className="mx-auto mt-8 max-w-md rounded-lg border border-pancake-border bg-pancake-card p-4 text-left font-mono text-xs">
            <div className="text-pancake-text-dim">stripe session</div>
            <div className="mt-1 break-all text-pancake-text">{session_id}</div>
          </div>
        )}
        <div className="mt-10">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md border border-pancake-border px-5 py-3 text-sm font-medium hover:border-pancake-primary hover:text-pancake-primary"
          >
            ← try another SKU
          </Link>
        </div>
      </section>
    </main>
  );
}
