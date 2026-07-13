import { createFileRoute } from "@tanstack/react-router";
import { Chrome } from "@/components/chokepoint/Chrome";

export const Route = createFileRoute("/build-notes")({
  head: () => ({
    meta: [
      { title: "Build Notes · Aftershock" },
      {
        name: "description",
        content:
          "The architecture behind Aftershock, and the real decisions that shaped it. Written in an engineering voice, unhedged.",
      },
      { property: "og:title", content: "Build Notes · Aftershock" },
      {
        property: "og:description",
        content:
          "The architecture behind Aftershock, and the real decisions that shaped it.",
      },
    ],
  }),
  component: BuildNotesPage,
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
    <section id={id} className="mt-12 scroll-mt-24">
      <div className="mb-4 flex items-baseline gap-3 border-b border-hairline pb-2">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {n}
        </span>
        <h2 className="display text-[20px] tracking-wide text-bone">{title}</h2>
      </div>
      <div className="max-w-3xl space-y-3 text-[14.5px] leading-relaxed text-text-primary">
        {children}
      </div>
    </section>
  );
}

function BuildNotesPage() {
  return (
    <Chrome>
      <div className="border border-hairline bg-panel p-6">
        <div className="mono text-[10.5px] uppercase tracking-[0.18em] text-signal">
          Build Notes
        </div>
        <h1 className="display mt-2 text-[32px] tracking-tight text-bone">
          What's Under The Hood
        </h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
          A written record of how Aftershock is built, and why it was built this
          way. Every decision below shaped a specific failure mode we hit and
          fixed.
        </p>
      </div>

      <Section n="01" title="The Stack">
        <p>
          A Python event-study engine using pandas and yfinance does the
          measurement. Supabase PostgreSQL stores every event, every measurement,
          and every precedent. GitHub Actions runs the pipeline unattended on a
          schedule. The Anthropic API handles event detection and precedent
          research. A React frontend reads directly from the database. There is
          no application server to maintain, no queue, no cache to invalidate.
        </p>
      </Section>

      <Section n="02" title="Why The Information Date Matters">
        <p>
          This is the single most consequential decision in the engine. When we
          measured the Strait of Hormuz closure, the obvious anchor was the day
          Iran officially announced it. That is the date in every news archive.
          It was wrong. Markets had already repriced days earlier, when the
          strikes began.
        </p>
        <p>
          Moving the anchor to the information date, the first day markets could
          plausibly have known, flipped the results entirely. Sectors recorded as
          unaffected turned out to have moved significantly. Sectors that
          appeared to react had not. In event studies the hardest question is
          not what you measure. It is when you start measuring.
        </p>
      </Section>

      <Section n="03" title="Why Precedents Get Rejected">
        <p>
          When the system researches a historical precedent, it measures it with
          the same engine that measures live events, then tests whether the
          result holds up. If an oil supply shock produced falling oil prices,
          either the date is wrong or something else dominated that window.
        </p>
        <p>
          Those precedents are discarded rather than published. A precedent that
          fails its own measurement is not evidence. The rejected count is
          reported honestly on the homepage.
        </p>
      </Section>

      <Section n="04" title="Why Detection Runs On A Schedule">
        <p>
          Detection could run on demand, triggered by a user. It does not.
          Measuring an event takes minutes, the API costs money, and a stranger
          clicking refresh repeatedly would burn credits for no benefit.
        </p>
        <p>
          The pipeline runs on a cron schedule, writes to the database, and the
          site reads from it. The frontend stays a static read layer. This makes
          the site cheap, fast, and predictable.
        </p>
      </Section>

      <Section n="05" title="The Event Lifecycle">
        <p>
          An event enters as{" "}
          <span className="text-alert">Breaking</span>. There is no market
          reaction to measure yet, so the report draws on measured historical
          precedents instead.
        </p>
        <p>
          At ten days it becomes{" "}
          <span className="text-signal">Developing</span> and the snap window is
          measured. Significance is flagged provisional while the window is
          partial.
        </p>
        <p>
          At thirty five days it becomes{" "}
          <span className="text-verdigris">Settled</span> and the full window is
          complete. Settled events then serve as precedents for future breaking
          events. The archive teaches itself.
        </p>
      </Section>
    </Chrome>
  );
}