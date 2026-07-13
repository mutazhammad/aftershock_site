import type { ReactionRow } from "@/lib/chokepoint-types";
import { Link } from "@tanstack/react-router";

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
  // Derive significance from t_stat when present (|t| >= 2); fall back to explicit flag.
  const sig =
    typeof row.t_stat === "number" ? Math.abs(row.t_stat) >= 2 : row.significant;

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
        <div className="relative h-3 w-full border border-steel/60 bg-abyss">
          {/* center line */}
          <div className="absolute left-1/2 top-[-3px] h-[18px] w-px bg-signal/40" />
          {isGain ? (
            <div
              className={`absolute left-1/2 top-0 h-full ${barColor}`}
              style={{
                width: `${widthPct}%`,
                background: sig
                  ? "linear-gradient(to right, #2DD4A7, rgba(45,212,167,0.2))"
                  : "rgba(108,122,148,0.35)",
                boxShadow: sig ? "0 0 12px rgba(45,212,167,0.35)" : "none",
              }}
            />
          ) : (
            <div
              className={`absolute top-0 h-full ${barColor}`}
              style={{
                width: `${widthPct}%`,
                right: "50%",
                background: sig
                  ? "linear-gradient(to left, #FF6B4A, rgba(255,107,74,0.2))"
                  : "rgba(108,122,148,0.35)",
                boxShadow: sig ? "0 0 12px rgba(255,107,74,0.35)" : "none",
              }}
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
        <div className="flex flex-col items-end gap-0.5">
          {sig ? (
            <span className="mono border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-amber">
              significant
            </span>
          ) : (
            <Link
              to="/methodology"
              hash="significance"
              className="mono border border-hairline px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-text-muted underline decoration-signal/40 decoration-dotted underline-offset-2 hover:text-signal hover:decoration-signal"
              title="Why is this greyed out?"
            >
              not significant
            </Link>
          )}
          {typeof row.t_stat === "number" && (
            <span className="mono text-[9px] text-text-muted">
              t={row.t_stat.toFixed(2)}
              {row.provisional ? " · provisional" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}