import type { CompanyInvolved } from "@/lib/chokepoint-types";

export function CompaniesInvolvedBlock({ items }: { items: CompanyInvolved[] }) {
  return (
    <div className="grid gap-2">
      {items.map((c, i) => {
        const border =
          c.exposure === "direct"
            ? "border-l-signal"
            : c.exposure === "beneficiary"
            ? "border-l-verdigris"
            : "border-l-ash";
        return (
          <div
            key={`${c.ticker}-${i}`}
            className={`border-l-2 ${border} bg-panel/60 px-3 py-3`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="mono text-[15px] font-semibold text-bone">
                {c.ticker}
              </span>
              {c.exposure === "beneficiary" ? (
                <span className="mono shrink-0 border border-verdigris/40 bg-verdigris/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-verdigris">
                  Benefits
                </span>
              ) : (
                <span className="mono shrink-0 text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  {c.exposure}
                </span>
              )}
            </div>
            <div className="mt-1 text-[14px] text-text-primary">{c.name}</div>
            <p className="measure mt-2 text-[14px] leading-relaxed text-text-secondary">
              {c.role}
            </p>
          </div>
        );
      })}
    </div>
  );
}