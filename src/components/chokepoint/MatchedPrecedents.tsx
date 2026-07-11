import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { EventRecord } from "@/lib/chokepoint-types";
import { ReactionBar } from "./ReactionBar";
import { VolatilityBlock } from "./Volatility";

export function MatchedPrecedents({ items }: { items: EventRecord[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;
  return (
    <ul className="divide-y divide-hairline border border-hairline">
      {items.map((p, i) => {
        const isOpen = open === i;
        return (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-canvas/60"
              aria-expanded={isOpen}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[14px] font-semibold text-text-primary">
                    {p.event.name || p.id}
                  </span>
                  <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                    {p.event.information_date}
                  </span>
                  {p.event.type_label && (
                    <span className="mono border border-hairline px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-text-secondary">
                      {p.event.type_label}
                    </span>
                  )}
                </div>
                {p.summary && (
                  <p className="mt-1 text-[12.5px] text-text-secondary line-clamp-2">
                    {p.summary}
                  </p>
                )}
              </div>
              <span className="mono shrink-0 text-[14px] text-text-muted">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-hairline bg-canvas/40 p-4">
                {p.reaction && p.reaction.length > 0 && (
                  <div className="border border-hairline bg-panel">
                    {p.reaction.map((r) => (
                      <ReactionBar key={r.sector} row={r} />
                    ))}
                  </div>
                )}
                {p.volatility && (
                  <div className="mt-4">
                    <VolatilityBlock v={p.volatility} />
                  </div>
                )}
                {p.lasting_finding && (
                  <p className="mt-3 border-l-2 border-amber/60 bg-amber/5 px-3 py-2 text-[12.5px] text-text-primary">
                    {p.lasting_finding}
                  </p>
                )}
                <div className="mt-3">
                  <Link
                    to="/event/$id"
                    params={{ id: p.id }}
                    className="mono inline-block text-[11.5px] uppercase tracking-[0.14em] text-amber hover:underline"
                  >
                    View Full Analysis →
                  </Link>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}