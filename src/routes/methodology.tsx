import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chokepoint/Chrome";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology · Aftershock" },
      {
        name: "description",
        content:
          "How Aftershock measures market reactions to geopolitical events using event studies, information-date anchoring, and significance filtering.",
      },
      { property: "og:title", content: "Methodology · Aftershock" },
      {
        property: "og:description",
        content: "Event studies, information-date anchoring, significance filtering, and honesty principles.",
      },
    ],
  }),
  component: MethodologyPage,
});

function Section({
  n,
  title,
  id,
  children,
}: {
  n: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <div className="mb-3 flex items-baseline gap-3 border-b border-hairline pb-2">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{n}</span>
        <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="max-w-3xl space-y-3 text-[14px] leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

function MethodologyPage() {
  return (
    <Chrome>
      <div className="border border-hairline bg-panel p-6">
        <div className="mono text-[10.5px] uppercase tracking-[0.18em] text-amber">Methodology</div>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">How Aftershock Measures Market Reactions</h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
          Aftershock is built around one idea: geopolitical shocks leave a measurable fingerprint on
          markets, and honesty about what we do and don't know is more useful than a confident guess.
        </p>
      </div>

      <Section n="01" title="What Is An Event Study?">
        <p>
          An event study compares how a group of related stocks moved around a specific date to how
          the overall market moved on the same days. The difference, the sector's move{" "}
          <span className="text-text-primary">beyond</span> the market, is what we call the
          abnormal return. Adding those abnormal returns across a short window gives the{" "}
          <span className="text-text-primary">cumulative abnormal return (CAR)</span>: the piece of
          the sector's move that isn't explained by the broad market.
        </p>
        <p>
          This matters because on any given week, everything moves together to some degree. Isolating
          the event's effect stops us from mistaking a rising tide for a real reaction to news.
        </p>
      </Section>

      <Section n="02" id="information-date" title="Why We Anchor To The Information Date, Not The Announcement">
        <p>
          Markets react to information, not to press releases. By the time an announcement is issued
          the price has usually already moved, sometimes days before. If we measured from the
          announcement date we would systematically understate the reaction.
        </p>
        <p>
          Example: for the <span className="text-text-primary">Strait of Hormuz closure</span>, the
          formal announcement was on 4 March 2026. But vessel-tracking anomalies were public on 26
          February and wire reports of restrictions circulated on 28 February. Oil, tanker and
          airline stocks had already repriced by 1 March. Anchoring measurement to 28 February, the
          information date, recovers the full reaction; anchoring to 4 March would miss most of it.
        </p>
      </Section>

      <Section n="03" id="significance" title="Statistical Significance vs. Market Noise">
        <p>
          Every sector basket has its own normal weekly swing. A move only counts as{" "}
          <span className="text-text-primary">statistically significant</span> when it sits clearly
          outside that basket's usual range, big enough that we can't reasonably explain it as
          ordinary week-to-week variation.
        </p>
        <p>
          When a move isn't significant, Aftershock greys it out and tags it "not significant". The
          direction may still be interesting, but you shouldn't rely on it. This is why our reports
          often highlight one clear signal in a sea of muted moves rather than pretending every
          reaction is meaningful.
        </p>
      </Section>

      <Section n="04" id="volatility" title="Volatility: A Separate Signal">
        <p>
          Direction is only half the story. A sector can end the week roughly flat and still have
          traded wildly along the way, and a rising VIX tells you the whole market got scared even
          when the tape looks calm on close. Aftershock reports two volatility signals alongside the
          directional move:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>
            <span className="text-text-primary">VIX (market-wide fear).</span> The change in the
            benchmark option-implied volatility index around the event window. A sharp rise means
            investors were paying up for protection across the whole market.
          </li>
          <li>
            <span className="text-text-primary">Realized sector volatility.</span> The ratio of a
            sector's actual daily-price swings after the event to its swings before. A ratio well
            above 1× means the sector's price became noticeably more erratic, even if the
            direction ended up muted.
          </li>
        </ul>
        <p>
          Volatility answers a different question than "which way did it move", and both matter
          when sizing a decision under uncertainty.
        </p>
      </Section>

      <Section n="05" id="lifecycle" title="The Event Lifecycle: Breaking, Developing, Settled">
        <p>
          Every event moves through three states as market data accumulates:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>
            <span className="text-text-primary">Breaking.</span> The event just happened. There is
            no measurable reaction yet, so we show what similar past events actually did, clearly
            labelled as history, not a forecast.
          </li>
          <li>
            <span className="text-text-primary">Developing.</span> A partial window of price data
            exists. Reactions are shown with a "provisional" flag on the significance test.
          </li>
          <li>
            <span className="text-text-primary">Settled.</span> The full 30-day window is complete.
            The measured event now joins the precedent library and is used to inform the next
            similar shock.
          </li>
        </ul>
      </Section>

      <Section n="06" id="confounding" title="The Confounding Problem">
        <p>
          Multiple things happen every week. When a Fed decision, an earnings surprise and a
          geopolitical shock all land in the same window, a market move can't cleanly be pinned to
          one of them. Where relevant, reports flag confounding events so you can weigh the
          attribution yourself instead of assuming a single cause.
        </p>
      </Section>

      <Section n="06b" id="precedents" title="The Precedent Library">
        <p>
          Every settled event joins a library of precedents. When a new breaking event arrives, the
          engine looks up structurally similar past events and reports what actually happened in
          those windows, with the same significance tests applied to both. This is why a breaking
          report can show numbers on day one, none of them predictions, all of them measured
          history.
        </p>
        <p>
          A precedent is only kept if it passes its own measurement. When a historical parallel
          fails the same statistical test we apply to live events, it is discarded rather than
          published. What you see in a precedent list is the surviving evidence, not everything the
          engine considered.
        </p>
      </Section>

      <Section n="07" title="The Honesty Principle">
        <p>
          Aftershock measures the past. It never predicts the future. When we don't have enough
          data, too few comparable events, too little price history, sources that disagree, we say
          so, in the confidence footer of each report.
        </p>
        <p>
          The tool exists to inform decisions, not to make them. It does not give investment advice.
        </p>
      </Section>

      <Section n="08" title="Lessons From Building It">
        <p>
          Building Aftershock surfaced three failure modes that were easy to miss on paper:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>
            <span className="text-text-primary">Announcement-vs-information dates.</span> Early
            iterations measured from official announcement dates and consistently under-reported
            reactions. Switching to the information date recovered signals that had already played
            out in prices.
          </li>
          <li>
            <span className="text-text-primary">Benchmark contamination.</span> When an event is big
            enough to move the whole market, the "market" benchmark itself contains part of the
            reaction. We adjust the benchmark composition for events with wide macro impact to
            avoid subtracting the effect from itself.
          </li>
          <li>
            <span className="text-text-primary">Matching the basket to the event.</span> A generic
            "energy" basket misses the point of a shipping-route disruption. Every event type is
            paired with baskets whose exposures actually correspond to the shock, tanker operators
            for chokepoints, foundry-exposed semis for export controls, and so on.
          </li>
        </ul>
      </Section>

      <div className="mt-10 border border-hairline bg-panel p-5">
        <Link to="/events" className="mono text-[12px] uppercase tracking-[0.16em] text-amber hover:underline">
          View The Events →
        </Link>
      </div>
    </Chrome>
  );
}