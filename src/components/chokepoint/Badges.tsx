import type { Recency, Status, Tone } from "@/lib/chokepoint-types";

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
      <span
        className={`h-1.5 w-1.5 rounded-full ${isConfirmed ? "bg-teal" : "bg-amber"}`}
      />
      {status}
    </span>
  );
}

export function RecencyBadge({ recency }: { recency: Recency }) {
  const color =
    recency === "breaking"
      ? "border-red/40 text-red"
      : recency === "developing"
      ? "border-amber/40 text-amber"
      : "border-hairline text-text-muted";
  return (
    <span
      className={`mono inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${color}`}
    >
      {recency === "breaking" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
      )}
      {recency}
    </span>
  );
}

export function TypeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-hairline bg-panel px-2 py-0.5 text-[11px] text-text-secondary">
      {label}
    </span>
  );
}

export function ToneText({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const cls =
    tone === "gain" ? "text-teal" : tone === "loss" ? "text-red" : "text-text-primary";
  return <span className={`mono ${cls}`}>{children}</span>;
}