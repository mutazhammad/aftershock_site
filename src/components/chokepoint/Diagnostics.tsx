import { Link } from "@tanstack/react-router";
import type { Diagnostics } from "@/lib/chokepoint-types";

/**
 * Measurement trust layer. Renders before any precedent figures so the reader
 * knows whether the numbers below can be read as caused by the event.
 */
export function DiagnosticsBlock({
  d,
  precedentNames,
}: {
  d: Diagnostics;
  precedentNames?: Map<string, string>;
}) {
  const concentration = d.concentration ?? [];
  const confounding = d.confounding ?? [];
  const anticipation = d.anticipation ?? [];

  return (
    <div className="space-y-5">
      {d.summary && (
        <p className="max-w-3xl text-[16px] leading-[1.7] text-bone">{d.summary}</p>
      )}
      {d.date_basis && (
        <p className="max-w-3xl text-[13px] leading-relaxed text-ash">{d.date_basis}</p>
      )}

      <div>
        <div className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-text-muted">
          Single-Name Concentration
        </div>
        {concentration.length === 0 ? (
          <p className="text-[13px] leading-relaxed text-ash">
            No sector result was dominated by a single constituent.
          </p>
        ) : (
          <div className="grid gap-2">
            {concentration.map((c, i) => (
              <Link
                key={i}
                to="/methodology"
                hash="concentration"
                className="block border border-hairline border-l-2 border-l-amber bg-panel p-3 transition-colors hover:border-l-amber hover:bg-hull/80"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="mono text-[12.5px] font-semibold text-bone">
                    {c.ticker}
                  </span>
                  <span className="text-[12.5px] text-text-primary">{c.sector}</span>
                  <span className="mono text-[10.5px] text-text-muted">{c.precedent}</span>
                  <span className="mono ml-auto border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-amber">
                    {c.share} one name
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-text-secondary">
                  {c.detail}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {confounding.length > 0 && (
        <div>
          <div className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-text-muted">
            Measurement Windows
          </div>
          <div className="grid gap-2">
            {confounding.map((c, i) => {
              const name = precedentNames?.get(c.precedent_id) ?? c.precedent_id;
              return (
                <Link
                  key={i}
                  to="/methodology"
                  hash="confounding"
                  className={`block border border-hairline border-l-2 bg-panel p-3 transition-colors hover:bg-hull/80 ${
                    c.clean ? "border-l-steel" : "border-l-ember"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span
                      className={`text-[12.5px] ${c.clean ? "text-ash" : "text-text-primary"}`}
                    >
                      {name}
                    </span>
                    <span
                      className={`mono ml-auto border px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.14em] ${
                        c.clean
                          ? "border-hairline text-ash"
                          : "border-ember/40 bg-ember/10 text-ember"
                      }`}
                    >
                      {c.clean ? "Clean window" : "Contaminated window"}
                    </span>
                  </div>
                  <p
                    className={`mt-1.5 text-[12.5px] leading-relaxed ${
                      c.clean ? "text-ash" : "text-text-secondary"
                    }`}
                  >
                    {c.detail}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {anticipation.length > 0 && (
        <div>
          <div className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-text-muted">
            Anticipation
          </div>
          <ul className="space-y-1.5">
            {anticipation.map((a, i) => (
              <li key={i} className="text-[12.5px] leading-relaxed text-ash">
                <span className="mono text-[11.5px] text-text-secondary">
                  {a.precedent}
                </span>{" "}
                {a.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
