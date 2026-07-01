import type { CompanyAffected } from "@/lib/chokepoint-types";

export function CompanyCards({ items }: { items: CompanyAffected[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((c) => {
        const gain = c.tone === "gain";
        return (
          <div
            key={c.ticker}
            className={`border bg-panel p-3 ${gain ? "border-teal/30" : "border-red/30"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="mono text-[13px] font-semibold text-text-primary">{c.ticker}</div>
                {c.name && (
                  <div className="text-[12.5px] text-text-secondary truncate">{c.name}</div>
                )}
                {c.sector && (
                  <div className="mono mt-0.5 text-[10px] uppercase tracking-[0.14em] text-text-muted">
                    {c.sector}
                  </div>
                )}
              </div>
              {c.move_pct && (
                <div className={`mono text-[14px] font-semibold ${gain ? "text-teal" : "text-red"}`}>
                  {gain ? "▲" : "▼"} {c.move_pct}
                </div>
              )}
            </div>
            {c.role && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-text-secondary">{c.role}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}