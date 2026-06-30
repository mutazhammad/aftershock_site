import type { EventRecord } from "./chokepoint-types";

export const EVENTS: EventRecord[] = [
  {
    id: "hormuz-2026",
    event: {
      name: "Strait of Hormuz closure",
      information_date: "28 Feb 2026",
      announcement_date: "4 Mar 2026",
      type_label: "energy supply shock",
      key_metrics: [
        { label: "Brent oil", value: "$126", tone: "neutral" },
        { label: "S&P 500", value: "-2.2%", tone: "loss" },
      ],
    },
    sources: ["IRGC", "Reuters", "vessel-tracking"],
    sources_agree: true,
    status: "confirmed",
    recency: "settled",
    summary:
      "When the Strait closed, oil, shipping, defense and gold stocks rose and airlines fell — the textbook reaction to an energy-supply shock. The moves pointed the right way but over the first week most were within normal market swings. The one clear, lasting effect was a ~9% drop in airline stocks that held for weeks. Energy and gold gains faded after the 8 April ceasefire.",
    reaction: [
      { sector: "Oil tanker operators", tickers: "STNG, FRO, INSW", pct: "+6.2%", significant: false, tone: "gain" },
      { sector: "Oil & gas producers", tickers: "XOM, CVX, COP", pct: "+3.2%", significant: false, tone: "gain" },
      { sector: "Defense contractors", tickers: "LMT, RTX, NOC", pct: "+2.6%", significant: false, tone: "gain" },
      { sector: "Gold", tickers: "GLD", pct: "+2.1%", significant: false, tone: "gain" },
      { sector: "Airline stocks", tickers: "DAL, UAL, AAL", pct: "-9.0%", significant: true, tone: "loss" },
    ],
    lasting_finding:
      "Over the following weeks airline stocks fell about 9% and stayed down — the only move large and consistent enough to be reliable.",
    historical: [
      { sector: "Oil & gas", usual: "Rises (supply fear)", this_event: "Rose", match: true },
      { sector: "Defense", usual: "Rises (conflict)", this_event: "Rose", match: true },
      { sector: "Gold", usual: "Rises (safe haven)", this_event: "Rose", match: true },
      { sector: "Airlines", usual: "Falls (fuel cost)", this_event: "Fell", match: true },
      { sector: "Tankers", usual: "Mixed (route-dependent)", this_event: "Rose", match: false },
    ],
    companies_affected: [
      { ticker: "STNG", tone: "gain" },
      { ticker: "XOM", tone: "gain" },
      { ticker: "LMT", tone: "gain" },
      { ticker: "GLD", tone: "gain" },
      { ticker: "JETS", tone: "loss" },
    ],
    companies_named: [
      { name: "Lockheed Martin", amount: "$1.3B" },
      { name: "RTX", amount: "$1.0B" },
      { name: "Northrop Grumman", amount: "$0.7B" },
    ],
    confidence:
      "Few directly comparable past events; figures strip out the market's own move; the short one-week window limits how reliably small moves can be judged.",
    disclaimer: "This tool informs your decision. It does not give investment advice.",
  },
  {
    id: "taiwan-semis-2026",
    event: {
      name: "Taiwan semiconductor export controls",
      information_date: "12 Jun 2026",
      announcement_date: "18 Jun 2026",
      type_label: "supply chain disruption",
      key_metrics: [
        { label: "SOX index", value: "-4.8%", tone: "loss" },
        { label: "TSMC ADR", value: "-7.1%", tone: "loss" },
      ],
    },
    sources: ["MOEA Taiwan", "Bloomberg", "Nikkei"],
    sources_agree: true,
    status: "confirmed",
    recency: "developing",
    summary:
      "New export licensing on leading-edge chips out of Taiwan rattled global semiconductor names. Memory and equipment makers fell broadly; domestic US fab projects and analog chipmakers held up better. Most moves were inside normal swings, but the foundry-exposed basket showed a clear, lasting drop.",
    reaction: [
      { sector: "Foundry-exposed semis", tickers: "TSM, ASML, AMAT", pct: "-7.4%", significant: true, tone: "loss" },
      { sector: "Memory makers", tickers: "MU, WDC", pct: "-3.8%", significant: false, tone: "loss" },
      { sector: "US fab build-out", tickers: "INTC, GFS", pct: "+2.1%", significant: false, tone: "gain" },
      { sector: "Analog chips", tickers: "TXN, ADI", pct: "-0.9%", significant: false, tone: "loss" },
      { sector: "Defense electronics", tickers: "LMT, RTX", pct: "+1.4%", significant: false, tone: "gain" },
    ],
    lasting_finding:
      "The foundry-exposed basket stayed roughly 7% below its pre-event level four weeks on — the only move that survived noise filtering.",
    historical: [
      { sector: "Foundries", usual: "Falls (revenue risk)", this_event: "Fell", match: true },
      { sector: "Memory", usual: "Falls (demand fear)", this_event: "Fell", match: true },
      { sector: "US fabs", usual: "Rises (substitution)", this_event: "Rose", match: true },
      { sector: "Analog", usual: "Mixed", this_event: "Fell", match: false },
    ],
    companies_affected: [
      { ticker: "TSM", tone: "loss" },
      { ticker: "ASML", tone: "loss" },
      { ticker: "MU", tone: "loss" },
      { ticker: "INTC", tone: "gain" },
    ],
    companies_named: [
      { name: "TSMC", amount: "—" },
      { name: "ASML", amount: "—" },
    ],
    confidence:
      "Policy details still emerging; numbers strip out the market's own move; comparison set of past export-control events is small.",
    disclaimer: "This tool informs your decision. It does not give investment advice.",
  },
  {
    id: "redsea-shipping-2026",
    event: {
      name: "Red Sea shipping disruption escalates",
      information_date: "9 May 2026",
      announcement_date: "11 May 2026",
      type_label: "shipping route disruption",
      key_metrics: [
        { label: "Container rates", value: "+38%", tone: "gain" },
        { label: "MSCI World", value: "-0.4%", tone: "loss" },
      ],
    },
    sources: ["IMB", "Maersk", "vessel-tracking"],
    sources_agree: false,
    status: "disputed",
    recency: "breaking",
    summary:
      "Attacks on commercial shipping forced longer routings around the Cape. Container lines and tanker operators rose; consumer-goods importers softened. Sources disagree on the duration of disruption and whether spot rates will hold.",
    reaction: [
      { sector: "Container lines", tickers: "MAERSK, ZIM, HLAG", pct: "+11.2%", significant: true, tone: "gain" },
      { sector: "Tanker operators", tickers: "STNG, FRO", pct: "+4.6%", significant: false, tone: "gain" },
      { sector: "Marine insurance", tickers: "RNR, AXS", pct: "+2.0%", significant: false, tone: "gain" },
      { sector: "Consumer goods importers", tickers: "TGT, BBY", pct: "-1.8%", significant: false, tone: "loss" },
      { sector: "Airlines (freight)", tickers: "FDX, UPS", pct: "+0.6%", significant: false, tone: "gain" },
    ],
    lasting_finding:
      "Container-line gains were large and consistent across operators — the cleanest signal. Other moves were within ordinary weekly swings.",
    historical: [
      { sector: "Container lines", usual: "Rises (rate spike)", this_event: "Rose", match: true },
      { sector: "Tankers", usual: "Mixed", this_event: "Rose", match: false },
      { sector: "Importers", usual: "Falls (cost pass-through)", this_event: "Fell", match: true },
    ],
    companies_affected: [
      { ticker: "ZIM", tone: "gain" },
      { ticker: "MAERSK-B", tone: "gain" },
      { ticker: "TGT", tone: "loss" },
    ],
    companies_named: [
      { name: "A.P. Moller-Maersk", amount: "—" },
      { name: "Hapag-Lloyd", amount: "—" },
    ],
    confidence:
      "Sources disagree on disruption length; one week of price data is a short window; container-rate index methodology varies by provider.",
    disclaimer: "This tool informs your decision. It does not give investment advice.",
  },
];

export const EVENT_FAMILIES = [
  "all",
  "energy supply shock",
  "supply chain disruption",
  "shipping route disruption",
] as const;

export type EventFamily = (typeof EVENT_FAMILIES)[number];

export function getEvent(id: string): EventRecord | undefined {
  return EVENTS.find((e) => e.id === id);
}