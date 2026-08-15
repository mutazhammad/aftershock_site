import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const LINKS: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/methodology", label: "Methodology" },
  { to: "/build-notes", label: "Build Notes" },
];

/** Hamburger trigger plus full-screen overlay menu, mobile only. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 shrink-0 items-center justify-center border border-steel text-signal"
      >
        <span className="sr-only">Menu</span>
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path d="M3 3 L15 15 M15 3 L3 15" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path
              d="M2 4.5H16 M2 9H16 M2 13.5H16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-abyss">
          <div className="flex items-center justify-end px-5 py-4">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center border border-steel text-signal"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path d="M3 3 L15 15 M15 3 L3 15" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-6">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-signal" }}
                inactiveProps={{ className: "text-bone" }}
                className="display flex min-h-[60px] items-center border-b border-steel text-[26px] tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}