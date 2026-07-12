import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Chrome } from "@/components/chokepoint/Chrome";
import { RecencyBadge, StatusBadge, TypeChip } from "@/components/chokepoint/Badges";
import { fetchFeed, formatDate, type FeedItem } from "@/lib/aftershock-api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events · Aftershock" },
      {
        name: "description",
        content:
          "Geopolitical events and their measured impact on financial markets. Decision support, not investment advice.",
      },
      { property: "og:title", content: "Events · Aftershock" },
      {
        property: "og:description",
        content:
          "Geopolitical events and their measured impact on financial markets.",
      },
    ],
  }),
  loader: () => fetchFeed(),
  errorComponent: ({ error }) => (
    <Chrome>
      <div className="border border-hairline bg-panel p-6">
        <h1 className="text-lg font-semibold">Couldn't Load Events</h1>
        <p className="mono mt-2 text-[12px] text-text-muted">{error.message}</p>
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

type Period = "all" | "this_week" | "last_week" | "last_30";

const PERIODS: { id: Period; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "last_30", label: "Last 30 Days" },
];

function startOfWeek(d: Date): Date {
  const day = d.getDay(); // 0=Sun
  const diff = (day + 6) % 7; // Monday start
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  r.setDate(r.getDate() - diff);
  return r;
}

function inPeriod(iso: string, p: Period, from: string, to: string): boolean {
  if (!iso) return false;
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  if (p === "all" && !from && !to) return true;
  if (p === "this_week") {
    const s = startOfWeek(now);
    return d >= s;
  }
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
  const [items, setItems] = useState<FeedItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<Period>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    setUpdatedAt(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 1400);
    return () => clearTimeout(t);
  }, [flash]);

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fresh = await fetchFeed();
      setItems(fresh);
      setUpdatedAt(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      setFlash(true);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((e) => {
      if (
        needle &&
        !e.name.toLowerCase().includes(needle) &&
        !(e.type_label ?? "").toLowerCase().includes(needle)
      ) {
        return false;
      }
      if (!inPeriod(e.information_date, period, from, to)) return false;
      return true;
    });
  }, [items, q, period, from, to]);

  const clearFilters = () => {
    setQ("");
    setPeriod("all");
    setFrom("");
    setTo("");
  };

  const hasFilters = q || period !== "all" || from || to;

  return (
    <Chrome>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Event Feed</h1>
          <p className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-text-muted">
            Showing {filtered.length} of {items.length} events · newest first
            {updatedAt ? ` · updated ${updatedAt}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {flash && (
            <span className="mono border border-teal/40 bg-teal/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-teal">
              ✓ Updated
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="mono inline-flex items-center gap-2 border border-hairline bg-panel px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-amber/40 hover:text-amber disabled:opacity-60"
          >
            <span className={loading ? "inline-block animate-spin" : ""} aria-hidden>
              ↻
            </span>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 space-y-3 border border-hairline bg-panel p-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={q}
            onChange={(ev) => setQ(ev.target.value)}
            placeholder="Search by name or type…"
            className="mono min-w-0 flex-1 border border-hairline bg-canvas px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted focus:border-amber/50 focus:outline-none"
          />
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPeriod(p.id);
                setFrom("");
                setTo("");
              }}
              className={`mono border px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                period === p.id && !from && !to
                  ? "border-amber text-amber bg-amber/10"
                  : "border-hairline text-text-secondary hover:border-amber/40 hover:text-amber"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <label className="mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            Range
          </label>
          <input
            type="date"
            value={from}
            onChange={(ev) => {
              setFrom(ev.target.value);
              setPeriod("all");
            }}
            className="mono border border-hairline bg-canvas px-2 py-1 text-[11px] text-text-primary focus:border-amber/50 focus:outline-none"
          />
          <span className="text-text-muted">→</span>
          <input
            type="date"
            value={to}
            onChange={(ev) => {
              setTo(ev.target.value);
              setPeriod("all");
            }}
            className="mono border border-hairline bg-canvas px-2 py-1 text-[11px] text-text-primary focus:border-amber/50 focus:outline-none"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mono ml-auto border border-hairline px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-text-muted hover:border-amber/40 hover:text-amber"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-hairline bg-panel p-8 text-center">
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
            No events match these filters.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mono mt-3 border border-hairline px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-amber hover:border-amber/40"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => (
            <li key={e.id}>
              <Link
                to="/event/$id"
                params={{ id: e.id }}
                className="group block border border-hairline bg-panel p-4 transition-colors hover:border-amber/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <TypeChip label={e.type_label} />
                  <StatusBadge status={e.status} />
                  <RecencyBadge recency={e.recency} />
                  {e.region && (
                    <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                      · {e.region}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-[16px] font-semibold tracking-tight text-text-primary group-hover:text-amber">
                  {e.name}
                </h2>
                <div className="mono mt-1 text-[11px] text-text-muted">
                  {formatDate(e.information_date)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Chrome>
  );
}