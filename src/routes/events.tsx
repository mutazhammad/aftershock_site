import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chrome } from "@/components/chokepoint/Chrome";
import { RecencyBadge, StatusBadge, TypeChip } from "@/components/chokepoint/Badges";
import { fetchFeed, formatDate, type FeedItem } from "@/lib/aftershock-api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Aftershock — Event feed" },
      {
        name: "description",
        content:
          "Geopolitical events and their measured impact on financial markets. Decision support, not investment advice.",
      },
      { property: "og:title", content: "Aftershock — Event feed" },
      {
        property: "og:description",
        content: "Geopolitical events and their measured impact on financial markets.",
      },
    ],
  }),
  loader: () => fetchFeed(),
  errorComponent: ({ error }) => (
    <Chrome>
      <div className="border border-hairline bg-panel p-6">
        <h1 className="text-lg font-semibold">Couldn't load events</h1>
        <p className="mono mt-2 text-[12px] text-text-muted">{error.message}</p>
      </div>
    </Chrome>
  ),
  notFoundComponent: () => (
    <Chrome>
      <div className="border border-hairline bg-panel p-6 text-center">No events found.</div>
    </Chrome>
  ),
  component: FeedPage,
});

function FeedPage() {
  const initial = Route.useLoaderData() as FeedItem[];
  const [items, setItems] = useState<FeedItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  useEffect(() => {
    // Set only after mount to avoid SSR/CSR locale mismatch.
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

  return (
    <Chrome>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Event feed</h1>
          <p className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-text-muted">
            {items.length} events · newest first{updatedAt ? ` · updated ${updatedAt}` : ""}
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
            <span className={loading ? "inline-block animate-spin" : ""} aria-hidden>↻</span>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-hairline bg-panel p-8 text-center mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
          No events yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((e) => (
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