import type { ImportantNotes as IN } from "@/lib/chokepoint-types";

const CAT_LABEL: Record<string, string> = {
  structural: "Structural",
  regime: "Regime",
  market_structure: "Market Structure",
  confounding: "Confounding",
  scale: "Scale",
  regional: "Regional",
};

export function ImportantNotesBlock({
  notes,
  precedentNames,
}: {
  notes: IN;
  precedentNames?: Map<string, string>;
}) {
  return (
    <>
      {notes.overall_applicability && (
        <div className="mb-4 border border-hairline border-l-2 border-l-signal bg-signal/5 p-4">
          <div className="mono text-[10px] uppercase tracking-[0.16em] text-signal">
            Overall Applicability
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-text-primary">
            {notes.overall_applicability}
          </p>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {(notes.notes ?? []).map((n, i) => {
          const dir =
            n.direction === "amplifies"
              ? { arrow: "▲", color: "text-ember", label: "Amplifies" }
              : n.direction === "dampens"
              ? { arrow: "▼", color: "text-verdigris", label: "Dampens" }
              : { arrow: "–", color: "text-ash", label: "Uncertain" };
          return (
            <div key={i} className="border border-hairline bg-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="display text-[15px] tracking-wide text-bone">
                  {n.title}
                </h3>
                <span className={`mono shrink-0 text-[11px] ${dir.color}`}>
                  {dir.arrow} {dir.label}
                </span>
              </div>
              <div className="mt-1.5">
                <span className="mono border border-hairline px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-ash">
                  {CAT_LABEL[n.category] ?? n.category}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
                {n.detail}
              </p>
              {n.affects && n.affects.length > 0 && (
                <p className="mono mt-2 text-[10.5px] text-text-muted">
                  Affects:{" "}
                  {n.affects
                    .map((id) => precedentNames?.get(id) ?? id)
                    .join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}