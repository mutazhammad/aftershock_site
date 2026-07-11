import type { EventRecord } from "./chokepoint-types";

const SUPABASE_URL = "https://mgxsiipbfhrnsxpprclc.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_mrvuRrbQoQ1X10mf135cBA_JVwgC8tU";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export interface FeedItem {
  id: string;
  name: string;
  type_label: string;
  information_date: string; // YYYY-MM-DD
  status: "confirmed" | "disputed";
  recency: "breaking" | "developing" | "settled";
  region: string;
}

/** Format YYYY-MM-DD as "27 Feb 2026" — stable across server/client. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [_, y, mo, d] = m;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(d, 10)} ${months[parseInt(mo, 10) - 1]} ${y}`;
}

export async function fetchFeed(): Promise<FeedItem[]> {
  const url = `${SUPABASE_URL}/rest/v1/events?select=id,name,type_label,information_date,status,recency,region&order=information_date.desc`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  return (await res.json()) as FeedItem[];
}

/** Normalize a DB record's `data` jsonb into the shape our components already consume. */
export function normalizeRecord(id: string, raw: any): EventRecord {
  const ts = raw.timeseries
    ? {
        days: raw.timeseries.days ?? [],
        markers: raw.timeseries.markers ?? [],
        series: (raw.timeseries.series ?? []).map((s: any) => ({
          sector: s.sector,
          values: s.values ?? s.car_path ?? [],
        })),
      }
    : undefined;

  return {
    id,
    location: raw.location
      ? {
          name: raw.location.region ?? "",
          region: (raw.location.region ?? "generic") as any,
          center: raw.location.center,
          zoom: raw.location.zoom,
        }
      : undefined,
    event: {
      name: raw.event?.name ?? "",
      information_date: formatDate(raw.event?.information_date ?? ""),
      announcement_date: formatDate(raw.event?.announcement_date ?? ""),
      type_label: raw.event?.type_label ?? "",
      key_metrics: raw.event?.key_metrics ?? [],
    },
    sources: raw.sources ?? [],
    sources_agree: raw.sources_agree,
    status: raw.status,
    recency: raw.recency,
    summary: raw.summary ?? "",
    why_significant: raw.why_significant ?? "",
    timing_note: raw.timing_note ?? "",
    date_explanation: raw.date_explanation ?? "",
    timeline: raw.timeline ?? [],
    timeseries: ts,
    reaction: raw.reaction ?? [],
    volatility: raw.volatility ?? undefined,
    phases: raw.phases ?? [],
    lasting_finding: raw.lasting_finding ?? "",
    historical: raw.historical ?? [],
    companies_affected: raw.companies_affected ?? [],
    companies_named: raw.companies_named ?? [],
    companies_in_news: raw.companies_in_news ?? [],
    historical_precedents: raw.historical_precedents ?? [],
    matched_precedents: raw.matched_precedents ?? [],
    precedent_expectation: raw.precedent_expectation ?? undefined,
    confidence: raw.confidence ?? "",
    disclaimer:
      raw.disclaimer ??
      "This tool informs your decision. It does not give investment advice.",
  } as EventRecord;
}

export async function fetchEvent(id: string): Promise<EventRecord | null> {
  const url = `${SUPABASE_URL}/rest/v1/events?select=id,data&id=eq.${encodeURIComponent(id)}&limit=1`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Event fetch failed: ${res.status}`);
  const rows = (await res.json()) as { id: string; data: any }[];
  if (!rows.length) return null;
  return normalizeRecord(rows[0].id, rows[0].data ?? {});
}

/** Fetch a batch of precedent ids. Look in curated_precedents first, then fall back to events. */
export async function fetchPrecedents(ids: string[]): Promise<EventRecord[]> {
  if (!ids || ids.length === 0) return [];
  const idList = ids.map((i) => `"${i}"`).join(",");
  const curatedUrl = `${SUPABASE_URL}/rest/v1/curated_precedents?select=id,data&id=in.(${idList})`;
  const curatedRes = await fetch(curatedUrl, { headers: HEADERS });
  const curated: { id: string; data: any }[] = curatedRes.ok ? await curatedRes.json() : [];
  const foundIds = new Set(curated.map((r) => r.id));
  const missing = ids.filter((i) => !foundIds.has(i));
  let fallback: { id: string; data: any }[] = [];
  if (missing.length) {
    const missList = missing.map((i) => `"${i}"`).join(",");
    const evUrl = `${SUPABASE_URL}/rest/v1/events?select=id,data&id=in.(${missList})`;
    const evRes = await fetch(evUrl, { headers: HEADERS });
    fallback = evRes.ok ? await evRes.json() : [];
  }
  const all = [...curated, ...fallback];
  // preserve requested order
  return ids
    .map((id) => all.find((r) => r.id === id))
    .filter((r): r is { id: string; data: any } => !!r)
    .map((r) => normalizeRecord(r.id, r.data ?? {}));
}