import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { WordmarkCompact, WordmarkFull } from "./Brand";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-canvas text-text-primary flex flex-col">
      {/* Site-wide textures. Fixed, pointer-events none, above content but below no interactive layer. */}
      <div className="texture-grain" aria-hidden />
      <div className="texture-scanlines" aria-hidden />
      <div className="texture-vignette" aria-hidden />

      <header className="relative z-10 border-b border-hairline/80 bg-abyss/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="min-w-0" aria-label="Aftershock, home">
            <WordmarkCompact />
          </Link>
          <nav className="flex items-center gap-1 mono text-[11px] uppercase tracking-[0.18em]">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/methodology">Methodology</NavLink>
            <NavLink to="/build-notes">Build Notes</NavLink>
          </nav>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
      <footer className="relative z-10 mt-16 border-t border-hairline bg-abyss/60">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-wrap items-end justify-between gap-6">
          <WordmarkFull />
          <div className="mono text-[11px] text-text-muted flex flex-col items-start gap-1 sm:items-end">
            <span>This tool informs your decision. It does not give investment advice.</span>
            <span>Built by Mutaz Hammad.</span>
          </div>
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