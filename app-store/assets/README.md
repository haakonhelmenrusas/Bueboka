# App Store creative assets — Bueboka (iOS 27+)

Generert nov 2026 per https://developer.apple.com/app-store/asset-best-practices/

| Fil | Størrelse | Plassering |
|---|---|---|
| `creative-header-3840x1646-{no,en}.png` | 3840×1646 (21:9) | Product page header (safe area 1920×824 sentrert) |
| `creative-search-3840x2560-{no,en}.png` | 3840×2560 (3:2) | Search results (safe area 2168×1030 sentrert) |
| `creative-universal-5244x2950-{no,en}.png` | 5244×2950 (16:9) | Universal — betjener begge (croppes til 21:9/3:2) |

- PNG **uten alpha** (RGB), som Apple krever.
- Regenerer: `npm install --no-save @resvg/resvg-js && node app-store/assets/generate-creative-assets.mjs`, deretter flatten RGBA→RGB (Apple avviser alpha).
- SVG-kilder ligger ved siden av (`*.svg`) — rediger der og regenerer.
- Last opp i App Store Connect → Asset Library / «Header and Search Results», én per lokal (no/en). Bruk Preview-verktøyet for å sjekke beskjæring.
- Innhold følger App Review 2.3.14: kun app-relevant motiv, ingen priser/URLer/awards/logoer fra andre plattformer.
