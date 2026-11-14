# TestFlight via EAS — oppsett av Apple-credentials

Status (nov 2026): `eas-cli` er installert lokalt og innlogget som `haakonrusas` (Owner).
EAS-prosjekt `@rusas_design/bueboka` (ID `a740b024-fdf9-420d-9998-a6ae076ebc43`) har allerede
build-secrets: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_CLARITY_KEY`, `SENTRY_AUTH_TOKEN`,
`APP_ADMIN_API_KEY`, `EXPO_GOOGLE_SERVICE_ACCOUNT_KEY` (se `eas env:list --scope project --environment production`).

Det som gjenstår er **Apple-credentials** (sertifikat/provisioning + App Store Connect API-nøkkel).

> Merk: Det finnes ingen Expo MCP-connector i dette miljøet — alt gjøres via `eas` CLI.

## 0. Forutsetninger i Apple-portalene

- Apple ID `haakon.helmen.rusas@pm.me` må ha rollen **Account Holder eller Admin** i Apple Developer Program-teamet.
- Appen finnes i App Store Connect med **App ID 6448108838** (allerede satt som `submit.preview.ios.ascAppId` i `eas.json`).
- Bundle ID i ASC må matche `app.json`: `com.aaronshade.bueboka`.
- Finn **Team ID** på https://developer.apple.com/account → Membership.

## 1. App Store Connect API-nøkkel (for `eas submit` til TestFlight)

1. App Store Connect → Users and Access → **Integrations** → Keys → **+**
2. Navn f.eks. `bueboka-eas`, rolle **Admin** (kreves for submit)
3. Last ned `AuthKey_<KEY_ID>.p8` — kan bare lastes ned én gang. Noter **Key ID** og **Issuer ID**.
4. Lagre .p8 utenfor repoet, f.eks. `~/.asc/AuthKey_<KEY_ID>.p8` (aldri commit .p8!).

### Koble nøkkelen til EAS (velg én):

**A) Lagret hos EAS (anbefalt, ingen secrets i repo):**
```bash
eas credentials --platform ios
# → production → "Manage your App Store Connect API key" → lim inn Key ID, Issuer ID og sti til .p8
```

**B) Via eas.json** (legg til i `submit.preview.ios` / `submit.production.ios`):
```json
"ascApiKeyId": "<KEY_ID>",
"ascApiKeyIssuerId": "<ISSUER_ID>",
"ascApiKeyPath": "~/.asc/AuthKey_<KEY_ID>.p8"
```

## 2. Build-credentials (sertifikat + provisioning profile)

```bash
eas credentials --platform ios
# → production → "Set up a distribution certificate and provisioning profile"
# → velg "Let EAS manage credentials" — logg inn med Apple ID + 2FA én gang,
#   EAS genererer og lagrer Distribution Certificate + App Store provisioning profile.
```

Alternativ (manuell): last opp eksisterende Distribution Certificate (.p12) og App Store
provisioning profile (.mobileprovision) samme sted.

## 3. Bygg og send til TestFlight

```bash
# 1) Bygg for store-distribusjon (autoIncrement byggenummer)
eas build --profile preview --platform ios

# 2) Send siste build til TestFlight (bruker ascAppId 6448108838 + API-nøkkel fra steg 1)
eas submit --profile preview --platform ios --latest --non-interactive \
  --what-to-test "Scoring per kategori/skive, hurtigtrening over skjema på iOS."

# 3) Legg build i intern testgruppe (valgfritt)
eas submit --profile preview --platform ios --latest --groups "Intern testing"
```

## 4. Verifisering

- `eas build:list --platform ios --limit 5` — se status på byggene
- App Store Connect → TestFlight → se ny build under interne testere
- Sjekk at `EXPO_PUBLIC_API_URL` peker til produksjons-API i bygget (ikke localhost) — ellers feiler Google OAuth på enheter utenfor lokalnettet (se `docs/BUILD_ENVIRONMENT.md`)

## Feilsøking

- **"Build number already used"** — skal ikke skje lenger; `autoIncrement: true` er satt i preview/production.
- **"Invalid ASC key / not authorized"** — nøkkelen må ha Admin-rolle, og Apple ID-en som kjører `eas submit` må være Admin på teamet.
- **"No Apple ID with 2FA"** — første `eas credentials` krever interaktiv innlogging med 2FA; kan ikke gjøres fra CI — bruk API-nøkkel (steg 1).
