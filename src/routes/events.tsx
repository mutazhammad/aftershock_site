import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Chrome } from "@/components/chokepoint/Chrome";
import { RecencyBadge, StatusBadge, TypeChip } from "@/components/chokepoint/Badges";
import { EVENTS, EVENT_FAMILIES, type EventFamily } from "@/lib/chokepoint-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chokepoint — Event feed" },
      {
        name: "description",
        content:
          "Geopolitical events and their measured impact on financial markets. Decision support, not investment advice.",
      },
      { property: "og:title", content: "Chokepoint — Event feed" },
      {
        property: "og:description",
        content: "Geopolitical events and their measured impact on financial markets.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const [family, setFamily] = useState<EventFamily>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const events = useMemo(() => {
    const list = family === "all" ? EVENTS : EVENTS.filter((e) => e.event.type_label === family);
    return list;
  }, [family]);

  return (
    <Chrome>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Event feed</h1>
          <p className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-text-muted">
            {events.length} events · newest first
          </p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="mono border border-hairline bg-panel px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-amber/40 hover:text-amber"
          aria-label="Refresh feed"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-y border-hairline py-3">
        <span className="mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
          Family:
        </span>
        {EVENT_FAMILIES.map((f) => {
          const active = f === family;
          return (
            <button
              key={f}
              onClick={() => setFamily(f)}
              className={`mono px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "border border-amber/60 bg-amber/10 text-amber"
                  : "border border-hairline text-text-secondary hover:border-amber/40 hover:text-text-primary"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul key={refreshKey} className="space-y-3">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              to="/event/$id"
              params={{ id: e.id }}
              className="group block border border-hairline bg-panel p-4 transition-colors hover:border-amber/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <TypeChip label={e.event.type_label} />
                    <StatusBadge status={e.status} />
                    <RecencyBadge recency={e.recency} />
                  </div>
                  <h2 className="mt-2 text-[16px] font-semibold tracking-tight text-text-primary group-hover:text-amber">
                    {e.event.name}
                  </h2>
                  <div className="mono mt-1 text-[11px] text-text-muted">
                    {e.event.information_date} · {e.sources.join(" · ")}
                  </div>
                </div>
                <div className="flex items-center gap-4 self-center">
                  {e.event.key_metrics.map((m) => (
                    <div key={m.label} className="text-right">
                      <div className="mono text-[9.5px] uppercase tracking-[0.14em] text-text-muted">
                        {m.label}
                      </div>
                      <div
                        className={`mono text-[14px] font-semibold ${
                          m.tone === "gain"
                            ? "text-teal"
                            : m.tone === "loss"
                            ? "text-red"
                            : "text-text-primary"
                        }`}
                      >
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Chrome>
  );
}
