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
  t_stat?: number;
  provisional?: boolean;
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

export interface CompanyInNews {
  name: string;
  source: string;
}

export interface EventRecord {
  id: string;
  location?: {
    name: string;
    region: string;
    center?: [number, number];
    zoom?: number;
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
  why_significant?: string;
  timing_note?: string;
  date_explanation?: string;
  timeline?: TimelineEntry[];
  timeseries?: TimeSeries;
  reaction: ReactionRow[];
  volatility?: Volatility;
  phases?: Phase[];
  lasting_finding: string;
  historical: HistoricalRow[];
  companies_affected: CompanyAffected[];
  companies_named: CompanyNamed[];
  companies_in_news?: CompanyInNews[];
  historical_precedents?: HistoricalPrecedent[];
  matched_precedents?: string[];
  precedent_expectation?: PrecedentExpectation;
  confidence: string;
  disclaimer: string;
}

export interface CompanyInvolved {
  ticker: string;
  name: string;
  role: string;
  exposure: "direct" | "indirect" | "beneficiary";
}

export type NoteCategory =
  | "structural"
  | "regime"
  | "market_structure"
  | "confounding"
  | "scale"
  | "regional";

export type NoteDirection = "amplifies" | "dampens" | "uncertain";

export interface ImportantNote {
  title: string;
  category: NoteCategory;
  detail: string;
  affects?: string[];
  direction: NoteDirection;
}

export interface ImportantNotes {
  overall_applicability: string;
  notes: ImportantNote[];
}

export interface Volatility {
  vix?: {
    before?: number;
    after?: number;
    peak?: number;
    change_pct?: string;
    plain?: string;
    spiked?: boolean;
    tone?: Tone;
  };
  sectors?: {
    sector: string;
    vol_before?: string;
    vol_after?: string;
    ratio?: number;
    plain?: string;
    more_volatile?: boolean;
  }[];
}

export interface Phase {
  sector: string;
  peak_day?: number;
  peak_pct?: string;
  reverted_by_day?: number | null;
}

export interface PrecedentExpectation {
  based_on: { id: string; name: string; date: string }[];
  sector_averages: {
    sector: string;
    avg_move: string;
    n_events: number;
    direction: "gain" | "loss";
    consistency: string;
    n_significant: number;
    range_low?: number | string;
    range_high?: number | string;
    spread?: number | string;
    avg_value?: number;
  }[];
  avg_vix_change?: string | null;
  avg_volatility_ratio?: string | number | null;
  caveat: string;
  per_precedent?: PerPrecedentEntry[];
}

export interface PerPrecedentSectorMove {
  sector: string;
  move: string;
  value?: number;
  t_stat?: number;
  significant?: boolean;
}

export interface PerPrecedentEntry {
  id?: string;
  name: string;
  date?: string;
  sector_moves?: PerPrecedentSectorMove[];
  vix_change?: string | number | null;
  volatility_ratio?: string | number | null;
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
    moves?: { label: string; pct: string; t_stat?: number; tone: Exclude<Tone, "neutral"> }[];
    timeseries?: TimeSeries;
    consistency?: string;
    confounding_note?: string;
  };
}