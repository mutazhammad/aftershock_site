import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chrome } from "@/components/chokepoint/Chrome";
import { HeroMap } from "@/components/chokepoint/HeroMap";
import { RecencyBadge, StatusBadge, TypeChip } from "@/components/chokepoint/Badges";
import {
  fetchEventLocations,
  fetchFeed,
  fetchStats,
  formatDate,
  type EventLocation,
  type FeedItem,
  type AftershockStats,
} from "@/lib/aftershock-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aftershock, Geopolitical Market Intelligence" },
      {
        name: "description",
        content:
          "Aftershock tells you which sectors move when a blockade closes, sanctions land, or missiles fly, by how much, and what history says happens next.",
      },
      { property: "og:title", content: "Aftershock" },
      {
        property: "og:description",
        content:
          "How geopolitical events move markets. Measured, not guessed.",
      },
      { property: "og:image", content: "https://geofin-context-engine.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://geofin-context-engine.lovable.app/og-image.png" },
    ],
  }),
  loader: async () => {
    const [feed, locs, stats] = await Promise.all([
      fetchFeed().catch(() => [] as FeedItem[]),
      fetchEventLocations().catch(() => [] as EventLocation[]),
      fetchStats().catch(
        () => ({ events: 0, precedents: 0, rejected: null } as AftershockStats),
      ),
    ]);
    return { feed, locs, stats };
  },
  component: LandingPage,
});

function LandingPage() {
  const { feed, locs, stats } = Route.useLoaderData() as {
    feed: FeedItem[];
    locs: EventLocation[];
    stats: AftershockStats;
  };
  const nEvents = stats.events || feed.length;
  const nPrecedents = stats.precedents;
  const nRejected = stats.rejected;
  const proofEvents = feed.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-abyss text-bone">
      {/* Site textures for this page (Chrome adds them elsewhere; here we
          render our own frame so the hero can go full-bleed). */}
      <div className="texture-grain" aria-hidden />
      <div className="texture-scanlines" aria-hidden />
      <div className="texture-vignette" aria-hidden />

      {/* Compact top nav overlay */}
      <TopNav />

      {/* HERO */}
      <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden pt-20">
        <HeroMap markers={locs} />

        {/* Radial signal glow behind the headline */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(63,169,245,0.22), rgba(63,169,245,0.05) 30%, transparent 60%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center animate-fade-rise">
          <div className="mono flex items-center gap-2 text-[10.5px] uppercase tracking-[0.28em] text-signal">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-signal opacity-70 animate-ambient" />
              <span className="relative h-2 w-2 rounded-full bg-signal" />
            </span>
            {nEvents > 0 ? (
              <>
                {nEvents} Events Tracked
                {nPrecedents > 0 ? ` · ${nPrecedents} Precedents Measured` : ""}
                {typeof nRejected === "number" && nRejected > 0
                  ? ` · ${nRejected} Rejected`
                  : ""}
              </>
            ) : (
              "Aftershock · Live"
            )}
          </div>

          <h1
            className="display mt-6 text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-[-0.02em] text-bone"
            style={{ textShadow: "0 0 60px rgba(63,169,245,0.25)" }}
          >
            Panic Is Not
            <br />
            A Strategy
          </h1>

          <div className="animate-draw-rule mt-8 h-px w-56 bg-signal/70" />

          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-bone/85 md:text-[17px]">
            A blockade closes. Sanctions land. Missiles fly. Aftershock tells you which
            sectors move, by how much, and what history says happens next.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/events"
              className="mono inline-flex items-center gap-2 border border-signal bg-signal/15 px-5 py-3 text-[12px] uppercase tracking-[0.2em] text-signal transition-colors hover:bg-signal/25 hover:text-ice"
              style={{ boxShadow: "0 0 40px rgba(63,169,245,0.15)" }}
            >
              View The Events →
            </Link>
            <Link
              to="/methodology"
              className="mono inline-flex items-center gap-2 border border-steel px-5 py-3 text-[12px] uppercase tracking-[0.2em] text-bone/80 transition-colors hover:border-signal/60 hover:text-ice"
            >
              Methodology
            </Link>
          </div>

          <div className="mono mt-14 text-[10px] uppercase tracking-[0.28em] text-ash/70">
            ↓ Scroll
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="relative z-10 border-t border-steel/60 bg-abyss">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Eyebrow n="01" label="What It Does" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Capability
              title="Measures The Move"
              body="When Russia invaded Ukraine, airline stocks fell 14.9 percent beyond the market, a statistically significant move. Aftershock computed that from market data."
              stat="-14.9%"
              statTone="loss"
              statLabel="Airlines vs S&P 500"
            />
            <Capability
              title="Finds The Precedent"
              body="Every breaking event is matched against historical parallels, measured with the same engine. You see what actually happened last time, in numbers."
              stat="17+"
              statTone="signal"
              statLabel="Measured Precedents"
            />
            <Capability
              title="Separates Signal From Noise"
              body="Every figure carries a significance test, so you know which moves were real and which were market noise."
              stat="|t|≥2"
              statTone="signal"
              statLabel="Significance Threshold"
            />
          </div>
        </div>
      </section>

      {/* SIGNAL CHAIN */}
      <section className="relative z-10 border-t border-steel/60 bg-hull/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Eyebrow n="02" label="The Signal Chain" />
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { k: "Event", d: "AI detects it from live news, the moment markets could have known." },
              { k: "Measure", d: "Market reaction, VIX, realised volatility, all computed from prices." },
              { k: "Compare", d: "Every breaking event matched to measured historical precedents." },
              { k: "Verdict", d: "Which sectors moved, by how much, with what statistical confidence." },
            ].map((s, i) => (
              <div key={s.k} className="relative border border-steel bg-hull/70 p-5">
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="display mt-2 text-[22px] text-bone tracking-wide">{s.k}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-bone/70">{s.d}</p>
                {i < 3 && (
                  <div
                    className="pointer-events-none absolute right-[-8px] top-1/2 hidden h-px w-4 bg-signal/60 md:block"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PROOF */}
      {proofEvents.length > 0 && (
        <section className="relative z-10 border-t border-steel/60 bg-abyss">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <div className="flex items-end justify-between gap-4">
              <Eyebrow n="03" label="Live From The Feed" />
              <Link
                to="/events"
                className="mono text-[11px] uppercase tracking-[0.22em] text-signal hover:text-ice"
              >
                All Events →
              </Link>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {proofEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    to="/event/$id"
                    params={{ id: e.id }}
                    className="group block h-full border border-steel bg-hull/70 p-5 transition-colors hover:border-signal/60"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <TypeChip label={e.type_label} />
                      <StatusBadge status={e.status} />
                      <RecencyBadge recency={e.recency} />
                    </div>
                    <div className="display mt-4 text-[18px] leading-tight text-bone group-hover:text-ice">
                      {e.name}
                    </div>
                    <div className="mono mt-2 text-[11px] uppercase tracking-[0.18em] text-ash">
                      {formatDate(e.information_date)}
                      {e.region ? ` · ${e.region}` : ""}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CLOSING CLAIM */}
      <section className="relative z-10 border-t border-steel/60 bg-hull/40">
        <div className="mx-auto max-w-4xl px-5 py-24">
          <div className="border-l-2 border-signal bg-abyss/60 p-8">
            <div className="mono text-[10.5px] uppercase tracking-[0.24em] text-signal">
              The Standard
            </div>
            <p className="display mt-3 text-[28px] leading-tight text-bone md:text-[36px]">
              Every Number Here Was Measured, Not Estimated.
            </p>
            <p className="mt-6 text-[14.5px] leading-relaxed text-bone/80">
              Aftershock runs an event-study engine over live market data, computing
              cumulative abnormal returns, significance tests, and volatility analysis, then
              matches every breaking event to measured historical precedents. When the
              market moves, you know how much of it was the event.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/events"
                className="mono border border-signal bg-signal/15 px-4 py-2.5 text-[11.5px] uppercase tracking-[0.2em] text-signal hover:bg-signal/25 hover:text-ice"
              >
                View The Events →
              </Link>
              <Link
                to="/methodology"
                className="mono border border-steel px-4 py-2.5 text-[11.5px] uppercase tracking-[0.2em] text-bone/80 hover:border-signal/60 hover:text-ice"
              >
                Read The Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-steel bg-abyss">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 py-8">
          <WordmarkFull />
          <div className="mono flex flex-col items-start gap-1 text-[11px] text-ash sm:items-end">
            <span>This tool informs your decision. It does not give investment advice.</span>
            <span>Built by Mutaz Hammad.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors ${
        scrolled ? "border-steel bg-abyss/85 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" aria-label="Aftershock, home">
          <WordmarkCompact />
        </Link>
        <nav className="mono flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-bone/70">
          <Link to="/events" className="hover:text-ice">Events</Link>
          <Link to="/methodology" className="hover:text-ice">Methodology</Link>
          <Link to="/build-notes" className="hover:text-ice">Build Notes</Link>
        </nav>
      </div>
    </header>
  );
}

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-steel/60 pb-3">
      <span className="mono text-[10px] uppercase tracking-[0.28em] text-signal">{n}</span>
      <h2 className="display text-[22px] tracking-wide text-bone md:text-[26px]">{label}</h2>
    </div>
  );
}

function Capability({
  title,
  body,
  stat,
  statTone,
  statLabel,
}: {
  title: string;
  body: string;
  stat: string;
  statTone: "loss" | "gain" | "signal";
  statLabel: string;
}) {
  const color =
    statTone === "loss" ? "text-ember" : statTone === "gain" ? "text-verdigris" : "text-signal";
  return (
    <article className="border border-steel bg-hull/70 p-5">
      <div className="display text-[20px] tracking-wide text-bone">{title}</div>
      <p className="mt-3 text-[13px] leading-relaxed text-bone/75">{body}</p>
      <div className="mt-5 border-t border-steel/70 pt-4">
        <div className={`mono text-[28px] font-semibold leading-none ${color}`}>{stat}</div>
        <div className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-ash">
          {statLabel}
        </div>
      </div>
    </article>
  );
}
