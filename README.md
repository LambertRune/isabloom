# Isabloom

Website en CMS voor Isabloom. Directus 12 is de database. Alle inhoud beheer je op de site zelf via `/beheer`.

## Lokaal als één geheel

CMS en site naast elkaar:

```bash
cp .env.example .env
# Zet ADMIN_PASSWORD en DIRECTUS_TOKEN (een lange willekeurige string).
docker compose up -d
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) voor de site. Inhoud (logo, diensten, team, foto's) vul je in op [http://localhost:3000/beheer](http://localhost:3000/beheer) met het Directus-beheerdersaccount uit `ADMIN_EMAIL`. Directus op poort 8055 blijft de API. Bewerk content niet in de Directus-app.

Lege collecties vallen terug op de analyse-teksten en placeholders. Zonder geüpload logo toont de navigatie de naam Isabloom, geen zelfgemaakt merkteken.

De botanische ranken groeien één keer per browsersessie rond de navigatie. `prefers-reduced-motion` slaat die animatie over.

```bash
pnpm test
pnpm lint
pnpm build
```

Kleuren en fontnamen staan in `src/design/tokens.ts` en worden als CSS-variabelen op `<html>` gezet. `globals.css` mapt die tokens, het is geen tweede palet.

## CMS lokaal

1. Kopieer de omgevingsvariabelen:

   ```bash
   cp .env.example .env
   ```

2. Start de stack:

   ```bash
   docker compose up
   ```

3. Open [http://localhost:3000/beheer](http://localhost:3000/beheer) en log in met het e-mailadres uit `ADMIN_EMAIL` in `.env`.

Directus past bij opstarten automatisch `directus/schema/snapshot.yaml` toe. Een aparte seed-container maakt daarna de rollen aan.

### Licentie en Website-filters

Directus Core weigert itemfilters op de rol **Website** zonder licentie. De seed geeft dan unfiltered read en de Next.js-laag filtert zelf (actief, gepubliceerd). Met `LICENSE_KEY` blijven de filters in Directus staan.

## Tests zonder Docker

```bash
pnpm test
```

De tests controleren het snapshot-contract (collecties, velden, Nederlandse labels) en de design-tokens. Docker is daarvoor niet nodig.

## Veld toevoegen

1. Voeg een **Engelse API-sleutel** toe in `directus/model.ts` (bijvoorbeeld in `SERVICE_FIELDS` of `SITE_SETTINGS_FIELDS`).
2. Definieer het veld in `directus/build-snapshot.ts` met een **nl-NL** label.
3. Genereer het snapshot opnieuw:

   ```bash
   pnpm cms:snapshot
   ```

4. Controleer:

   ```bash
   pnpm test
   ```

5. Commit `directus/schema/snapshot.yaml` samen met je codewijzigingen.

**Belangrijk:** hernoem bestaande veldsleutels nooit. De frontend en API vertrouwen op stabiele Engelse namen.

## Rollen

Rollen en permissies staan in `directus/seed/roles.json`, niet in het snapshot. Wijzig rollen daar en herstart de seed (of `docker compose up` op een schone stack).

## Buiten scope in v1

- Geen webshop
- Geen clientlogin
- Geen dummy-inhoud
- Bestandsmappen per type volgen in een latere iteratie
