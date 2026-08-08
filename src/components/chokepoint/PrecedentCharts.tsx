import type { PrecedentExpectation } from "@/lib/chokepoint-types";

function parsePct(v: any): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace("%", "").replace("+", ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────
// A. Diverging bar chart of sector averages
// ─────────────────────────────────────────────────────────────
export function PrecedentDivergingBars({ pe }: { pe: PrecedentExpectation }) {
  const rows = (pe.sector_averages ?? []).map((r) => ({
    ...r,
    v: typeof r.avg_value === "number" ? r.avg_value : parsePct(r.avg_move),
  }));
  if (!rows.length) return null;
  const max = Math.max(6, ...rows.map((r) => Math.abs(r.v)));
  return (
    <div className="border border-hairline bg-panel">
      <div className="grid grid-cols-12 gap-3 border-b border-hairline px-3 py-2">
        <div className="col-span-4 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
          Sector
        </div>
        <div className="col-span-6 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
          <div className="flex justify-between">
            <span>← loss</span>
            <span>0</span>
            <span>gain →</span>
          </div>
        </div>
        <div className="col-span-2 mono text-right text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
          Avg Move
        </div>
      </div>
      {rows.map((r) => {
        const pos = r.v >= 0;
        const width = (Math.abs(r.v) / max) * 50;
        const sig = (r.n_significant ?? 0) > 0;
        const sigOnly = r.avg_move_significant_only;
        return (
          <div
            key={r.sector}
            className={`grid grid-cols-12 items-center gap-3 border-b border-hairline/70 px-3 py-2.5 last:border-b-0 ${
              sig ? "" : "py-1.5 opacity-55"
            }`}
          >
            <div
              className={`col-span-4 ${
                sig ? "text-[12.5px] text-text-primary" : "text-[11px] text-ash"
              }`}
            >
              {r.sector}
            </div>
            <div
              className={`col-span-6 relative border border-steel/60 bg-abyss ${
                sig ? "h-3" : "h-2"
              }`}
            >
              <div className="absolute left-1/2 top-[-3px] h-[18px] w-px bg-signal/40" />
              <div
                className="absolute top-0 h-full"
                style={
                  {
                    width: `${width}%`,
                    [pos ? "left" : "right"]: "50%",
                    background: sig
                      ? pos
                        ? "linear-gradient(to right, #2DD4A7, rgba(45,212,167,0.15))"
                        : "linear-gradient(to left, #FF6B4A, rgba(255,107,74,0.15))"
                      : "rgba(108,122,148,0.35)",
                    boxShadow: sig
                      ? `0 0 12px ${
                          pos ? "rgba(45,212,167,0.35)" : "rgba(255,107,74,0.35)"
                        }`
                      : "none",
                  } as React.CSSProperties
                }
              />
            </div>
            <div
              className={`col-span-2 mono text-right text-[12px] ${
                sig ? (pos ? "text-verdigris" : "text-ember") : "text-[10.5px] text-ash"
              }`}
            >
              <div>Average: {r.avg_move}</div>
              {sigOnly != null && sigOnly !== "" && (
                <div className="text-[10.5px] text-signal">
                  Among significant results: {sigOnly}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// B. Dot plot: one dot per precedent per sector, plus average tick
// ─────────────────────────────────────────────────────────────
export function PrecedentDotPlot({ pe }: { pe: PrecedentExpectation }) {
  const per = pe.per_precedent ?? [];
  const sectors = pe.sector_averages ?? [];
  if (!per.length || !sectors.length) return null;

  const bySector = new Map<
    string,
    { name: string; date?: string; v: number; t?: number; sig: boolean }[]
  >();
  for (const s of sectors) bySector.set(s.sector, []);
  for (const p of per) {
    for (const m of p.sector_moves ?? []) {
      const arr = bySector.get(m.sector);
      if (!arr) continue;
      const v = typeof m.value === "number" ? m.value : parsePct(m.move);
      const sig =
        typeof m.significant === "boolean"
          ? m.significant
          : typeof m.t_stat === "number"
          ? Math.abs(m.t_stat) >= 2
          : false;
      arr.push({ name: p.name, date: p.date, v, t: m.t_stat, sig });
    }
  }

  const allV = [...bySector.values()].flat().map((d) => d.v);
  const avgs = sectors.map((s) =>
    typeof s.avg_value === "number" ? s.avg_value : parsePct(s.avg_move),
  );
  const max = Math.max(6, ...allV.map((v) => Math.abs(v)), ...avgs.map((v) => Math.abs(v)));

  return (
    <div className="border border-hairline bg-panel p-3">
      <div className="grid grid-cols-12 items-center gap-3 border-b border-hairline pb-2 mb-2">
        <div className="col-span-3 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
          Sector
        </div>
        <div className="col-span-7 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
          <div className="flex justify-between">
            <span>← loss</span>
            <span>0</span>
            <span>gain →</span>
          </div>
        </div>
        <div className="col-span-2 mono text-right text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
          Average
        </div>
      </div>
      {sectors.map((s) => {
        const dots = bySector.get(s.sector) ?? [];
        const avgV =
          typeof s.avg_value === "number" ? s.avg_value : parsePct(s.avg_move);
        return (
          <div
            key={s.sector}
            className="grid grid-cols-12 items-center gap-3 border-b border-hairline/60 py-2 last:border-b-0"
          >
            <div className="col-span-3 text-[12.5px] text-text-primary">
              {s.sector}
            </div>
            <div className="col-span-7 relative h-7">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-steel/60" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-signal/40" />
              <div
                className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-signal"
                style={{ left: `${50 + (avgV / max) * 50}%` }}
                title={`Average ${s.avg_move}`}
              />
              {dots.map((d, i) => {
                const left = 50 + (d.v / max) * 50;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%` }}
                    title={`${d.name}${d.date ? ` · ${d.date}` : ""} · ${
                      d.v > 0 ? "+" : ""
                    }${d.v.toFixed(1)}%${
                      typeof d.t === "number" ? ` · t=${d.t.toFixed(2)}` : ""
                    }`}
                  >
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        d.sig
                          ? "bg-signal"
                          : "border border-ash bg-transparent"
                      }`}
                      style={
                        d.sig
                          ? { boxShadow: "0 0 8px rgba(63,169,245,0.6)" }
                          : undefined
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="col-span-2 mono text-right text-[11.5px] text-text-secondary">
              {s.avg_move}
            </div>
          </div>
        );
      })}
      <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-hairline pt-2 mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" style={{ boxShadow: "0 0 8px rgba(63,169,245,0.6)" }} />
          Significant
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-ash bg-transparent" />
          Not Significant
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-0.5 bg-signal" />
          Average
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// C. VIX response across precedents
// ─────────────────────────────────────────────────────────────
export function PrecedentVixStrip({ pe }: { pe: PrecedentExpectation }) {
  const per = pe.per_precedent ?? [];
  const items = per
    .filter((p) => p.vix_change != null)
    .map((p) => ({ name: p.name, v: parsePct(p.vix_change) }));
  if (!items.length) return null;
  const max = Math.max(20, ...items.map((i) => Math.abs(i.v)));
  const avg = items.reduce((s, i) => s + i.v, 0) / items.length;
  return (
    <div className="border border-hairline bg-panel p-3">
      {items.map((it, idx) => {
        const pos = it.v >= 0;
        const width = (Math.abs(it.v) / max) * 50;
        return (
          <div
            key={idx}
            className="grid grid-cols-12 items-center gap-3 py-1.5"
          >
            <div className="col-span-4 truncate text-[12px] text-text-secondary">
              {it.name}
            </div>
            <div className="col-span-6 relative h-2.5 border border-steel/60 bg-abyss">
              <div className="absolute left-1/2 top-0 h-full w-px bg-signal/40" />
              <div
                className="absolute top-0 h-full"
                style={
                  {
                    width: `${width}%`,
                    [pos ? "left" : "right"]: "50%",
                    background: pos ? "#FF6B4A" : "#2DD4A7",
                  } as React.CSSProperties
                }
              />
            </div>
            <div className="col-span-2 mono text-right text-[11.5px] text-text-primary">
              {it.v > 0 ? "+" : ""}
              {it.v.toFixed(1)}%
            </div>
          </div>
        );
      })}
      <div className="mt-2 border-t border-hairline pt-2 mono text-[10.5px] uppercase tracking-[0.14em] text-signal">
        Average · {avg > 0 ? "+" : ""}
        {avg.toFixed(1)}%
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// D. Volatility ratios as a lollipop chart
// ─────────────────────────────────────────────────────────────
export function PrecedentVolatilityLollipop({
  pe,
}: {
  pe: PrecedentExpectation;
}) {
  const per = pe.per_precedent ?? [];
  const items = per
    .filter((p) => p.volatility_ratio != null)
    .map((p) => ({
      name: p.name,
      r:
        typeof p.volatility_ratio === "number"
          ? p.volatility_ratio
          : parseFloat(String(p.volatility_ratio)),
    }))
    .filter((p) => !isNaN(p.r));
  const avg =
    typeof pe.avg_volatility_ratio === "number"
      ? pe.avg_volatility_ratio
      : items.length
      ? items.reduce((s, i) => s + i.r, 0) / items.length
      : null;
  if (!items.length && avg == null) return null;
  const max = Math.max(2, ...items.map((i) => i.r));
  const baselinePct = (1 / max) * 100;
  return (
    <div className="border border-hairline bg-panel p-3">
      {items.map((it, idx) => {
        const pct = (it.r / max) * 100;
        const above = it.r >= 1;
        return (
          <div key={idx} className="grid grid-cols-12 items-center gap-3 py-1.5">
            <div className="col-span-4 truncate text-[12px] text-text-secondary">
              {it.name}
            </div>
            <div className="col-span-6 relative h-3">
              <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-steel/50" />
              <div
                className="absolute top-0 h-full w-px bg-signal/50"
                style={{ left: `${baselinePct}%` }}
              />
              <div
                className="absolute top-1/2 h-px -translate-y-1/2"
                style={{
                  left: `${Math.min(baselinePct, pct)}%`,
                  width: `${Math.abs(pct - baselinePct)}%`,
                  background: above ? "#FF6B4A" : "#2DD4A7",
                }}
              />
              <div
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${pct}%`,
                  background: above ? "#FF6B4A" : "#2DD4A7",
                  boxShadow: above
                    ? "0 0 8px rgba(255,107,74,0.5)"
                    : "0 0 8px rgba(45,212,167,0.5)",
                }}
              />
            </div>
            <div className="col-span-2 mono text-right text-[11.5px] text-text-primary">
              {it.r.toFixed(2)}×
            </div>
          </div>
        );
      })}
      {avg != null && (
        <div className="mt-2 border-t border-hairline pt-2 mono text-[10.5px] uppercase tracking-[0.14em] text-signal">
          Average ·{" "}
          {typeof avg === "number" ? avg.toFixed(2) : avg}× · Baseline 1.00× means
          no change in volatility
        </div>
      )}
    </div>
  );
}