import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Chrome } from "@/components/chokepoint/Chrome";
import { RecencyBadge, StatusBadge, TypeChip } from "@/components/chokepoint/Badges";
import { ReactionBar } from "@/components/chokepoint/ReactionBar";
import { Timeline } from "@/components/chokepoint/Timeline";
import { TimeseriesChart } from "@/components/chokepoint/TimeseriesChart";
import { CompanyCards } from "@/components/chokepoint/CompanyCards";
import { PrecedentsList } from "@/components/chokepoint/PrecedentsList";
import { MapBackgroundGeo } from "@/components/chokepoint/MapBackgroundGeo";
import { InfoTooltip } from "@/components/chokepoint/InfoTooltip";
import { fetchEvent } from "@/lib/aftershock-api";
import type { EventRecord } from "@/lib/chokepoint-types";

export const Route = createFileRoute("/event/$id")({
  loader: async ({ params }): Promise<{ record: EventRecord }> => {
    const record = await fetchEvent(params.id);
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.record.event.name ?? "Event";
    return {
      meta: [
        { title: `${name} — Aftershock` },
        { name: "description", content: `Measured market reaction to ${name}.` },
        { property: "og:title", content: `${name} — Aftershock` },
        { property: "og:description", content: `Measured market reaction to ${name}.` },
      ],
    };
  },
  notFoundComponent: () => (
    <Chrome>
      <div className="border border-hairline bg-panel p-8 text-center">
        <div className="mono text-[11px] uppercase tracking-[0.16em] text-text-muted">404</div>
        <h1 className="mt-2 text-xl font-semibold">Event not found</h1>
        <Link to="/events" className="mono mt-4 inline-block text-[12px] text-amber underline">
          ← Back to feed
        </Link>
      </div>
    </Chrome>
  ),
  errorComponent: ({ error, reset }) => (
    <Chrome>
      <div className="border border-hairline bg-panel p-8">
        <h1 className="text-xl font-semibold">Couldn't load this event</h1>
        <p className="mono mt-2 text-[12px] text-text-muted">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mono mt-4 border border-hairline px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:border-amber/40 hover:text-amber"
        >
          Try again
        </button>
      </div>
    </Chrome>
  ),
  component: EventReport,
});

function SectionTitle({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-3 border-b border-hairline pb-2">
      <span className="mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{n}</span>
      <h2 className="text-[15px] font-semibold tracking-tight text-text-primary">{title}</h2>
      {sub && <span className="mono text-[10.5px] text-text-muted">{sub}</span>}
    </div>
  );
}

function EventReport() {
  const data = Route.useLoaderData() as { record: EventRecord };
  const e = data.record;
  const sourcesAgree = e.sources_agree ?? e.status === "confirmed";
  const isBreaking = e.recency === "breaking";
  const isDeveloping = e.recency === "developing";
  const hasReactionData = e.reaction && e.reaction.length > 0;
  const hasTimeseries =
    !!e.timeseries && e.timeseries.series.some((s) => (s.values ?? []).length > 0);
  const showChart = !isBreaking && hasTimeseries;
  const showReactionBars = !isBreaking && hasReactionData;

  const inNews =
    (e.companies_in_news && e.companies_in_news.length > 0
      ? e.companies_in_news.map((c) => ({ name: c.name, right: c.source }))
      : (e.companies_named ?? []).map((c) => ({ name: c.name, right: c.amount }))) ?? [];

  return (
    <Chrome>
      <Link
        to="/events"
        className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-text-muted hover:text-amber"
      >
        ← Event feed
      </Link>

      <section className="relative overflow-hidden border border-hairline bg-panel">
        {e.location && (
          <MapBackgroundGeo center={e.location.center} zoom={e.location.zoom} />
        )}
        <div className="relative">
          <div className="border-b border-hairline p-5">
            <div className="flex flex-wrap items-center gap-2">
              {e.event.type_label && <TypeChip label={e.event.type_label} />}
              <StatusBadge status={e.status} />
              <RecencyBadge recency={e.recency} />
              {e.location?.name && (
                <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                  · {e.location.name}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight">
              {e.event.name}
            </h1>
            {e.event.information_date && (
              <p className="mono mt-2 text-[12px] text-text-secondary">
                Measured from <span className="text-text-primary">{e.event.information_date}</span>{" "}
                (event start)
                {e.event.announcement_date && (
                  <>
                    , not the{" "}
                    <span className="text-text-primary">{e.event.announcement_date}</span>{" "}
                    announcement
                  </>
                )}
              </p>
            )}
          </div>

          {e.event.key_metrics && e.event.key_metrics.length > 0 && (
            <div className="grid grid-cols-2 divide-x divide-hairline">
              {e.event.key_metrics.slice(0, 2).map((m) => (
                <div key={m.label} className="p-5">
                  <div className="mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                    {m.label}
                  </div>
                  <div
                    className={`mono mt-1 text-[28px] font-semibold leading-none ${
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
          )}

          {e.sources && e.sources.length > 0 && (
            <div className="border-t border-hairline p-4">
              <p className="mono text-[11.5px] text-text-secondary">
                Reported by <span className="text-text-primary">{e.sources.join(", ")}</span> —{" "}
                <span className={sourcesAgree ? "text-teal" : "text-amber"}>
                  {sourcesAgree ? "multiple sources agree" : "sources disagree"}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      {e.summary && (
        <section className="mt-10">
          <SectionTitle n="01" title="Summary" />
          <p className="max-w-3xl text-[14.5px] leading-relaxed text-text-primary">{e.summary}</p>
        </section>
      )}

      {isBreaking && (
        <section className="mt-6 border-l-2 border-red bg-red/10 p-4">
          <div className="mono text-[10px] uppercase tracking-[0.16em] text-red">
            Market reaction still forming
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-text-primary">
            Full analysis appears as price data matures. Below you'll find the timeline and
            companies mentioned in reporting.
          </p>
        </section>
      )}
      {isDeveloping && (
        <section className="mt-6 border-l-2 border-amber bg-amber/10 p-4">
          <div className="mono text-[10px] uppercase tracking-[0.16em] text-amber">
            Developing — provisional numbers
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-text-primary">
            Partial reaction shown. Significance flags are marked provisional and may change as
            more price data accumulates.
          </p>
        </section>
      )}

      {e.timeline && e.timeline.length > 0 && (
        <section className="mt-10">
          <SectionTitle n="02" title="Event timeline" sub="key moments" />
          <Timeline entries={e.timeline} />
        </section>
      )}

      <section className="mt-10">
        <SectionTitle n="03" title="How to read this" />
        <div className="border border-hairline bg-panel p-4">
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Each sector below is a basket of named stocks. The percentage shown is the move{" "}
            <span className="text-text-primary">beyond the overall market (S&amp;P 500)</span> —
            what event studies call the{" "}
            <InfoTooltip
              term="cumulative abnormal return"
              definition="The stock or sector's return minus the market's return, added up across the window. It isolates the piece of the move that isn't explained by the broad market."
            >
              cumulative abnormal return
            </InfoTooltip>
            . A move only counts as{" "}
            <InfoTooltip
              term="statistically significant"
              definition="A move large enough that it can't reasonably be explained by ordinary week-to-week variation in that basket. Anything inside normal noise is greyed out."
            >
              statistically significant
            </InfoTooltip>{" "}
            when it sits clearly outside that basket's normal weekly swings.
          </p>
        </div>
      </section>

      {(showChart || showReactionBars) && (
        <section className="mt-10">
          <SectionTitle n="04" title="Market reaction" sub="vs S&P 500" />

          {showChart && e.timeseries && (
            <div className="mb-4">
              <TimeseriesChart ts={e.timeseries} />
              <p className="mono mt-2 text-[10.5px] text-text-muted">
                Path over time. Click a sector in the legend to toggle it. Dashed lines mark key moments.
              </p>
            </div>
          )}

          {showReactionBars ? (
            <div className="border border-hairline bg-panel">
              <div className="hidden md:grid grid-cols-12 gap-3 border-b border-hairline px-3 py-2">
                <div className="col-span-4 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
                  Sector / basket
                </div>
                <div className="col-span-5 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted">
                  <div className="flex justify-between">
                    <span>← loss</span>
                    <span>0</span>
                    <span>gain →</span>
                  </div>
                </div>
                <div className="col-span-3 mono text-[9.5px] uppercase tracking-[0.16em] text-text-muted text-right">
                  First-week move · significance
                </div>
              </div>
              {e.reaction.map((r) => (
                <ReactionBar
                  key={r.sector}
                  row={isDeveloping ? { ...r, provisional: true } : r}
                />
              ))}
            </div>
          ) : (
            !showChart && (
              <div className="border border-dashed border-hairline bg-panel/50 p-6 text-center">
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                  Reaction chart unavailable — data still forming
                </p>
              </div>
            )
          )}

          {!isBreaking && e.lasting_finding && (
            <div className="mt-4 border-l-2 border-amber bg-amber/5 p-4">
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-amber">
                Lasting finding
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-text-primary">
                {e.lasting_finding}
              </p>
            </div>
          )}
        </section>
      )}

      {e.historical && e.historical.length > 0 && (
        <section className="mt-10">
          <SectionTitle n="05" title="Historical context" sub="usual pattern vs this event" />
          <div className="overflow-x-auto border border-hairline">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-panel">
                <tr className="border-b border-hairline">
                  <th className="mono px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-text-muted font-normal">Sector</th>
                  <th className="mono px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-text-muted font-normal">Usual pattern</th>
                  <th className="mono px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-text-muted font-normal">This event</th>
                  <th className="mono px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-text-muted font-normal text-center">Match</th>
                </tr>
              </thead>
              <tbody>
                {e.historical.map((h) => (
                  <tr key={h.sector} className="border-b border-hairline/60 last:border-b-0">
                    <td className="px-4 py-2.5 text-text-primary">{h.sector}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{h.usual}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{h.this_event}</td>
                    <td className="px-4 py-2.5 text-center">
                      {h.match ? <span className="mono text-teal">✓</span> : <span className="mono text-text-muted">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {e.historical_precedents && e.historical_precedents.length > 0 && (
        <section className="mt-10">
          <SectionTitle n="06" title="Historical precedents" sub="click to expand" />
          <PrecedentsList items={e.historical_precedents} />
        </section>
      )}

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {!isBreaking && e.companies_affected && e.companies_affected.length > 0 && (
          <div>
            <SectionTitle n="07a" title="Companies most affected" sub="measured moves" />
            <CompanyCards items={e.companies_affected} />
          </div>
        )}
        {inNews.length > 0 && (
          <div
            className={
              isBreaking || !e.companies_affected?.length ? "md:col-span-2" : ""
            }
          >
            <SectionTitle
              n={isBreaking || !e.companies_affected?.length ? "07" : "07b"}
              title="Companies mentioned in reporting"
              sub="named in coverage — NOT a measured market move"
            />
            <ul className="divide-y divide-hairline border border-hairline">
              {inNews.map((c) => (
                <li key={c.name} className="flex items-center justify-between px-3 py-2">
                  <span className="text-[13px] text-text-primary">{c.name}</span>
                  <span className="mono text-[11.5px] text-text-muted">{c.right}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-10 border border-hairline bg-panel p-5">
        {e.confidence && (
          <>
            <div className="mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
              Confidence
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{e.confidence}</p>
          </>
        )}
        <div className={`${e.confidence ? "mt-4 border-t border-hairline pt-3" : ""}`}>
          <p className="mono text-[11px] text-text-muted">{e.disclaimer}</p>
        </div>
      </section>
    </Chrome>
  );
}