import type { ReactionRow } from "@/lib/chokepoint-types";

function parsePct(p: string): number {
  const n = parseFloat(p.replace("%", "").replace("+", ""));
  return isNaN(n) ? 0 : n;
}

const MAX = 12; // %, full-scale on each side

export function ReactionBar({ row }: { row: ReactionRow }) {
  const pctNum = parsePct(row.pct);
  const abs = Math.min(Math.abs(pctNum), MAX);
  const widthPct = (abs / MAX) * 50; // each side is 50% of the bar width
  const isGain = row.tone === "gain";
  const sig = row.significant;

  const barColor = isGain
    ? sig
      ? "bg-teal"
      : "bg-teal/25"
    : sig
    ? "bg-red"
    : "bg-red/25";

  return (
    <div
      className={`grid grid-cols-12 items-center gap-3 border-b border-hairline/70 px-3 py-3 ${
        sig ? "" : "opacity-70"
      }`}
    >
      {/* Sector + tickers */}
      <div className="col-span-12 md:col-span-4">
        <div className={`text-[13px] ${sig ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
          {row.sector}
        </div>
        <div className="mono text-[10.5px] text-text-muted">{row.tickers}</div>
      </div>

      {/* Bar */}
      <div className="col-span-8 md:col-span-5">
        <div className="relative h-2.5 w-full bg-panel">
          {/* center line */}
          <div className="absolute left-1/2 top-[-3px] h-[14px] w-px bg-hairline" />
          {isGain ? (
            <div
              className={`absolute left-1/2 top-0 h-full ${barColor}`}
              style={{ width: `${widthPct}%` }}
            />
          ) : (
            <div
              className={`absolute top-0 h-full ${barColor}`}
              style={{ width: `${widthPct}%`, right: "50%" }}
            />
          )}
        </div>
      </div>

      {/* Pct + tag */}
      <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-2">
        <span
          className={`mono text-[13px] ${
            isGain ? (sig ? "text-teal" : "text-teal/70") : sig ? "text-red" : "text-red/70"
          } ${sig ? "font-semibold" : ""}`}
        >
          {row.pct}
        </span>
        {sig ? (
          <span className="mono border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-amber">
            significant
          </span>
        ) : (
          <span className="mono border border-hairline px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-text-muted">
            not significant
          </span>
        )}
      </div>
    </div>
  );
}