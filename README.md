# Isabloom

Website en CMS voor Isabloom. Directus 12 voor content, Next.js voor de publieke site.

## Website (typografieproef)

Nog geen echte inhoud. De startpagina toont alleen palet en lettertypes.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run lint
npm run build
```

Kleuren en fontnamen staan in `src/design/tokens.ts` en worden herhaald in `src/app/globals.css`.

## CMS lokaal

1. Kopieer de omgevingsvariabelen:

   ```bash
   cp .env.example .env
   ```

2. Start de stack:

   ```bash
   docker compose up
   ```

3. Open [http://localhost:8055](http://localhost:8055) en log in met het e-mailadres uit `ADMIN_EMAIL` in `.env`.

Directus past bij opstarten automatisch `directus/schema/snapshot.yaml` toe. Een aparte seed-container maakt daarna de rollen aan.

### Licentie en Website-filters

Directus Core weigert itemfilters op de rol **Website** (`custom_permission_rules_enabled`). Zonder geldige licentie stopt de seed met een fout zodra die filters worden gezet. De rol **Isabloom beheerder** kan al aangemaakt zijn vóór die fout.

Zet optioneel `LICENSE_KEY` (of `DIRECTUS_LICENSE_KEY`) in `.env` als je een Directus-licentie hebt. Voeg geen verzonnen sleutel toe.

## Tests zonder Docker

```bash
npm test
```

De tests controleren het snapshot-contract (collecties, velden, Nederlandse labels) en de design-tokens. Docker is daarvoor niet nodig.

## Veld toevoegen

1. Voeg een **Engelse API-sleutel** toe in `directus/model.ts` (bijvoorbeeld in `SERVICE_FIELDS` of `SITE_SETTINGS_FIELDS`).
2. Definieer het veld in `directus/build-snapshot.ts` met een **nl-NL** label.
3. Genereer het snapshot opnieuw:

   ```bash
   npm run cms:snapshot
   ```

4. Controleer:

   ```bash
   npm test
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
