# Aftershock

Build a web app called "Chokepoint" — a decision-support tool for investors

that shows how geopolitical events have historically affected financial

markets. It presents measured data and analysis. It NEVER gives buy/sell

advice or recommendations anywhere.

═══ TWO SCREENS ═══

SCREEN 1 — Event feed (home page)

A scrollable list of geopolitical event cards, newest first. Each card shows:

event title, date, a type chip (e.g. "energy supply shock"), a status badge

(confirmed = teal, disputed = amber), and a recency badge (breaking /

developing / settled). A filter bar at the top (by event family) and a

Refresh button. Clicking a card opens Screen 2 for that event.

SCREEN 2 — Event analysis report (the core screen)

A professional report for ONE event, these sections top to bottom:

1. Header: event title; dates shown as "Measured from [information_date]

   (event start), not the [announcement_date] announcement"; type chip;

   status badge; two key metrics (e.g. Brent oil, S&P 500). Below: a

   "Reported by [sources] — multiple sources agree / sources disagree" line.

2. Summary: 3–4 plain-English sentences.

3. How to read this: short explainer stating each sector is a basket of

   named stocks, and the % is the move BEYOND the overall market (S&P 500).

4. Market reaction (first week): one row per sector — sector name, the

   stocks it tracks (small monospace), a horizontal bar growing from a

   center zero line (teal right = gain, red left = loss), the % move, and a

   significance tag.

   ► CRITICAL RULE: if significant → solid/full-color bar, bolder row.

     If NOT significant → muted/translucent bar + small grey

     "not significant" tag. This visual difference is essential.

   Then a highlighted callout for the lasting/significant finding.

5. Historical context: a small table — columns Sector / Usual pattern /

   This event (✓ when it matches the usual pattern).

6. Companies involved: two columns — "Companies most affected" (ticker

   chips, green ▲ / red ▼) and "Companies named in the conflict"

   (contractor name + contract $ value).

7. Confidence footer + disclaimer: "This tool informs your decision.

   It does not give investment advice."

═══ DATA MODEL ═══

Render everything from a JSON record per event. Build typed components and

load from a local mock-data file for now (real data wired in later). Shape:

{

  "event": { "name", "information_date", "announcement_date",

             "type_label", "key_metrics": [{"label","value","tone"}] },

  "sources": ["..."], "status": "confirmed|disputed",

  "recency": "breaking|developing|settled",

  "summary": "...",

  "reaction": [

    { "sector", "tickers", "pct", "significant": true|false,

      "tone": "gain|loss" }

  ],

  "lasting_finding": "...",

  "historical": [ { "sector", "usual", "this_event", "match": true|false } ],

  "companies_affected": [ {"ticker","tone"} ],

  "companies_named": [ {"name","amount"} ],

  "confidence": "...", "disclaimer": "..."

}

═══ SAMPLE RECORD (use to build against) ═══

{

 "event": {"name":"Strait of Hormuz closure",

   "information_date":"28 Feb 2026","announcement_date":"4 Mar 2026",

   "type_label":"energy supply shock",

   "key_metrics":[{"label":"Brent oil","value":"$126","tone":"neutral"},

                  {"label":"S&P 500","value":"-2.2%","tone":"loss"}]},

 "sources":["IRGC","Reuters","vessel-tracking"], "status":"confirmed",

 "recency":"settled",

 "summary":"When the Strait closed, oil, shipping, defense and gold stocks

   rose and airlines fell — the textbook reaction to an energy-supply shock.

   The moves pointed the right way but over the first week most were within

   normal market swings. The one clear, lasting effect was a ~9% drop in

   airline stocks that held for weeks. Energy and gold gains faded after the

   8 April ceasefire.",

 "reaction":[

   {"sector":"Oil tanker operators","tickers":"STNG, FRO, INSW","pct":"+6.2%","significant":false,"tone":"gain"},

   {"sector":"Oil & gas producers","tickers":"XOM, CVX, COP","pct":"+3.2%","significant":false,"tone":"gain"},

   {"sector":"Defense contractors","tickers":"LMT, RTX, NOC","pct":"+2.6%","significant":false,"tone":"gain"},

   {"sector":"Gold","tickers":"GLD","pct":"+2.1%","significant":false,"tone":"gain"},

   {"sector":"Airline stocks","tickers":"DAL, UAL, AAL","pct":"-9.0%","significant":false,"tone":"loss"}],

 "lasting_finding":"Over the following weeks airline stocks fell about 9% and

   stayed down — the only move large and consistent enough to be reliable.",

 "historical":[

   {"sector":"Oil & gas","usual":"Rises (supply fear)","this_event":"Rose","match":true},

   {"sector":"Defense","usual":"Rises (conflict)","this_event":"Rose","match":true},

   {"sector":"Gold","usual":"Rises (safe haven)","this_event":"Rose","match":true},

   {"sector":"Airlines","usual":"Falls (fuel cost)","this_event":"Fell","match":true},

   {"sector":"Tankers","usual":"Mixed (route-dependent)","this_event":"Rose","match":false}],

 "companies_affected":[{"ticker":"STNG","tone":"gain"},{"ticker":"XOM","tone":"gain"},

   {"ticker":"LMT","tone":"gain"},{"ticker":"GLD","tone":"gain"},{"ticker":"JETS","tone":"loss"}],

 "companies_named":[{"name":"Lockheed Martin","amount":"$1.3B"},

   {"name":"RTX","amount":"$1.0B"},{"name":"Northrop Grumman","amount":"$0.7B"}],

 "confidence":"Few directly comparable past events; figures strip out the

   market's own move; the short one-week window limits how reliably small

   moves can be judged.",

 "disclaimer":"This tool informs your decision. It does not give investment advice."

}

═══ DESIGN ═══

- Dark "intelligence terminal" theme: charcoal canvas #161512, panels

  #1F1E18, borders #312F28, off-white text #ECEAE3, secondary grey #9E9B90,

  muted #6F6C63.

- Accent colors ONLY where they carry meaning: amber #EF9F27 (energy/oil),

  teal #1D9E75 (gains), red #E24B4A (losses/disruption).

- All numbers in a monospace font; headings and body in a clean sans-serif.

- Flat, restrained, professional — Bloomberg-terminal feel. No glows or

  gradients.

- Plain English leads every label; technical terms appear as small captions.

- Mobile-responsive.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a90a1e40-1576-46d7-ac30-70cb4602a430).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
