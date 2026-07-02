import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chokepoint/Chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chokepoint — Measured, not guessed" },
      {
        name: "description",
        content:
          "Chokepoint measures how major geopolitical events have historically affected financial markets, and flags when the data can't give a reliable answer.",
      },
      { property: "og:title", content: "Chokepoint" },
      {
        property: "og:description",
        content: "How geopolitical events move markets — measured, not guessed.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <Chrome>
      {/* Hero */}
      <section className="border border-hairline bg-panel p-8 md:p-12">
        <div className="mono text-[10.5px] uppercase tracking-[0.18em] text-amber">
          Geopolitical market intelligence
        </div>
        <h1 className="mt-3 text-[36px] md:text-[56px] font-semibold leading-[1.02] tracking-tight">
          Panic is not a strategy.
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] md:text-[17px] leading-relaxed text-text-primary">
          When war, sanctions, or a blockade rattles the market, Chokepoint shows you which sectors
          win, which lose, and what history says happens next, so your next move is informed
          instead of reactive.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/events"
            className="mono inline-flex items-center gap-2 border border-amber bg-amber/10 px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] text-amber transition-colors hover:bg-amber/20"
          >
            View the events →
          </Link>
          <Link
            to="/methodology"
            className="mono inline-flex items-center gap-2 border border-hairline px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-amber/40 hover:text-amber"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <SectionHeader n="01" title="How it works" />
        <ol className="grid gap-3 md:grid-cols-2">
          {[
            { n: "1", t: "A geopolitical event happens.", d: "News breaks — a chokepoint closes, controls are imposed, hostilities escalate." },
            { n: "2", t: "We measure how each market sector actually moved.", d: "For each sector basket we strip out the overall market's move — isolating the event's effect from noise." },
            { n: "3", t: "We compare it to how similar past events behaved.", d: "Every measured event is checked against historical precedents with a comparable pattern." },
            { n: "4", t: "We show what's statistically reliable — and flag what's just noise.", d: "Moves inside normal weekly swings are greyed out. Only clear signals get the full treatment." },
          ].map((s) => (
            <li key={s.n} className="border border-hairline bg-panel p-4">
              <div className="mono text-[10.5px] uppercase tracking-[0.16em] text-amber">
                Step {s.n}
              </div>
              <div className="mt-1 text-[14.5px] font-semibold text-text-primary">{s.t}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* What makes it different */}
      <section className="mt-10">
        <SectionHeader n="02" title="What makes it different" />
        <div className="border border-hairline bg-panel p-5 md:p-6">
          <p className="max-w-3xl text-[14.5px] leading-relaxed text-text-primary">
            Chokepoint only shows what the data actually supports: real measured reactions, not
            guesses. When an event's market impact is too unclear to call, it tells you that too.
            <span className="text-text-secondary"> No hype, no false certainty.</span>
          </p>
        </div>
      </section>

      <section className="mt-10 border border-hairline bg-panel p-5">
        <p className="mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
          Ready to look at real events?
        </p>
        <Link
          to="/events"
          className="mono mt-2 inline-block text-[14px] text-amber hover:underline"
        >
          View the events →
        </Link>
      </section>
    </Chrome>
  );
}

function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-3 border-b border-hairline pb-2">
      <span className="mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{n}</span>
      <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

