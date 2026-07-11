import type { Recency, Status, Tone } from "@/lib/chokepoint-types";

function titleCase(s: string) {
  return s.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status }: { status: Status }) {
  const isConfirmed = status === "confirmed";
  return (
    <span
      className={`mono inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
        isConfirmed
          ? "border-teal/40 bg-teal/10 text-teal"
          : "border-amber/40 bg-amber/10 text-amber"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isConfirmed ? "bg-teal" : "bg-amber"}`} />
      {isConfirmed ? "Confirmed" : "Disputed"}
    </span>
  );
}

export function RecencyBadge({ recency }: { recency: Recency }) {
  const cfg =
    recency === "breaking"
      ? { cls: "border-amber/50 bg-amber/10 text-amber", dot: "bg-amber", label: "Breaking" }
      : recency === "developing"
      ? { cls: "border-blue/50 bg-blue/10 text-blue", dot: "bg-blue", label: "Developing" }
      : { cls: "border-teal/40 bg-teal/10 text-teal", dot: "bg-teal", label: "Settled" };
  return (
    <span
      className={`mono inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${cfg.cls}`}
    >
      {recency === "breaking" && (
        <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  );
}

export function TypeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-hairline bg-panel px-2 py-0.5 text-[11px] text-text-secondary">
      {titleCase(label)}
    </span>
  );
}

export function ToneText({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const cls =
    tone === "gain" ? "text-teal" : tone === "loss" ? "text-red" : "text-text-primary";
  return <span className={`mono ${cls}`}>{children}</span>;
}