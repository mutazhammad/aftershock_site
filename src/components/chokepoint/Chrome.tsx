import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-amber/60 text-amber mono text-[11px] font-semibold">
              AS
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-[15px] font-semibold tracking-tight truncate">Aftershock</div>
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-text-muted truncate">
                Geopolitical market intelligence
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 mono text-[11px] uppercase tracking-[0.14em]">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/methodology">Methodology</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
      <footer className="mt-16 border-t border-hairline">
        <div className="mx-auto max-w-6xl px-5 py-6 mono text-[11px] text-text-muted flex flex-wrap items-center justify-between gap-2">
          <span>This tool informs your decision. It does not give investment advice.</span>
          <span>Built by Mutaz Hammad.</span>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      activeProps={{ className: "text-amber border-amber/60" }}
      inactiveProps={{ className: "text-text-secondary border-transparent hover:text-amber hover:border-amber/40" }}
      className="border px-2.5 py-1 transition-colors"
    >
      {children}
    </Link>
  );
}