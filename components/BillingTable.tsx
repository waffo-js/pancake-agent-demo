type Row = {
  model: string;
  desc: string;
  status: "live" | "roadmap" | "new";
  example: string;
};

const rows: Row[] = [
  {
    model: "One-time",
    desc: "Single charge for a single delivery.",
    status: "live",
    example: '"Competitor snapshot report — $29"',
  },
  {
    model: "Subscription",
    desc: "Recurring charge, fixed cadence.",
    status: "live",
    example: '"Weekly intel brief — $99/mo"',
  },
  {
    model: "Usage-based",
    desc: "Metered by consumption (tokens, API calls, compute).",
    status: "roadmap",
    example: '"$0.001 per token processed"',
  },
  {
    model: "Result-based",
    desc: "Paid only when a pre-agreed rubric passes.",
    status: "new",
    example: '"Bespoke deep-dive — pay on rubric pass"',
  },
];

const statusStyle: Record<Row["status"], string> = {
  live: "border-pancake-primary/40 bg-pancake-primary/10 text-pancake-primary",
  roadmap: "border-pancake-border bg-pancake-card text-pancake-text-muted",
  new: "border-pancake-primary bg-pancake-primary text-black",
};

const statusLabel: Record<Row["status"], string> = {
  live: "Live today",
  roadmap: "On roadmap",
  new: "New — demoed below",
};

export function BillingTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-pancake-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-pancake-card/60 text-xs font-mono uppercase tracking-wider text-pancake-text-muted">
          <tr>
            <th className="px-4 py-3 font-normal">Billing model</th>
            <th className="px-4 py-3 font-normal">What it is</th>
            <th className="px-4 py-3 font-normal">Example (Kestrel Research)</th>
            <th className="px-4 py-3 font-normal text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.model} className="border-t border-pancake-border">
              <td className="px-4 py-4 font-medium text-pancake-text">{r.model}</td>
              <td className="px-4 py-4 text-pancake-text-muted">{r.desc}</td>
              <td className="px-4 py-4 font-mono text-xs text-pancake-text-muted">{r.example}</td>
              <td className="px-4 py-4 text-right">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[r.status]}`}>
                  {statusLabel[r.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
