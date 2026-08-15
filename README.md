# Aftershock, frontend

The web interface for Aftershock, a system that measures how geopolitical events move financial markets.

**Live site:** https://aftershock-site-five.vercel.app/
**Backend and engine:** https://github.com/mutazhammad/aftershock-engine

This repository contains the React frontend only. The event-study engine, detection pipeline, precedent research, and diagnostics all live in the backend repository above.

## What this renders

The frontend is a read layer. It queries Supabase directly and renders whatever the backend has published. There is no server between the two.

**Event feed.** A watch list of detected events, newest first, with search and a time filter. Each row previews its own analysis, so the row itself tells you something before you click. Breaking events preview their historical precedent averages. Settled events preview their measured result with an inline sparkline of the reaction path.

**Event report.** The full analysis for a single event:

- A plain-language summary of the result and the tickers involved
- What happened, and the causal chain by which it reaches market prices
- Measurement diagnostics, covering date basis, single-constituent concentration, and confounding windows
- Historical precedents, each independently measured and validated
- Sector reactions, with statistically insignificant results visually muted
- Market fear (VIX) and realized volatility
- What has materially changed between the precedent conditions and today

**Methodology.** Plain-language explanations of event studies, the information date, statistical significance, causal versus descriptive readings, and the event lifecycle.

**Build notes.** The engineering decisions behind the system and why they were made.

## The lifecycle the interface reflects

Events change shape as market data accumulates, and the interface changes with them:

- **Breaking:** no measured reaction exists yet, so the report leads with validated historical precedents
- **Developing:** the snap window is measurable, results shown as provisional
- **Settled:** the full window has closed, complete measurement with charts

A row in the feed visibly gets denser as the event matures.

## Design

Dark intelligence-terminal theme, blue-black rather than neutral.

| Token | Hex | Use |
|---|---|---|
| abyss | `#050A18` | Canvas |
| hull | `#0C1628` | Panels |
| steel | `#1B2C47` | Borders, map landmass |
| signal | `#3FA9F5` | Accent, live data |
| ember | `#FF6B4A` | Losses |
| verdigris | `#2DD4A7` | Gains |
| ash | `#6C7A94` | Secondary text |
| bone | `#E8EDF5` | Primary text |

A condensed technical sans for display, Inter for body, JetBrains Mono for every number. Textured regional maps sit behind report headers and feed rows, cropped to each event's actual location.

One rule carries throughout: statistically significant results render solid and lit, insignificant results render flat and muted. Colour and light mean evidence, so a reader's eye is drawn to real findings rather than noise.

## Stack

- **React** with Vite
- **Recharts** for charts
- **react-simple-maps** for regional map backgrounds
- **Supabase JS client**, read-only, for data
- **Vercel** for deployment

## Development

Requires Node.js and npm. [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone https://github.com/mutazhammad/aftershock_site
cd aftershock_site
npm i
npm run dev
```

The app reads from Supabase using a publishable key with read-only access. Nothing writes to the database from the frontend.

## Built with Lovable

Scaffolded in [Lovable](https://lovable.dev), then deployed independently on Vercel. Changes pushed to `main` sync back into the Lovable editor.

## Disclaimer

Aftershock does not predict markets and does not give investment advice. A disclaimer appears on every report it produces.
