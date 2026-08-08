import type { EventRecord } from "@/lib/chokepoint-types";

function num(v: any): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace("%", "").replace("+", ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Briefing line at the top of a report. One sentence, readable in five seconds,
 * plus a compact ticker line. Never repeated elsewhere on the page.
 */
export function KeyTakeaway({ e }: { e: EventRecord }) {
  let lead = "";
  let tickerLine = "";

  if (e.recency === "breaking") {
    const rows = e.precedent_expectation?.sector_averages ?? [];
    if (!rows.length) {
      lead =
        "No validated historical precedent exists for this event yet. See below for what the system found and why it did not meet the validation bar.";
    } else {
      const top = [...rows].sort(
        (a, b) =>
          Math.abs(typeof b.avg_value === "number" ? b.avg_value : num(b.avg_move)) -
          Math.abs(typeof a.avg_value === "number" ? a.avg_value : num(a.avg_move)),
      )[0];
      const nSig = top.n_significant ?? 0;
      if (nSig === 0) {
        lead = `Historically, events like this have shown a directional move in ${top.sector} (${top.avg_move} average), though the pattern has not been statistically reliable across the precedents measured.`;
      } else {
        lead = `Historically, events like this have most affected ${top.sector}, moving ${top.avg_move} on average across ${plural(
          top.n_events ?? 0,
          "precedent",
        )}, ${nSig} of which ${nSig === 1 ? "was" : "were"} statistically significant.`;
      }
    }
    const direct = (e.companies_involved ?? []).filter((c) => c.exposure === "direct");
    if (direct.length) {
      tickerLine = `${direct.map((c) => c.ticker).join(", ")} (direct exposure)`;
    }
  } else {
    const rows = e.reaction ?? [];
    if (!rows.length) return null;
    const top = [...rows].sort((a, b) => Math.abs(num(b.pct)) - Math.abs(num(a.pct)))[0];
    const sig =
      typeof top.t_stat === "number" ? Math.abs(top.t_stat) >= 2 : !!top.significant;
    lead = sig
      ? `${top.sector} moved ${top.pct}, a statistically significant reaction beyond the overall market.`
      : `${top.sector} moved ${top.pct}, the largest reaction measured, though not statistically significant, meaning it may reflect normal market noise rather than the event itself.`;
    if (e.recency === "developing") {
      lead +=
        " This is a provisional result; the full measurement window is not yet complete.";
    }
    const inSector = (e.companies_affected ?? []).filter(
      (c) => (c.sector ?? "").toLowerCase() === top.sector.toLowerCase(),
    );
    const pool = inSector.length ? inSector : [];
    if (pool.length) {
      const dir = num(top.pct) >= 0 ? "up" : "down";
      tickerLine = `${pool.map((c) => c.ticker).join(", ")} · ${dir}`;
    }
  }

  if (!lead) return null;

  return (
    <section className="mt-8 border border-hairline border-l-2 border-l-signal bg-hull/60 px-6 py-7">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-signal">
        Key Takeaway
      </div>
      <p className="mt-4 max-w-3xl text-[17px] leading-[1.7] text-bone">{lead}</p>
      {tickerLine && (
        <p className="mono mt-4 text-[11.5px] uppercase tracking-[0.14em] text-text-secondary">
          {tickerLine}
        </p>
      )}
    </section>
  );
}
