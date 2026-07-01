import type { EventRecord } from "./chokepoint-types";

export const EVENTS: EventRecord[] = [
  {
    id: "hormuz-2026",
    location: { name: "Strait of Hormuz", region: "gulf" },
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
    timeline: [
      { datetime: "26 Feb 2026, 21:10 GMT", headline: "Vessel tracking flags anomalies", source: "vessel-tracking", detail: "Commercial tankers begin diverting mid-Gulf; open-source trackers report unusual holding patterns near the strait." },
      { datetime: "28 Feb 2026, 04:30 GMT", headline: "Reports of IRGC restrictions", source: "Reuters", detail: "Regional wires cite Iranian sources describing new passage restrictions — the information date used for measurement." },
      { datetime: "1 Mar 2026, 09:00 GMT", headline: "Insurance rates spike", source: "Lloyd's List", detail: "War-risk premiums for VLCCs transiting Hormuz jump more than 4x within a session." },
      { datetime: "4 Mar 2026, 12:00 GMT", headline: "Formal closure announced", source: "IRGC", detail: "Official announcement — markets had already repriced by this point." },
      { datetime: "18 Mar 2026, 16:00 GMT", headline: "Partial transit resumes under escort", source: "Reuters", detail: "Convoy escorts restart limited traffic; oil retraces about half its move." },
      { datetime: "8 Apr 2026, 10:30 GMT", headline: "Ceasefire announced", source: "Reuters", detail: "Energy and gold gains largely fade; airline weakness persists." },
    ],
    timeseries: {
      days: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30],
      markers: [
        { day: 0, label: "Information date" },
        { day: 5, label: "Formal announcement" },
        { day: 27, label: "Ceasefire" },
      ],
      series: [
        { sector: "Oil tanker operators", values: [0, 0.2, 0.4, 0.9, 1.6, 2.8, 4.1, 5.0, 5.6, 6.0, 6.2, 5.4, 4.1, 3.0, 2.2, 1.4] },
        { sector: "Oil & gas producers", values: [0, 0.1, 0.3, 0.6, 1.1, 1.8, 2.4, 2.7, 3.0, 3.1, 3.2, 2.7, 1.9, 1.2, 0.6, 0.1] },
        { sector: "Defense contractors", values: [0, 0.1, 0.2, 0.5, 0.9, 1.4, 1.9, 2.2, 2.4, 2.5, 2.6, 2.4, 2.0, 1.5, 1.1, 0.9] },
        { sector: "Gold", values: [0, 0.1, 0.2, 0.5, 0.9, 1.3, 1.6, 1.8, 2.0, 2.1, 2.1, 1.8, 1.3, 0.9, 0.5, 0.2] },
        { sector: "Airline stocks", values: [0, -0.2, -0.5, -1.4, -3.0, -4.6, -6.2, -7.4, -8.2, -8.7, -9.0, -9.2, -9.1, -8.9, -8.6, -8.5] },
      ],
    },
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
      { ticker: "STNG", name: "Scorpio Tankers", sector: "Oil tanker operators", role: "Product tanker fleet — direct beneficiary of longer average voyage lengths as cargoes reroute.", move_pct: "+8.4%", tone: "gain" },
      { ticker: "XOM", name: "ExxonMobil", sector: "Oil & gas producers", role: "Large integrated producer; benefits from higher Brent even without direct Gulf exposure.", move_pct: "+4.1%", tone: "gain" },
      { ticker: "LMT", name: "Lockheed Martin", sector: "Defense contractors", role: "Prime contractor for missile-defense systems reinforcing regional partners.", move_pct: "+3.2%", tone: "gain" },
      { ticker: "GLD", name: "SPDR Gold Trust", sector: "Precious metals", role: "Safe-haven flows during a live energy shock.", move_pct: "+2.4%", tone: "gain" },
      { ticker: "JETS", name: "US Global Jets ETF", sector: "Airlines", role: "Fuel is the single largest variable cost — jet-fuel crack widened sharply.", move_pct: "-9.0%", tone: "loss" },
    ],
    companies_named: [
      { name: "Lockheed Martin", amount: "$1.3B" },
      { name: "RTX", amount: "$1.0B" },
      { name: "Northrop Grumman", amount: "$0.7B" },
    ],
    historical_precedents: [
      {
        name: "Abqaiq–Khurais attack",
        date: "Sep 2019",
        why_similar: "Sudden, credible threat to Gulf oil supply; markets repriced before official confirmation.",
        measured: false,
        mini: {
          summary: "Brent gapped ~15% at the open, oil producers rallied, airlines fell. Most of the move retraced within two weeks as Saudi capacity was restored faster than feared.",
          key_moves: [
            { label: "Brent crude", pct: "+14.6%", timeframe: "1 day", tone: "gain" },
            { label: "Oil & gas producers", pct: "+4.2%", timeframe: "1 week", tone: "gain" },
            { label: "Airlines", pct: "-3.1%", timeframe: "1 week", tone: "loss" },
          ],
        },
      },
      {
        name: "Gulf War I onset",
        date: "Aug 1990",
        why_similar: "Direct threat to Gulf shipping and production; sustained energy-price re-rating.",
        measured: false,
        mini: {
          summary: "Oil roughly doubled over the following two months; airlines and consumer discretionary underperformed for the balance of the year.",
          key_moves: [
            { label: "Brent crude", pct: "+95%", timeframe: "8 weeks", tone: "gain" },
            { label: "Airlines", pct: "-22%", timeframe: "8 weeks", tone: "loss" },
            { label: "Defense", pct: "+11%", timeframe: "8 weeks", tone: "gain" },
          ],
        },
      },
      {
        id: "redsea-shipping-2026",
        name: "Red Sea shipping disruption",
        date: "May 2026",
        why_similar: "Chokepoint disruption forcing rerouting; container and tanker rates spike.",
        measured: true,
        mini: {
          summary: "Container lines rose sharply and consistently; other reactions stayed within normal weekly swings.",
          key_moves: [
            { label: "Container lines", pct: "+11.2%", timeframe: "1 week", tone: "gain" },
            { label: "Tankers", pct: "+4.6%", timeframe: "1 week", tone: "gain" },
            { label: "Importers", pct: "-1.8%", timeframe: "1 week", tone: "loss" },
          ],
        },
      },
    ],
    confidence:
      "Few directly comparable past events; figures strip out the market's own move; the short one-week window limits how reliably small moves can be judged.",
    disclaimer: "This tool informs your decision. It does not give investment advice.",
  },
  {
    id: "taiwan-semis-2026",
    location: { name: "Taiwan", region: "taiwan" },
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
    timeline: [
      { datetime: "10 Jun 2026, 22:15 GMT", headline: "Draft rules leak to trade press", source: "Nikkei", detail: "Draft licensing framework circulates among Taiwanese trade groups." },
      { datetime: "12 Jun 2026, 06:00 GMT", headline: "MOEA confirms scope", source: "MOEA Taiwan", detail: "Ministry confirms the leading-edge node scope — information date used for measurement." },
      { datetime: "15 Jun 2026, 13:00 GMT", headline: "Industry consultation", source: "Bloomberg", detail: "TSMC and ASML issue guidance-neutral statements pending final rules." },
      { datetime: "18 Jun 2026, 09:00 GMT", headline: "Official announcement", source: "MOEA Taiwan", detail: "Formal rules published; market had already repriced foundry names." },
      { datetime: "25 Jun 2026, 14:00 GMT", headline: "US fab subsidies expanded", source: "Reuters", detail: "US domestic fab basket outperforms as substitution narrative firms up." },
    ],
    timeseries: {
      days: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30],
      markers: [
        { day: 0, label: "Information date" },
        { day: 4, label: "Announcement" },
        { day: 9, label: "US subsidy expansion" },
      ],
      series: [
        { sector: "Foundry-exposed semis", values: [0, -0.3, -0.9, -2.0, -3.6, -5.2, -6.4, -7.0, -7.3, -7.4, -7.4, -7.2, -7.0, -6.9, -6.8, -6.7] },
        { sector: "Memory makers", values: [0, -0.2, -0.5, -1.2, -2.0, -2.8, -3.3, -3.6, -3.7, -3.8, -3.8, -3.4, -2.9, -2.4, -2.0, -1.6] },
        { sector: "US fab build-out", values: [0, 0.1, 0.3, 0.6, 1.0, 1.4, 1.7, 1.9, 2.0, 2.1, 2.1, 2.4, 2.6, 2.7, 2.7, 2.7] },
        { sector: "Analog chips", values: [0, -0.1, -0.2, -0.4, -0.6, -0.7, -0.8, -0.9, -0.9, -0.9, -0.9, -0.7, -0.5, -0.3, -0.2, -0.1] },
        { sector: "Defense electronics", values: [0, 0.1, 0.2, 0.4, 0.7, 1.0, 1.2, 1.3, 1.4, 1.4, 1.4, 1.3, 1.1, 0.9, 0.7, 0.5] },
      ],
    },
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
      { ticker: "TSM", name: "Taiwan Semiconductor", sector: "Foundry-exposed semis", role: "Directly named in the licensing regime; revenue exposure to controlled nodes is highest of any listed peer.", move_pct: "-7.1%", tone: "loss" },
      { ticker: "ASML", name: "ASML Holding", sector: "Foundry-exposed semis", role: "Lithography monopoly for leading-edge tooling — export licensing raises long-cycle order risk.", move_pct: "-6.8%", tone: "loss" },
      { ticker: "MU", name: "Micron Technology", sector: "Memory makers", role: "Broad demand exposure; secondary knock-on from foundry supply uncertainty.", move_pct: "-3.9%", tone: "loss" },
      { ticker: "INTC", name: "Intel", sector: "US fab build-out", role: "Direct beneficiary of the substitution narrative for domestic advanced-node capacity.", move_pct: "+2.4%", tone: "gain" },
    ],
    companies_named: [
      { name: "TSMC", amount: "—" },
      { name: "ASML", amount: "—" },
    ],
    historical_precedents: [
      {
        name: "US-China chip export controls",
        date: "Oct 2022",
        why_similar: "Leading-edge licensing shock; foundry and equipment names repriced sharply.",
        measured: false,
        mini: {
          summary: "Foundry-exposed and equipment names fell 8–12% in the first fortnight; domestic substitution beneficiaries outperformed.",
          key_moves: [
            { label: "Equipment makers", pct: "-10.4%", timeframe: "2 weeks", tone: "loss" },
            { label: "Foundries", pct: "-8.2%", timeframe: "2 weeks", tone: "loss" },
            { label: "US domestic fabs", pct: "+3.1%", timeframe: "2 weeks", tone: "gain" },
          ],
        },
      },
      {
        name: "Japan-Korea materials dispute",
        date: "Jul 2019",
        why_similar: "Chokepoint-style restriction on inputs to advanced-node production.",
        measured: false,
        mini: {
          summary: "Memory-exposed Korean names fell modestly; effect faded as substitute suppliers were qualified.",
          key_moves: [
            { label: "Memory makers", pct: "-4.6%", timeframe: "1 month", tone: "loss" },
            { label: "Materials suppliers", pct: "+6.9%", timeframe: "1 month", tone: "gain" },
          ],
        },
      },
    ],
    confidence:
      "Policy details still emerging; numbers strip out the market's own move; comparison set of past export-control events is small.",
    disclaimer: "This tool informs your decision. It does not give investment advice.",
  },
  {
    id: "redsea-shipping-2026",
    location: { name: "Red Sea / Bab el-Mandeb", region: "redsea" },
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
    timeline: [
      { datetime: "7 May 2026, 03:00 GMT", headline: "Multiple bulker incidents", source: "IMB", detail: "Piracy Reporting Centre logs coordinated approaches in the southern Red Sea." },
      { datetime: "9 May 2026, 08:00 GMT", headline: "Maersk suspends transits", source: "Maersk", detail: "Major carrier pauses Red Sea transits — information date used for measurement." },
      { datetime: "10 May 2026, 15:00 GMT", headline: "Spot container rates jump", source: "Drewry", detail: "Shanghai–Rotterdam spot rates print +38% week-on-week." },
      { datetime: "11 May 2026, 12:00 GMT", headline: "Public advisory issued", source: "vessel-tracking", detail: "Government maritime advisories go public — the formal announcement." },
      { datetime: "18 May 2026, 10:00 GMT", headline: "Sources diverge on duration", source: "Reuters / Bloomberg", detail: "Analysts split on whether spot rates hold beyond one quarter." },
    ],
    timeseries: {
      days: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30],
      markers: [
        { day: 0, label: "Information date" },
        { day: 2, label: "Announcement" },
      ],
      series: [
        { sector: "Container lines", values: [0, 0.2, 0.6, 1.4, 3.0, 5.0, 7.4, 9.0, 10.3, 10.9, 11.2, 12.1, 11.6, 10.8, 10.0, 9.4] },
        { sector: "Tanker operators", values: [0, 0.1, 0.3, 0.7, 1.3, 2.0, 2.8, 3.4, 3.9, 4.3, 4.6, 4.4, 3.9, 3.3, 2.8, 2.3] },
        { sector: "Marine insurance", values: [0, 0.1, 0.2, 0.4, 0.8, 1.1, 1.4, 1.6, 1.8, 1.9, 2.0, 2.1, 2.0, 1.9, 1.7, 1.5] },
        { sector: "Consumer goods importers", values: [0, -0.1, -0.2, -0.4, -0.7, -1.0, -1.3, -1.5, -1.7, -1.8, -1.8, -1.7, -1.5, -1.3, -1.1, -0.9] },
        { sector: "Airlines (freight)", values: [0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.6, 0.6, 0.6, 0.7, 0.7, 0.6, 0.5, 0.4] },
      ],
    },
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
      { ticker: "ZIM", name: "ZIM Integrated Shipping", sector: "Container lines", role: "High Red Sea route exposure; spot-rate leverage is the highest of listed liners.", move_pct: "+13.4%", tone: "gain" },
      { ticker: "MAERSK-B", name: "A.P. Moller-Maersk", sector: "Container lines", role: "First major carrier to publicly suspend Red Sea transits.", move_pct: "+9.8%", tone: "gain" },
      { ticker: "TGT", name: "Target Corporation", sector: "Consumer goods importers", role: "Deep exposure to Asia-Europe-US container flow; longer transits raise landed cost.", move_pct: "-2.4%", tone: "loss" },
    ],
    companies_named: [
      { name: "A.P. Moller-Maersk", amount: "—" },
      { name: "Hapag-Lloyd", amount: "—" },
    ],
    historical_precedents: [
      {
        name: "Suez Canal blockage (Ever Given)",
        date: "Mar 2021",
        why_similar: "Sudden loss of a maritime chokepoint; container rates and rerouting drove the market response.",
        measured: false,
        mini: {
          summary: "Container operators rose, tanker rates rose sharply; effect faded within weeks once the canal reopened.",
          key_moves: [
            { label: "Container lines", pct: "+6.4%", timeframe: "1 week", tone: "gain" },
            { label: "Tankers", pct: "+8.1%", timeframe: "1 week", tone: "gain" },
          ],
        },
      },
      {
        id: "hormuz-2026",
        name: "Strait of Hormuz closure",
        date: "Feb 2026",
        why_similar: "Same chokepoint template — traffic diversion, insurance-rate spike, sectoral rotation.",
        measured: true,
        mini: {
          summary: "Airlines fell durably; energy and gold gains faded after ceasefire.",
          key_moves: [
            { label: "Airlines", pct: "-9.0%", timeframe: "1 week", tone: "loss" },
            { label: "Oil & gas", pct: "+3.2%", timeframe: "1 week", tone: "gain" },
          ],
        },
      },
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