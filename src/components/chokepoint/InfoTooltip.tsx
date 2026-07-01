import { useState, type ReactNode } from "react";

export function InfoTooltip({ term, definition, children }: { term?: string; definition: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="mono cursor-help border-b border-dotted border-text-muted/60 text-text-primary"
      >
        {children ?? term}
      </button>
      {open && (
        <span className="absolute left-0 top-full z-20 mt-1 w-64 border border-hairline bg-panel p-2 text-[11px] leading-snug text-text-secondary shadow-lg">
          {definition}
        </span>
      )}
    </span>
  );
}