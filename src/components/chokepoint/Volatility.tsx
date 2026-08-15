import type { Volatility as V } from "@/lib/chokepoint-types";

export function VolatilityBlock({ v }: { v: V }) {
  const vix = v.vix;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {vix && (vix.change_pct || vix.plain || typeof vix.before === "number") && (
        <div className="border border-hairline bg-panel p-4">
          <div className="text-[14px] font-semibold text-text-primary">
            How Nervous The Market Got
          </div>
          <div className="mono text-[10.5px] uppercase tracking-[0.16em] text-text-muted">
            VIX, the volatility index
          </div>
          <div
            className={`mono mt-2 text-[26px] font-semibold ${
              vix.spiked ? "text-red" : "text-teal"
            }`}
          >
            {vix.change_pct ?? "-"}
          </div>
          {vix.plain && (
            <p className="mt-1 text-[13px] text-text-primary">{vix.plain}</p>
          )}
          <div className="mono mt-3 grid grid-cols-3 gap-2 text-[11px] text-text-secondary">
            <div>
              <div className="text-text-muted uppercase tracking-[0.14em] text-[9.5px]">Before</div>
              <div className="text-text-primary">{vix.before ?? "-"}</div>
            </div>
            <div>
              <div className="text-text-muted uppercase tracking-[0.14em] text-[9.5px]">Peak</div>
              <div className="text-text-primary">{vix.peak ?? "-"}</div>
            </div>
            <div>
              <div className="text-text-muted uppercase tracking-[0.14em] text-[9.5px]">After</div>
              <div className="text-text-primary">{vix.after ?? "-"}</div>
            </div>
          </div>
        </div>
      )}
      {v.sectors && v.sectors.length > 0 && (
        <div className="border border-hairline bg-panel">
          <div className="border-b border-hairline p-3">
            <div className="text-[14px] font-semibold text-text-primary">
              How Much Choppier Each Sector Got
            </div>
            <div className="mono text-[10.5px] uppercase tracking-[0.16em] text-text-muted">
              Realised volatility, before vs after
            </div>
          </div>
          <ul className="divide-y divide-hairline">
            {v.sectors.map((s) => (
              <li
                key={s.sector}
                className={`flex items-center justify-between px-3 py-2 ${
                  s.more_volatile ? "" : "opacity-70"
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[14px] text-text-primary">{s.sector}</div>
                  <div className="mono text-[11px] text-text-muted">
                    {s.vol_before} → {s.vol_after}
                  </div>
                </div>
                <div
                  className={`mono shrink-0 pl-3 text-[14px] font-semibold ${
                    s.more_volatile ? "text-red" : "text-teal"
                  }`}
                >
                  {s.plain ?? (typeof s.ratio === "number" ? `${s.ratio.toFixed(2)}×` : "-")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}