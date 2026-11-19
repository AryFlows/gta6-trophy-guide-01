# Frost Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/AryFlows/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/AryFlows/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 GTA VI trophies on PlayStation 5: a checklist
with progress saved in the browser, a five-stage roadmap to the platinum, the one
missable trophy flagged, and a guide with its cited sources for every trophy.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. The app works with the network
off; progress is stored only in your browser's localStorage.

## What it does

- **Trophy tracker**: all 55 trophies with official names, descriptions and grades;
  tick each one as you earn it. Filters by kind (story, missable, collectibles,
  activities, online), search across names and guides, and a spoiler setting that
  hides story trophies until they are earned.
- **Roadmap to the platinum**: five stages in order — story first (60–80 hours),
  character finales, activities, collectibles, then money, mayhem and the 100%
  checklist. About 200 hours all in (PowerPyx).
- **The one missable trophy**: Positive Mental Attitude is the only trophy
  reported as potentially missable (PowerPyx, GTABase) — Lucia's Chapter 1 balcony
  meditation. Everything else is doable in free-roam after the story.
- **Cited guides**: every trophy's guide is written for this entry from the
  official description and the cited launch guides, with its sources named beside
  it. Methods still unconfirmed at launch say so instead of inventing a method.
- **Export / import**: download your progress as JSON and import it back on any
  browser.

## Files

- `app/index.html` — the guide page
- `app/style.css` — the tracker chrome
- `app/src/main.js` — boot and wiring
- `app/src/trophy-tracker.js` — the checklist, filters and search
- `app/src/cited-guides.js` — the guide panel with cited sources
- `app/src/roadmap-platinum.js` — the five-stage roadmap to the platinum
- `app/src/missable-flags.js` — the missable flag and warning banner
- `app/src/spoiler-setting.js` — the spoiler setting
- `app/src/export-import.js` — progress export and import
- `app/data/trophies.json` — all 55 trophies: official names, descriptions, grades,
  guides and sources
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to the output
  directory and writes `dossier.json`

## License

MIT. No Rockstar Games artwork, logos or game screenshots are used.

---

<sub>Entered on [make.fun](https://make.fun/bounty/gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
