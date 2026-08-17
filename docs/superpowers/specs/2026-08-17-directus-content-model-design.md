# Directus contentmodel (PR1)

Datum: 2026-08-17
Status: goedgekeurd (review 2026-08-17 verwerkt)
Bronnen: projectbrief Isabloom, analyse Phiosk (`analyse-website-isabloom.md`)

Dit document beschrijft alleen het eerste subproject: een lokale, versiebeheerde Directus-laag. Geen Next.js, geen visueel ontwerp, geen echte teksten of kleuren.

## Doel

Een beheerder kan in een Nederlandse Directus-app de contentcollecties van Isabloom zien en invullen. De datastructuur staat in git als schema-snapshot. Een schone `docker compose up` levert dezelfde collecties, velden, relaties en rollen op.

De website (Next.js) komt in latere PRs en praat tegen de Engelse API-keys uit dit model.

## Beslissingen (vast)

- Eerste snede: Directus + Postgres, daarna pas frontend-skelet.
- API-keys Engels, paneel-labels Nederlands (`nl-NL`).
- Schema-snapshot in git, toepassen bij opstart.
- Lean compose: Postgres + Directus. Geen Redis, geen Next.js, geen dummy-copy.
- Geen `products`-collectie in v1. Uitbreidbaarheid zit in losse collecties en M2M-bestanden, niet in een lege webshop-stekker.
- Portfolio blijft een collectie (`portfolio_items`). Of dat later een eigen pagina wordt of alleen een sectie op de startpagina, verandert dit model niet.
- Contact als pagina of anker verandert dit model niet (`site_settings` plus later een formulier).

## Bewust niet in PR1

- Next.js, Tailwind, fonts, SVG-bibliotheek, GSAP.
- Seizoensaccentkleuren, hero-copy, openingsuren, adres, logo-bestand.
- Zoho-mail, SEO-routes, Dokploy-productiecompose (wel dezelfde servicegrenzen aanhouden).
- Klantaccount seeden (geen e-mail verzinnen). Alleen de rol bestaat; een admin koppelt later een gebruiker.
- Contentvertalingen (de site is v1 uitsluitend Nederlands). `nl-NL` geldt voor de Directus-interface, niet voor een `translations`-relatie op berichten.

## Architectuur

```
docker-compose.yml
  db        postgres:16-alpine + volume + healthcheck
  directus  officiële image (pin 12.x bij implementatie)
            custom entrypoint: bootstrap/migrate -> schema apply -> start
            volume: uploads
            healthcheck: GET /server/ping
  seed      eenmalige job na directus healthy: rollen + permissies (idempotent)
```

Bestanden:

- `docker-compose.yml`: lokale CMS-stack.
- `.env.example`: `POSTGRES_*`, `DIRECTUS_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PUBLIC_URL`. Geen secrets in git.
- `directus/schema/snapshot.yaml`: bron van waarheid voor collecties, velden, relaties, NL-vertalingen in `meta.translations`.
- `directus/seed/roles.json`: rollen en permissies (horen niet in een Directus schema-snapshot).
- `directus/scripts/entrypoint.sh`: bootstrap, `schema apply --yes`, daarna Directus starten.
- `directus/scripts/seed-roles.mjs`: na healthcheck rollen upserten via de admin API.
- `directus/model.ts`: typed contract dat de tests lezen (collectienamen, velden, enums, verplichte `nl-NL` labels).
- `directus/model.test.ts`: contracttesten, zonder Docker.
- `README.md`: lokaal starten, snapshot opnieuw exporteren, hoe een veld toe te voegen zonder de frontend later te breken.

Pin de Directus-image op een concrete 12.x-tag bij implementatie (niet `latest`). Postgres is gewone `postgres:16-alpine`, geen PostGIS.

### Opstartvolgorde

1. `db` wordt healthy (`pg_isready`).
2. Directus start, voert eigen migrations/bootstrap uit (admin uit env).
3. Entry point past `snapshot.yaml` toe (`npx directus schema apply --yes`).
4. Directus luistert op `8055`. Healthcheck groen.
5. Seed-job: rollen, permissies, en projecttaal `nl-NL` aanmaken of bijwerken. Daarna stoppen. De seed-job zet `country` niet. Die default zit in de snapshot.

Schema apply is idempotent. Seed is upsert op rolnaam.

### Talen in het paneel

Project default language: `nl-NL`. Elke collectie en elk zichtbaar veld heeft `meta.translations` voor `nl-NL` (en waar Directus het vraagt ook een singular). Engelse keys blijven de database- en API-namen.

## Rollen

Schema-snapshots bevatten geen rollen. Die komen uit `directus/seed/roles.json`.

1. **Administrator** (Directus bootstrap-admin uit env). Phiosk. Volledige toegang. Niet het klantaccount.
2. **Isabloom beheerder**. CRUD op de zeven contentcollecties, junction-collecties, en `directus_files` (upload + lezen + bijwerken van eigen uploads). Geen toegang tot systeeminstellingen, schema, andere gebruikers, webhooks, of server-info voorbij wat Directus verplicht toont.
3. **Website**. Alleen-lezen op contentcollecties en bestanden. Filter: `offer_items.active = true`, `team_members.active = true`, `blog_posts.status = published`. Overige contentcollecties: alles leesbaar (diensten en portfolio zijn publicatie via aanwezigheid, niet via status). Deze rol is voor een later Next.js static token. In PR1 bestaat de rol al, het token nog niet verplicht seeden.

Geen public anonymous read op de API in v1. De site praat later server-side met de Website-rol.

## Contentmodel

Primaire keys: UUID, Directus-default.

### `site_settings` (singleton)

Paneel: Site-instellingen.

| API-veld | Type | NL-label | Verplicht | Notitie |
|---|---|---|---|---|
| `company_name` | string | Bedrijfsnaam | ja | |
| `street` | string | Straat en nummer | nee | |
| `postal_code` | string | Postcode | nee | |
| `city` | string | Gemeente | nee | |
| `country` | string | Land | nee | Schema-default `BE` in `snapshot.yaml` (`schema.default_value`). Niet via de seed-job. ISO-achtige korte code. |
| `phone` | string | Telefoon | nee | |
| `email` | string | E-mail | nee | |
| `instagram_url` | string | Instagram | nee | URL. |
| `facebook_url` | string | Facebook | nee | URL. |
| `maps_url` | string | Google Maps-route | nee | Kant-en-klare route-URL, geen API-key. |
| `opening_hours` | json | Openingsuren | nee | Zie schema hieronder. Leeg tot de klant ze invult. |
| `logo` | m2o files | Logo | nee | |
| `favicon` | m2o files | Favicon | nee | |

`opening_hours` is type `json` met de native Repeater-interface (`list`). Die slaat een JSON-array van objecten op. Geen ruwe JSON-editor als de Repeater in de gekozen 12.x-tag beschikbaar is (dat is de default in Directus 12). Vorm:

```json
[
  { "day": "monday", "opens": "09:00", "closes": "18:00", "closed": false }
]
```

`day` is `monday` tot `sunday`. `opens`/`closes` zijn `HH:mm` 24u. `closed: true` negeert de tijden. Deze vorm is later 1-op-1 te mappen naar JSON-LD `OpeningHoursSpecification`. Geen voorbeelduren in de seed.

### `services`

Paneel: Diensten / Dienst.

| API-veld | Type | NL-label | Verplicht |
|---|---|---|---|
| `title` | string | Titel | ja |
| `slug` | string unique | Slug | ja |
| `short_text` | text | Korte tekst | ja |
| `long_text` | text | Lange tekst | nee |
| `sort` | integer | Volgorde | ja, default 0 |
| `cta_text` | string | CTA-tekst | nee |
| `cta_link` | string | CTA-link | nee |
| `images` | m2m files | Afbeeldingen | nee |

Slug-interface: van `title` afgeleid, handmatig overschrijfbaar. Geen prijzenveld.

### `offer_items`

Paneel: Aanbod / Aanboditem.

| API-veld | Type | NL-label | Verplicht |
|---|---|---|---|
| `title` | string | Titel | ja |
| `category` | enum | Categorie | ja |
| `text` | text | Tekst | nee |
| `sort` | integer | Volgorde | ja, default 0 |
| `active` | boolean | Actief | ja, default true |
| `images` | m2m files | Afbeeldingen | nee |

Enum `category` (API = label):

- `shop` = Winkel
- `christmas_rental` = Verhuur Kerst
- `flower_rental` = Verhuur Bloemen

Geen prijzenveld.

### `portfolio_items`

Paneel: Portfolio / Portfolio-item.

| API-veld | Type | NL-label | Verplicht |
|---|---|---|---|
| `image` | m2o files | Afbeelding | ja |
| `title` | string | Titel | nee |
| `alt` | string | Alt-tekst | nee |
| `category` | string | Categorie | nee |
| `sort` | integer | Volgorde | ja, default 0 |

`category` is vrije tekst. Geen verzonnen taxonomie in v1.

### `team_members`

Paneel: Team / Teamlid.

| API-veld | Type | NL-label | Verplicht |
|---|---|---|---|
| `name` | string | Naam | ja |
| `title` | string | Functie | nee |
| `photo` | m2o files | Foto | nee |
| `sort` | integer | Volgorde | ja, default 0 |
| `active` | boolean | Actief | ja, default true |

### `blog_posts`

Paneel: Blog / Blogbericht. Mag leeg live gaan.

| API-veld | Type | NL-label | Verplicht |
|---|---|---|---|
| `title` | string | Titel | ja |
| `slug` | string unique | Slug | ja |
| `intro` | text | Intro | nee |
| `content` | text (WYSIWYG) | Inhoud | nee |
| `cover` | m2o files | Coverfoto | nee |
| `published_at` | timestamp | Publicatiedatum | nee |
| `status` | enum | Status | ja, default `draft` |

Enum `status`: `draft` = Concept, `published` = Gepubliceerd.

WYSIWYG in v1 (herkenbaar voor de klant). Geen Block Editor.

### `season_themes`

Paneel: Seizoensthema's / Seizoensthema.

| API-veld | Type | NL-label | Verplicht |
|---|---|---|---|
| `name` | string | Naam | ja |
| `start_date` | date | Startdatum | ja |
| `end_date` | date | Einddatum | ja |
| `priority` | integer | Prioriteit | ja, default 0 |
| `accent_color` | string | Accentkleur | nee |
| `hero_image` | m2o files | Hero-afbeelding | nee |
| `hero_video` | m2o files | Hero-video | nee |
| `hero_title` | string | Hero-titel | nee |
| `hero_subtitle` | string | Hero-ondertitel | nee |
| `force_active` | boolean | Handmatig forceren | ja, default false |

Geen seed-rijen. Geen accenthex, geen datumbereiken verzinnen (kerststart is een bedrijfskeuze).

Resolutieregels (velden moeten dit ondersteunen, de code komt later):

1. Als minstens één rij `force_active = true`, wint die. Bij meerdere: hoogste `priority`, daarna nieuwste `start_date`.
2. Anders: rijen waarvan de huidige datum in `[start_date, end_date]` valt (inclusief, lokale datum Europe/Brussels). Hoogste `priority` wint. Feestdagen krijgen in de data een hogere `priority` dan het seizoen, niet via een apart typeveld.
3. Geen match: geen thema. De frontend valt later terug op het basispalet.

`accent_color` is optioneel. Validatie is native Directus field-meta, geen custom hook: `meta.validation` met operator `_regex`. Pattern dat leeg én hex toelaat: `^$|^#([0-9A-Fa-f]{6})$`. Interface: cleared value opslaan als lege string (niet `null`), zodat de regex het lege geval ziet. `validation_message` in het Nederlands: `Accentkleur moet een hex-waarde zijn (#RRGGBB).` Context7 (`/directus/docs`) plus Directus PR 24984: `_regex` is server-side ondersteund; lege strings mogen tegen de regex gecheckt worden als het pattern dat toelaat.

Jaarwisseling: `start_date` mag later in het jaar liggen dan `end_date` (kerst 1 dec tot 6 jan). De later te bouwen resolver moet dat aankunnen. Daarom twee date-velden, geen enkel seizoen-enum.

## Bestanden en relaties

M2O (één bestand): `logo`, `favicon`, `image`, `photo`, `cover`, `hero_image`, `hero_video`. Interface: image waar het een beeld is, file voor `hero_video`.

M2M (galerij) op `services.images` en `offer_items.images`:

Junctions:

- `services_files`
- `offer_item_files`

Junctionvelden: `sort` (integer), `alt` (string). Labels: Volgorde, Alt-tekst. De junction bepaalt volgorde per gebruik, niet de globale file-library.

Geen Directus-folders per type in v1. Eén uploads-volume. Als winkel- en verhuurgalerijen groeien, wordt de file library een lange platte lijst. Dat is geen blocker voor PR1; folders per type horen in een latere iteratie.

Bestanden blijven in Directus. Later gebruikt Next.js `next/image` plus Directus transforms (`?width=` en `format=webp`). PR1 zet alleen het opslagpad klaar.

## Tests

Testrunner: Vitest. Geen Docker in CI voor PR1.

`directus/model.ts` is de leesbare contractlijst. `directus/model.test.ts` plus een snapshot-parser controleren:

1. Snapshot bevat precies deze collecties: `site_settings`, `services`, `offer_items`, `portfolio_items`, `team_members`, `blog_posts`, `season_themes`, plus de twee junctions. Geen `products`.
2. `site_settings` is singleton.
3. Elk van die collecties en elk contentveld heeft een `nl-NL` translation.
4. Enums `offer_items.category` en `blog_posts.status` matchen de tabellen hierboven.
5. M2M-relaties `services.images` en `offer_items.images` lopen via de genoemde junctions met `sort` en `alt`.
6. `roles.json` bevat "Isabloom beheerder" en "Website", zonder systeemcollectie-CRUD voor de beheerder.
7. `site_settings.country` heeft `schema.default_value` gelijk aan `BE`.
8. `season_themes.accent_color` heeft native `meta.validation` met `_regex` `^$|^#([0-9A-Fa-f]{6})$`.
9. `opening_hours` is type `json` met interface `list` (Repeater).

Commando: `npm test`. Verwacht: groen zonder draaiende containers.

Handmatige check na `docker compose up`:

- Directus op `http://localhost:8055`, interface in het Nederlands.
- Collecties zichtbaar onder de NL-namen.
- Inloggen als bootstrap-admin lukt.
- Rol "Isabloom beheerder" bestaat.

## Hoe een veld toevoegen (README-contract)

1. Veld toevoegen in Directus (of in de snapshot).
2. Engelse field key, `nl-NL` label verplicht.
3. `directus/model.ts` bijwerken.
4. Snapshot exporteren en committen: `docker compose exec directus node /directus/cli.js schema snapshot ./schema/snapshot.yaml`.
5. `npm test` groen.
6. Frontend later: optionele velden mogen ontbreken in queries; verplichte velden niet hernoemen zonder migratie.

Dit is de belofte "nieuwe collectie/veld zonder de frontend te breken": additive changes, geen rename van bestaande keys, optionele velden default leeg.

## Git- en PR-afspraak

- Branch: `feature/directus-content-model`.
- PR naar `pre-production` (niet naar `main`).
- Geen em-dashes in copy, comments of README.
- Geen secrets. `.env` staat in `.gitignore`. Volumes `data/` en `uploads/` ook, met `.gitkeep` waar nodig.

## Volgende subprojecten (niet deze PR)

2. Next.js-skelet + design tokens + typografieproef (pas na expliciete font- en kleurkeuze).
3. Botanische SVG-bibliotheek + navbar-intro (GSAP).
4. Homepagina-secties tegen dit CMS.
5. Diensten- en aanbodpagina's.
6. Blog-routes.
7. Seizoensresolver (tegen `season_themes`).
8. Contactformulier + Zoho.
9. SEO, ISR, revalidate-webhook.
10. Dokploy-compose met de `web`-service erbij.

## Open punten die bewust wachten

Deze vragen horen bij latere PRs, niet bij het CMS-schema:

- Exacte logo-goudhex (samplen uit het aangeleverde logo-bestand, dat nu niet in de repo zit).
- Serif/sans-keuze en CTA-accent (donkergroen of terracotta) voor het basispalet.
- Portfolio als `/portfolio` of alleen een sectie op de startpagina.
- Directus-folders per bestandstype (wanneer de file library te plat wordt).
- Contact als `/contact` of anker.
- Werkelijke seizoensvensters en accentkleuren, in te vullen in Directus door de klant of in een latere design-PR.
