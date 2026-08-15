import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { HistoricalPrecedent } from "@/lib/chokepoint-types";
import { TimeseriesChart } from "./TimeseriesChart";

export function PrecedentsList({ items }: { items: HistoricalPrecedent[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="divide-y divide-hairline border border-hairline">
      {items.map((p, i) => {
        const isOpen = open === i;
        return (
          <li key={`${p.name}-${p.date}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-canvas/60"
              aria-expanded={isOpen}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[14px] font-semibold text-text-primary">{p.name}</span>
                  <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                    {p.date}
                  </span>
                  {p.measured && (
                    <span className="mono border border-teal/40 bg-teal/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-teal">
                      measured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12.5px] text-text-secondary">{p.why_similar}</p>
              </div>
              <span className="mono shrink-0 text-[14px] text-text-muted">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-hairline bg-canvas/40 px-4 py-3">
                <p className="text-[14.5px] leading-relaxed text-text-primary">{p.mini.summary}</p>

                {p.mini.timeseries && (
                  <div className="mt-3">
                    <TimeseriesChart ts={p.mini.timeseries} />
                    <p className="mono mt-1 text-[10px] text-text-muted">
                      Path over the event window.
                    </p>
                  </div>
                )}

                {p.mini.moves && p.mini.moves.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {p.mini.moves.map((m) => {
                      const sig = typeof m.t_stat === "number" ? Math.abs(m.t_stat) >= 2 : true;
                      const toneCls = m.tone === "gain" ? "text-teal" : "text-red";
                      return (
                        <div
                          key={m.label}
                          className={`border border-hairline bg-panel p-2 ${sig ? "" : "opacity-60"}`}
                        >
                          <div className="mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                            {m.label}
                          </div>
                          <div
                            className={`mono mt-0.5 text-[14px] ${sig ? "font-semibold" : ""} ${toneCls}${sig ? "" : "/70"}`}
                          >
                            {m.pct}
                          </div>
                          {typeof m.t_stat === "number" && (
                            <div className="mono text-[9.5px] text-text-muted">
                              t={m.t_stat.toFixed(2)} · {sig ? "significant" : "not significant"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {p.mini.key_moves.map((km) => (
                    <div key={km.label} className="border border-hairline bg-panel p-2">
                      <div className="mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                        {km.label}
                      </div>
                      <div
                        className={`mono mt-0.5 text-[14px] font-semibold ${
                          km.tone === "gain" ? "text-teal" : "text-red"
                        }`}
                      >
                        {km.pct}
                      </div>
                      <div className="mono text-[10px] text-text-muted">{km.timeframe}</div>
                    </div>
                  ))}
                </div>

                {p.mini.consistency && (
                  <p className="mono mt-3 border-l-2 border-teal/60 bg-teal/5 px-3 py-2 text-[11.5px] text-text-primary">
                    {p.mini.consistency}
                  </p>
                )}
                {p.mini.confounding_note && (
                  <p className="mono mt-2 border-l-2 border-amber/60 bg-amber/5 px-3 py-2 text-[11.5px] text-text-primary">
                    ⚠ {p.mini.confounding_note}
                  </p>
                )}

                {p.measured && p.id && (
                  <Link
                    to="/event/$id"
                    params={{ id: p.id }}
                    className="mono mt-3 inline-block text-[11.5px] uppercase tracking-[0.14em] text-amber hover:underline"
                  >
                    View full analysis →
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}