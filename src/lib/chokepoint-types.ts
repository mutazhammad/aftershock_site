export type Tone = "gain" | "loss" | "neutral";
export type Status = "confirmed" | "disputed";
export type Recency = "breaking" | "developing" | "settled";

export interface KeyMetric {
  label: string;
  value: string;
  tone: Tone;
}

export interface ReactionRow {
  sector: string;
  tickers: string;
  pct: string;
  significant: boolean;
  tone: Exclude<Tone, "neutral">;
}

export interface HistoricalRow {
  sector: string;
  usual: string;
  this_event: string;
  match: boolean;
}

export interface CompanyAffected {
  ticker: string;
  tone: Exclude<Tone, "neutral">;
  name?: string;
  sector?: string;
  role?: string;
  move_pct?: string;
}

export interface CompanyNamed {
  name: string;
  amount: string;
}

export interface EventRecord {
  id: string;
  location?: {
    name: string;
    region: "gulf" | "taiwan" | "redsea" | "eastern-europe" | "saudi" | "generic";
  };
  event: {
    name: string;
    information_date: string;
    announcement_date: string;
    type_label: string;
    key_metrics: KeyMetric[];
  };
  sources: string[];
  sources_agree?: boolean;
  status: Status;
  recency: Recency;
  summary: string;
  timeline?: TimelineEntry[];
  timeseries?: TimeSeries;
  reaction: ReactionRow[];
  lasting_finding: string;
  historical: HistoricalRow[];
  companies_affected: CompanyAffected[];
  companies_named: CompanyNamed[];
  historical_precedents?: HistoricalPrecedent[];
  confidence: string;
  disclaimer: string;
}

export interface TimelineEntry {
  datetime: string;
  headline: string;
  detail: string;
  source: string;
}

export interface TimeSeries {
  days: number[];
  series: { sector: string; values: number[] }[];
  markers: { day: number; label: string }[];
}

export interface HistoricalPrecedent {
  id?: string;
  name: string;
  date: string;
  why_similar: string;
  measured: boolean;
  mini: {
    summary: string;
    key_moves: { label: string; pct: string; timeframe: string; tone: Exclude<Tone, "neutral"> }[];
  };
}