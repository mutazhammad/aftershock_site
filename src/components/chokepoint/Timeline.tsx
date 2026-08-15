import type { TimelineEntry } from "@/lib/chokepoint-types";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative border-l border-hairline pl-5">
      {entries.map((e, i) => (
        <li key={i} className="mb-5 last:mb-0">
          <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full border border-amber bg-canvas" />
          <div className="mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
            {e.datetime}
          </div>
          <div className="mt-1 text-[14px] font-semibold text-text-primary">{e.headline}</div>
          <p className="mt-1 text-[14.5px] leading-relaxed text-text-secondary">{e.detail}</p>
          <div className="mono mt-1 text-[10.5px] text-text-muted">source: {e.source}</div>
        </li>
      ))}
    </ol>
  );
}