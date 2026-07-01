import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { HistoricalPrecedent } from "@/lib/chokepoint-types";

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
                <p className="text-[13px] leading-relaxed text-text-primary">{p.mini.summary}</p>
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