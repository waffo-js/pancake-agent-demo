import Link from "next/link";

export default function CancelPage() {
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-pancake-border text-2xl text-pancake-text-muted">
          ×
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Checkout canceled.</h1>
        <p className="mt-3 text-pancake-text-muted">
          No charge was made. In a real integration, the order stays in <code className="font-mono text-pancake-primary">pending</code> until either completed or expired.
        </p>
        <div className="mt-10">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md bg-pancake-primary px-5 py-3 text-sm font-medium text-black hover:bg-pancake-primary-hover"
          >
            ← back to pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
