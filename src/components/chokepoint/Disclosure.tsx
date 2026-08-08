import { useState, type ReactNode } from "react";

/** Single toggle that hides secondary depth behind one click. */
export function Disclosure({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mono border border-steel px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-signal/60 hover:text-signal"
      >
        {open ? "▾" : "▸"} {label}
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
}
