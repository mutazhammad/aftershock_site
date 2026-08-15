import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RowMap } from "./RowMap";
import { Sparkline } from "./Sparkline";
import { formatDate, type FeedItem } from "@/lib/aftershock-api";

function parsePct(v: any): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace("%", "").replace("+", ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function StateGlyph({ recency }: { recency: FeedItem["recency"] }) {
  if (recency === "breaking") {
    return (
      <span className="relative inline-flex h-2.5 w-2.5" title="Breaking">
        <span className="absolute inset-0 rounded-full bg-alert opacity-70 animate-ambient" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-alert" />
      </span>
    );
  }
  if (recency === "developing") {
    return (
      <span
        className="inline-block h-2.5 w-2.5 rounded-full border border-signal"
        title="Developing"
      />
    );
  }
  return (
    <span
      className="inline-block h-2.5 w-2.5 bg-verdigris"
      title="Settled"
    />
  );
}

function SigSpan({
  sig,
  children,
}: {
  sig: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={sig ? "text-bone" : "text-ash"}
      style={sig ? { textShadow: "0 0 8px rgba(63,169,245,0.4)" } : undefined}
    >
      {children}
      {sig && <span className="mono ml-1 text-[9.5px] uppercase text-signal">SIG</span>}
    </span>
  );
}

function BreakingPreview({ data }: { data: any }) {
  const pe = data?.precedent_expectation;
  if (!pe || !pe.sector_averages?.length) {
    return <span className="text-ash">Precedent analysis pending</span>;
  }
  const sorted = [...pe.sector_averages].sort(
    (a: any, b: any) => Math.abs(parsePct(b.avg_move)) - Math.abs(parsePct(a.avg_move)),
  );
  const top = sorted[0];
  const n = pe.based_on?.length ?? pe.sector_averages.length;
  const topSig = (top.n_significant ?? 0) > 0;
  return (
    <>
      <span className="text-bone">{n} precedents measured</span>
      <span className="text-ash"> · </span>
      <SigSpan sig={topSig}>
        {top.sector} {top.avg_move} avg
      </SigSpan>
      {pe.avg_vix_change && (
        <>
          <span className="text-ash"> · </span>
          <span className="text-bone">VIX {pe.avg_vix_change} avg</span>
        </>
      )}
    </>
  );
}

function DevelopingPreview({ data }: { data: any }) {
  const reaction: any[] = data?.reaction ?? [];
  if (!reaction.length) return <span className="text-ash">Provisional data pending</span>;
  const sorted = [...reaction].sort(
    (a, b) => Math.abs(parsePct(b.pct)) - Math.abs(parsePct(a.pct)),
  );
  const top2 = sorted.slice(0, 2);
  const sigCount = reaction.filter((r) =>
    typeof r.t_stat === "number" ? Math.abs(r.t_stat) >= 2 : r.significant,
  ).length;
  return (
    <>
      <span className="text-signal">PROVISIONAL</span>
      {top2.map((r, i) => {
        const sig =
          typeof r.t_stat === "number" ? Math.abs(r.t_stat) >= 2 : !!r.significant;
        return (
          <span key={i}>
            <span className="text-ash"> · </span>
            <SigSpan sig={sig}>
              {r.sector} {r.pct}
            </SigSpan>
          </span>
        );
      })}
      <span className="text-ash"> · </span>
      <span className="text-bone">
        {sigCount} of {reaction.length} significant
      </span>
    </>
  );
}

function SettledPreview({ data }: { data: any }) {
  const reaction: any[] = data?.reaction ?? [];
  if (!reaction.length) return <span className="text-ash">No measured reaction on record</span>;
  const sorted = [...reaction].sort(
    (a, b) => Math.abs(parsePct(b.pct)) - Math.abs(parsePct(a.pct)),
  );
  const top2 = sorted.slice(0, 2);
  const ts = data?.timeseries;
  let spark: number[] | null = null;
  if (ts?.series?.length && top2[0]) {
    const s =
      ts.series.find((s: any) => s.sector === top2[0].sector) ?? ts.series[0];
    const raw = s?.values ?? s?.car_path ?? [];
    spark = raw.filter((v: any) => typeof v === "number");
  }
  return (
    <>
      <span className="text-verdigris">MEASURED</span>
      {top2.map((r, i) => {
        const sig =
          typeof r.t_stat === "number" ? Math.abs(r.t_stat) >= 2 : !!r.significant;
        return (
          <span key={i}>
            <span className="text-ash"> · </span>
            <SigSpan sig={sig}>
              {r.sector} {r.pct}
            </SigSpan>
          </span>
        );
      })}
      {spark && spark.length > 1 && (
        <span className="ml-3 inline-block align-middle">
          <Sparkline values={spark} />
        </span>
      )}
    </>
  );
}

export function FeedRow({ item, index }: { item: FeedItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = setTimeout(
              () => setEntered(true),
              Math.min(index, 12) * 40,
            );
            io.disconnect();
            return () => clearTimeout(t);
          }
        });
      },
      { rootMargin: "60px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  const d = (item as any).data ?? {};
  const center: [number, number] | undefined = d?.location?.center;
  const zoom: number | undefined = d?.location?.zoom;
  const region = d?.location?.region ?? item.region;
  const typeLabel = (item.type_label ?? "").replace(/[_-]+/g, " ").toUpperCase();

  return (
    <li
      ref={ref}
      className={`border-b border-steel transition-all duration-500 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to="/event/$id"
        params={{ id: item.id }}
        className="group relative block px-2 py-5 transition-colors hover:bg-hull/60 sm:py-6"
      >
        <RowMap center={center} zoom={zoom} hovered={hovered} />
        <div className="relative flex items-start gap-3 sm:gap-4">
          <div className="hidden pt-2 sm:block">
            <StateGlyph recency={item.recency} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mono flex flex-wrap items-center gap-x-1 text-[11px] uppercase tracking-[0.16em] text-ash sm:tracking-[0.18em]">
              <span className="sm:hidden">
                <StateGlyph recency={item.recency} />
              </span>
              <span
                className={
                  item.recency === "breaking"
                    ? "text-alert"
                    : item.recency === "developing"
                    ? "text-signal"
                    : "text-verdigris"
                }
              >
                {item.recency.toUpperCase()}
              </span>
              {` · ${formatDate(item.information_date).toUpperCase()}`}
              {typeLabel ? ` · ${typeLabel}` : ""}
              {region ? ` · ${String(region).toUpperCase()}` : ""}
            </div>
            <h2 className="display mt-2 text-[1.3rem] leading-tight text-bone group-hover:text-ice sm:text-[clamp(1.35rem,2.6vw,1.9rem)]">
              {item.name}
            </h2>
            <div className="mono mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-[12px] leading-relaxed">
              {item.recency === "breaking" && <BreakingPreview data={d} />}
              {item.recency === "developing" && <DevelopingPreview data={d} />}
              {item.recency === "settled" && <SettledPreview data={d} />}
            </div>
          </div>
          <div className="pt-3 text-[20px] text-signal opacity-40 group-hover:opacity-90 group-hover:translate-x-0.5 transition-all">
            ›
          </div>
        </div>
      </Link>
    </li>
  );
}