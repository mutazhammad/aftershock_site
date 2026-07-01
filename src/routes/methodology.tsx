import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chokepoint/Chrome";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — Chokepoint" },
      {
        name: "description",
        content:
          "How Chokepoint measures market reactions to geopolitical events using event studies, information-date anchoring, and significance filtering.",
      },
      { property: "og:title", content: "Methodology — Chokepoint" },
      {
        property: "og:description",
        content: "Event studies, information-date anchoring, significance filtering, and honesty principles.",
      },
    ],
  }),
  component: MethodologyPage,
});

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
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
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">How Chokepoint measures market reactions</h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
          Chokepoint is built around one idea: geopolitical shocks leave a measurable fingerprint on
          markets, and honesty about what we do and don't know is more useful than a confident guess.
        </p>
      </div>

      <Section n="01" title="What is an event study?">
        <p>
          An event study compares how a group of related stocks moved around a specific date to how
          the overall market moved on the same days. The difference — the sector's move{" "}
          <span className="text-text-primary">beyond</span> the market — is what we call the
          abnormal return. Adding those abnormal returns across a short window gives the{" "}
          <span className="text-text-primary">cumulative abnormal return (CAR)</span>: the piece of
          the sector's move that isn't explained by the broad market.
        </p>
        <p>
          This matters because on any given week, everything moves together to some degree. Isolating
          the event's effect stops us from mistaking a rising tide for a real reaction to news.
        </p>
      </Section>

      <Section n="02" title="Why we anchor to the information date, not the announcement">
        <p>
          Markets react to information, not to press releases. By the time an announcement is issued
          the price has usually already moved — sometimes days before. If we measured from the
          announcement date we would systematically understate the reaction.
        </p>
        <p>
          Example: for the <span className="text-text-primary">Strait of Hormuz closure</span>, the
          formal announcement was on 4 March 2026. But vessel-tracking anomalies were public on 26
          February and wire reports of restrictions circulated on 28 February. Oil, tanker and
          airline stocks had already repriced by 1 March. Anchoring measurement to 28 February — the
          information date — recovers the full reaction; anchoring to 4 March would miss most of it.
        </p>
      </Section>

      <Section n="03" title="Statistical significance vs. market noise">
        <p>
          Every sector basket has its own normal weekly swing. A move only counts as{" "}
          <span className="text-text-primary">statistically significant</span> when it sits clearly
          outside that basket's usual range — big enough that we can't reasonably explain it as
          ordinary week-to-week variation.
        </p>
        <p>
          When a move isn't significant, Chokepoint greys it out and tags it "not significant". The
          direction may still be interesting, but you shouldn't rely on it. This is why our reports
          often highlight one clear signal in a sea of muted moves rather than pretending every
          reaction is meaningful.
        </p>
      </Section>

      <Section n="04" title="The honesty principle">
        <p>
          Chokepoint measures the past. It never predicts the future. When we don't have enough
          data — too few comparable events, too little price history, sources that disagree — we say
          so, in the confidence footer of each report.
        </p>
        <p>
          The tool exists to inform decisions, not to make them. It does not give investment advice.
        </p>
      </Section>

      <Section n="05" title="Lessons from building it">
        <p>
          Building Chokepoint surfaced three failure modes that were easy to miss on paper:
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
            paired with baskets whose exposures actually correspond to the shock — tanker operators
            for chokepoints, foundry-exposed semis for export controls, and so on.
          </li>
        </ul>
      </Section>

      <div className="mt-10 border border-hairline bg-panel p-5">
        <Link to="/events" className="mono text-[12px] uppercase tracking-[0.16em] text-amber hover:underline">
          View the events →
        </Link>
      </div>
    </Chrome>
  );
}