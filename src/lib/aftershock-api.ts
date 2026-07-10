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
function normalize(id: string, raw: any): EventRecord {
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
    timeline: raw.timeline ?? [],
    timeseries: ts,
    reaction: raw.reaction ?? [],
    lasting_finding: raw.lasting_finding ?? "",
    historical: raw.historical ?? [],
    companies_affected: raw.companies_affected ?? [],
    companies_named: raw.companies_named ?? [],
    companies_in_news: raw.companies_in_news ?? [],
    historical_precedents: raw.historical_precedents ?? [],
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
  return normalize(rows[0].id, rows[0].data ?? {});
}