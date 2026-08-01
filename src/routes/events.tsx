import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chrome } from "@/components/chokepoint/Chrome";
import { FeedRow } from "@/components/chokepoint/FeedRow";
import { fetchFeed, type FeedItem } from "@/lib/aftershock-api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events, Aftershock" },
      {
        name: "description",
        content:
          "Live watch list of geopolitical events and their measured market reactions.",
      },
      { property: "og:title", content: "Events, Aftershock" },
      {
        property: "og:description",
        content:
          "Live watch list of geopolitical events and their measured market reactions.",
      },
      { property: "og:image", content: "https://geofin-context-engine.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://geofin-context-engine.lovable.app/og-image.png" },
    ],
  }),
  loader: () => fetchFeed(),
  errorComponent: ({ error, reset }) => (
    <Chrome>
      <div className="border border-hairline bg-panel p-6">
        <h1 className="text-lg font-semibold">Couldn't Load Events</h1>
        <p className="mono mt-2 text-[12px] text-text-muted">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mono mt-4 border border-hairline px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:border-signal/40 hover:text-signal"
        >
          Try Again
        </button>
      </div>
    </Chrome>
  ),
  notFoundComponent: () => (
    <Chrome>
      <div className="border border-hairline bg-panel p-6 text-center">
        No events found.
      </div>
    </Chrome>
  ),
  component: FeedPage,
});

type Period = "all" | "this_week" | "last_week" | "last_30" | "range";

const PERIODS: { id: Exclude<Period, "range">; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "last_30", label: "Last 30 Days" },
];

function startOfWeek(d: Date): Date {
  const r = new Date(d);
  const dow = (r.getDay() + 6) % 7;
  r.setHours(0, 0, 0, 0);
  r.setDate(r.getDate() - dow);
  return r;
}

function inPeriod(iso: string, p: Period, from: string, to: string): boolean {
  if (!iso) return false;
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  if (p === "all" && !from && !to) return true;
  if (p === "this_week") return d >= startOfWeek(now);
  if (p === "last_week") {
    const s = startOfWeek(now);
    const prev = new Date(s);
    prev.setDate(prev.getDate() - 7);
    return d >= prev && d < s;
  }
  if (p === "last_30") {
    const s = new Date(now);
    s.setDate(s.getDate() - 30);
    return d >= s;
  }
  if (from) {
    const f = new Date(from + "T00:00:00Z");
    if (d < f) return false;
  }
  if (to) {
    const t = new Date(to + "T23:59:59Z");
    if (d > t) return false;
  }
  return true;
}

function FeedPage() {
  const initial = Route.useLoaderData() as FeedItem[];
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<Period>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [timeOpen, setTimeOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timeOpen) return;
    const onDoc = (ev: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(ev.target as Node)) {
        setTimeOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [timeOpen]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return initial.filter((e) => {
      if (
        needle &&
        !e.name.toLowerCase().includes(needle) &&
        !(e.type_label ?? "").toLowerCase().includes(needle)
      )
        return false;
      if (!inPeriod(e.information_date, period, from, to)) return false;
      return true;
    });
  }, [initial, q, period, from, to]);

  const activeLabel =
    period === "range"
      ? `${from || "…"} → ${to || "…"}`
      : PERIODS.find((p) => p.id === period)?.label ?? "All Time";

  const clear = () => {
    setQ("");
    setPeriod("all");
    setFrom("");
    setTo("");
  };
  const hasFilters = q || period !== "all" || from || to;

  return (
    <Chrome>
      <div className="mb-6">
        <div className="mono text-[10.5px] uppercase tracking-[0.22em] text-signal">
          Watch List
        </div>
        <h1 className="display mt-1 text-[28px] tracking-tight text-bone">
          Geopolitical Events, Measured
        </h1>
      </div>

      {/* Command bar */}
      <div className="mb-4 border border-steel bg-hull/60 p-3 mono">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-signal text-[13px]">&gt;</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search events"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-bone placeholder:text-ash focus:outline-none"
          />
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setTimeOpen((o) => !o)}
              className="border border-steel px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-text-secondary hover:border-signal/60 hover:text-ice"
            >
              {activeLabel} ▾
            </button>
            {timeOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-72 border border-steel bg-hull p-2 shadow-2xl">
                {PERIODS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPeriod(p.id);
                      setFrom("");
                      setTo("");
                      setTimeOpen(false);
                    }}
                    className={`block w-full px-2 py-1.5 text-left text-[11px] uppercase tracking-[0.14em] transition-colors ${
                      period === p.id
                        ? "text-signal bg-signal/10"
                        : "text-text-secondary hover:text-ice hover:bg-steel/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                <div className="mt-2 border-t border-steel pt-2">
                  <div className="mb-1 text-[9.5px] uppercase tracking-[0.14em] text-text-muted">
                    Date Range
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      value={from}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        setPeriod("range");
                      }}
                      className="w-full border border-steel bg-abyss px-1.5 py-1 text-[11px] text-bone focus:border-signal/60 focus:outline-none"
                    />
                    <span className="text-ash">→</span>
                    <input
                      type="date"
                      value={to}
                      onChange={(e) => {
                        setTo(e.target.value);
                        setPeriod("range");
                      }}
                      className="w-full border border-steel bg-abyss px-1.5 py-1 text-[11px] text-bone focus:border-signal/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-signal">
            Showing {filtered.length} of {initial.length} Events
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-steel bg-hull/40 p-8 mono">
          <p className="text-[13px] text-text-primary">
            No events match {q ? `"${q}"` : "these filters"}
            {period !== "all" && period !== "range"
              ? ` in ${activeLabel.toLowerCase()}`
              : ""}
            .
          </p>
          {hasFilters && (
            <button
              onClick={clear}
              className="mt-3 text-[12px] text-signal underline decoration-signal/50 underline-offset-2 hover:text-ice"
            >
              &gt; clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="border-t border-steel">
          {filtered.map((e, i) => (
            <FeedRow key={e.id} item={e} index={i} />
          ))}
        </ul>
      )}
    </Chrome>
  );
}