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
            className={`border border-hairline border-l-2 ${border} bg-panel p-3`}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="mono text-[14px] font-semibold text-bone">
                {c.ticker}
              </span>
              <span className="text-[13px] text-text-primary">{c.name}</span>
              {c.exposure === "beneficiary" && (
                <span className="mono border border-verdigris/40 bg-verdigris/10 px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-verdigris">
                  Benefits
                </span>
              )}
              <span className="mono ml-auto text-[10px] uppercase tracking-[0.14em] text-text-muted">
                {c.exposure}
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-text-secondary">
              {c.role}
            </p>
          </div>
        );
      })}
    </div>
  );
}