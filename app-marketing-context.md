# App Marketing Context — Bueboka

Grunnlagsdokument for all ASO- og markedsføring av appen. Opprettet nov 2026.
Kilder: repoet (app.json, AGENTS.md, kode), App Store Connect App ID 6448108838.

## 1. App Overview

- **App Name:** Bueboka
- **App ID (Apple App Store):** 6448108838
- **Package (Google Play / Android):** com.aaronshade.bueboka
- **iOS bundleIdentifier:** com.aaronshade.bueboka
- **EAS projectId:** a740b024-fdf9-420d-9998-a6ae076ebc43
- **Category:** Sports (primary)
- **Platform:** iOS + Android (+ web)
- **Price model:** Free (ingen kjøp/abonnement i appen per 2.1.0)
- **Current version:** 2.1.0
- **Backend:** eget API (hono), better-auth, Google OAuth

## 2. Value Proposition

- **Problem:** Bueskyttere i Norge mangler en enkel, norsk dagbok for trening og konkurranse — hvem skjøt hva, hvor, med hvilken bue/pil, og hva ble scoren per runde/skive?
- **Target audience:** Norske bueskyttere på alle nivåer — klubbmedlemmer, felt/3D-jegere, konkurranseskyttere. Primært rekreasjonelt miljø rundt klubber tilsluttet Norges Bueskytterforbund.
- **Unique differentiator:** Norsk språk (no/en), scoring som følger faktisk skive/kategori (WA 10-ring, 6-ring, felt 6–1, 3D 11/10/8/5), pil-for-pil registrering, hurtigtrening, utstyr (bue/pilsett), siktmerker/ballistikk, utfordringer 1v1, statistikk og achievements. Offline-støtte.
- **Elevator pitch:** "Bueboka er treningsdagboken for bueskyting — registrer hver pil, følg progresjonen, og utfordre en venn."

## 3. Competitive Landscape

TODO — vurder: internasjonale apper som Archery Scorekeeper / bow paper apps, samt norske klubbverktøy.

| App | App ID | Strengths | Weaknesses |
| --- | --- | --- | --- |
| TBD | | | |

## 4. Current ASO State

- **Title:** Bueboka (se `app-store/metadata.md` for foreslått metadata)
- **Subtitle:** TBD i App Store Connect — forslag i `app-store/metadata.md`
- **Keyword field:** forslag i `app-store/metadata.md`
- **Rating:** ukjent — sjekk App Store Connect
- **Screenshots:** legacy 5.5" (1242×2208, `assets/images/AppStore_5'5.png`) — bør erstattes med 6.9"/6.5"-størrelser
- **Creative assets (header + search results, iOS 27+):** generert i `app-store/assets/` (se `app-store/ASSETS.md`)

## 5. Goals & KPIs

1. Få ut ny testversjon på TestFlight (etter merge av PR #243) — måle crash-fri bruk i testgruppen.
2. Øke organisk nedlasting i Norge via bedre search-result/header og keywords.
3. Forbedre konvertering på produktsiden med nye screenshots + creative assets.

## 6. Resources & Constraints

- **Team:** solo / liten (rusas_design)
- **Budget:** ikke satt (organisk + evt. Apple Search Ads senere)
- **Tools:** EAS Build/Submit, App Store Connect, Sentry + Microsoft Clarity i appen
- **Constraints:** Apple review-regler for creative assets (App Review 2.3.14) — ingen priser/URLer/awards i bilder; bilder må lokaliseres (no/en)

## 7. Markets

- **Primary:** Norge
- **Secondary:** Norden/engelskspråklige (app støtter en)
- **Languages:** norsk (no) + engelsk (en)

## Relaterte filer

- `app-store/metadata.md` — all App Store-metadata (no/en)
- `app-store/assets/` — creative assets (header 3840×1646, search 3840×2560, universal 5244×2950) + SVG-kilder og generator-script
- `docs/TESTFLIGHT_SUBMISSION.md` — Apple-credentials, EAS build og submit til TestFlight
