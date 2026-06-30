import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center border border-amber/60 text-amber mono text-[11px] font-semibold">
              CP
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">Chokepoint</div>
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                Geopolitical market intelligence
              </div>
            </div>
          </Link>
          <div className="mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            v0.1 · measured data, not advice
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="mt-16 border-t border-hairline">
        <div className="mx-auto max-w-6xl px-5 py-6 mono text-[11px] text-text-muted">
          This tool informs your decision. It does not give investment advice.
        </div>
      </footer>
    </div>
  );
}