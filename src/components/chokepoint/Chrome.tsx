import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-canvas text-text-primary flex flex-col">
      {/* Site-wide textures. Fixed, pointer-events none, above content but below no interactive layer. */}
      <div className="texture-grain" aria-hidden />
      <div className="texture-scanlines" aria-hidden />
      <div className="texture-vignette" aria-hidden />

      <header className="relative z-10 border-b border-hairline/80 bg-abyss/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-signal/60 text-signal mono text-[11px] font-semibold">
              AS
            </div>
            <div className="leading-tight min-w-0">
              <div className="display text-[16px] tracking-[0.02em] text-bone truncate">Aftershock</div>
              <div className="mono text-[9.5px] uppercase tracking-[0.22em] text-text-muted truncate">
                Geopolitical market intelligence
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 mono text-[11px] uppercase tracking-[0.18em]">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/methodology">Methodology</NavLink>
          </nav>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
      <footer className="relative z-10 mt-16 border-t border-hairline bg-abyss/60">
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
      activeProps={{ className: "text-signal border-signal/60 bg-signal/5" }}
      inactiveProps={{ className: "text-text-secondary border-transparent hover:text-ice hover:border-signal/40" }}
      className="border px-2.5 py-1 transition-colors"
    >
      {children}
    </Link>
  );
}