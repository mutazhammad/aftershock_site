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
}

export interface CompanyNamed {
  name: string;
  amount: string;
}

export interface EventRecord {
  id: string;
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
  reaction: ReactionRow[];
  lasting_finding: string;
  historical: HistoricalRow[];
  companies_affected: CompanyAffected[];
  companies_named: CompanyNamed[];
  confidence: string;
  disclaimer: string;
}