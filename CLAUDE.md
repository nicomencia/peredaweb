# Saneamientos Pereda — project context

Website for Saneamientos Pereda (Spanish bathroom/plumbing/construction-materials company in
Oviedo, four stores in Asturias). React 19 + Vite 7 SPA with an integrated admin panel, on the
client's own hosting (PHP 8.2 + MySQL + images on disk).

## Status

**Finished and live** on `https://www.saneamientos-pereda.com` since **2026-09-28**, replacing the
client's WordPress. Handed over 2026-09-29 (git tag `v1.0`). The project is now in maintenance:
open follow-up lives in `docs/IMPROVEMENTS.md`; the launch record in `docs/LAUNCH.md`.

## Environments

| | Production | Staging |
|---|---|---|
| URL | `https://www.saneamientos-pereda.com` | `https://dev.saneamientos-pereda.com` (noindex) |
| Server folder | `/html` | `/html/dev` |
| Database | `qaqu803` (`DB_*` in `.env`) | `qars573` (`DEV_DB_*`), separate since 2026-09-29 |
| Form emails | per-form recipients set in the admin | all to `DEV_MAIL_TO` (never the client) |
| Analytics | GA4, after cookie consent | never loads |

Both databases are on `lldg503.servidoresdns.net` (the real DB server; the panel's
`qaqu803.saneamientos-pereda.com` name is a CNAME to it, and `localhost` is the web host's own MySQL,
which does NOT have these DBs). **Content is edited on www**; staging is a sandbox for code and tests,
refreshed from www with `node scripts/refresh-dev.mjs` (DB with the form tables emptied, new images,
CVs never copied).

## Architecture

- **Frontend** (`src/`): **react-router** (BrowserRouter) with real per-page URLs; `App.jsx` keeps a
  `setCurrentView(view)` adapter (view → path via `VIEW_TO_PATH` in `src/lib/routes.js`) so child
  components navigate unchanged. Admin panel + Instalaciones (Leaflet) are code-split via `React.lazy`.
  Internal links are real `<Link>`s; class `as-button` makes an anchor look like the old `<button>`
  (`src/styles/links.css`, imported first so the global reset doesn't undo it).
- **Front controller** `public/index.php` (via `.htaccess`, `DirectoryIndex index.php`) serves the SPA
  shell for every route:
  - Per-route `<title>`/description/`og:*`/canonical from one metadata map, also inlined as
    `window.__SEO__` and applied on client-side navigation by `src/lib/seo.js` (no second copy in JS).
    Keep the `$ROUTES` array format: `scripts/check-redirects.mjs` parses it.
  - Real status codes: 404 (+ noindex) for unknown paths; ambiente IDs checked against the DB (DB down
    → 200, never a false 404). `noindex` + `X-Robots-Tag` on every host except `PRODUCTION_HOST`.
  - `/sitemap.xml` (static routes, 10 categories, ambientes) and `/robots.txt`, generated per host.
  - JSON-LD: `Organization` static in `index.html`; the four `HardwareStore`s generated from `tiendas`
    on `/` and `/instalaciones`, with `openingHoursSpecification` parsed from the free-text `hours_*`
    columns (a store whose text doesn't parse gets no hours rather than wrong ones).
  - Home: preloads the DB hero image and inlines it as `window.__SETTINGS__` (merged into the settings
    cache by `src/lib/settings.js`), so a first visit downloads one hero image, early.
  - Fills `#root` with the page's real text (heading, DB content, links to every section) for crawlers
    that don't run JS; visually hidden, shown under `<noscript>`, replaced by `createRoot`.
  - Share image `public/base/og-image.jpg` (1200×630, hero photo + logo); ambientes use their cover.
- **`public/.htaccess`**: gzip, one-year immutable cache for `/assets/`, apex → www, http → https (this
  used to come from a WordPress plugin, not the panel), `/index.php` and `/index.html` → `/`, CVs
  routed to `api/cv.php`, and the **301 map for the 755 old WordPress URLs**
  (`docs/seo/old-site-urls.txt`) plus old URLs seen in the logs after launch. Old WordPress media
  (`/wp-content/`) and pre-WordPress `/images/` answer 410 by decision. Verify any change with
  `node scripts/check-redirects.mjs` (exit 0).
- **Backend** (`server/api/`, deployed to `api/` in both environments): PHP + PDO on MySQL.
  - `src/lib/api.js` is a small **chainable client** (`from().select().eq().in().or().order()…`,
    `insert/update/delete`, `auth.*`, `list()`) that calls the PHP API. Don't "clean it up" into
    per-component fetches without reason. It shares in-flight `content.php` reads per table.
  - `content.php`: public read of content tables only (`mail_to_*` settings filtered out).
    `admin.php`: session-protected CRUD, `list` (private tables, e.g. denuncias) and `get_settings`.
    Identifiers are validated against `TABLE_COLUMNS` in `db.php`; keep it in sync with
    `server/sql/schema.sql`.
  - `upload.php` (session-protected) takes images resized client-side to ≤1920px WebP
    (`src/lib/upload.js`); `square` option for the favicon.
  - Admin auth: PHP sessions + bcrypt (`admin_users`). One account per person: `admin@` (developer,
    password in `.env`), `ines@` + `alberto@` (client; their password is not in `.env`). "Mi cuenta"
    tab changes one's own password (≥ 8 chars). Logins and denuncia PIN lookups share a per-IP
    limiter in `db.php` (`too_many_failures`/`record_failure`: 10 failures per hour).
  - Forms: `forms.php?form=candidatura|denuncia|presupuesto|cliente|desistimiento` → insert +
    notification email (recipient `mail_to_<form>` setting, fallback `MAIL_TO`). Email is
    best-effort: a send failure never fails the form (it only reaches the PHP error log).
    Candidatura: CV attached to the email; `/media/cvs/*` only via admin-only `api/cv.php`.
    Denuncia: GET with `&pin=` returns `hechos/estado/respuesta`; managed in the admin tab
    "Canal de denuncias" (legal deadlines: acknowledge in 7 days, answer in 3 months).
    Desistimiento: also emails an acknowledgment to the consumer.
  - Email: `mailer.php`, authenticated SMTP through the domain's own provider
    (`smtp.serviciodecorreo.es:465`, mailbox `web@saneamientos-pereda.com`), which passes the domain
    SPF. No DKIM/DMARC on the domain: the company's email belongs to another provider, out of scope.
- **Content model**: almost everything the public sees is a `site_settings` key edited in the admin
  (texts, four independent logos, hero image/announcement/buttons, per-category text + photo list,
  FAQ lists as JSON). **New keys must be seeded** (`node scripts/seed-setting.mjs <key> [value]`):
  admin saves use `update`, which won't create a missing row. There is no product catalogue by
  design (15k+ SKUs): each category is a one-screen presentation (text + photo carousel + brands).
- **Analytics**: GA4 (`analytics_id` setting) loads only after cookie consent and only on www
  (`src/lib/analytics.js`).

## Operating

Shared hosting ("Hosting Avanzado Linux", Arsys panel at panelcontrolhosting.com): Apache + PHP 8.2
+ MySQL. Server IP 217.76.142.23. **SFTP only** (no shell): `ftp.saneamientos-pereda.com:22`, user =
domain name, password in `.env`. **Transfer `.env` between machines via a private channel, never
commit it** (it was committed once by accident; that password was rotated).

- **Flow**: change → deploy to staging → check → deploy with `--prod` → `node scripts/verify-live.mjs`.
- `npm run deploy` (frontend), `node scripts/push-api.mjs` (PHP + schema; never uploads `setup.php`
  or `config.php`), `node scripts/push-config.mjs` (config.php from `.env`; picks `DEV_DB_*` /
  `DEV_MAIL_TO` for staging and refuses a staging config pointing at the www DB),
  `node scripts/prune-deployed.mjs <files>` (deploys only add/overwrite). All target `/html/dev` by
  default and `/html` with `--prod` (`npm run deploy -- --prod`); target logic in
  `scripts/lib/remote.mjs`.
- **Run deploys from PowerShell, not Git Bash**: MSYS rewrites `/html/dev` into
  `C:/Program Files/Git/html/dev`. `deploy.mjs` only accepts `--prod` or the legacy `/html/dev`.
- `node scripts/verify-live.mjs [--dev]`: read-only end-to-end check (pages, titles, canonicals,
  indexing, 404s, sitemap/robots, http → https, apex → www, all 755 old URLs followed live, API,
  gzip/caching, private files, SSL certificate ≥ 21 days left). Networks that block port 80 or drop
  connections get "could not check", not a failure.
- **GitHub Actions**: `checks.yml` (build + `php -l` + `check-redirects.mjs` on every push) and
  `monitor.yml` (`verify-live` on www and staging daily at 06:17 UTC; a failure emails the repo owner).
- Other scripts: `npm run sync:base` (refresh `public/base/` hero/logos from the DB; runs before each
  deploy), `npm run sftp:ls <dir>`, `db-audit.mjs`, `audit-media.mjs`, `optimize-images.mjs`,
  `prune-orphan-media.mjs` (dry-run by default). `go-live.mjs` did the WordPress → SPA switch; it stays
  for `go-live.mjs rollback` until `/data/wp-old/` is deleted (`docs/LAUNCH.md`). Other one-offs,
  incl. the migration's `deploy-backend.mjs` (the only script that uploads `setup.php`), are in
  `scripts/archive/`.
- Search Console: the existing `https://www.saneamientos-pereda.com/` property is verified for the
  client's account by **`public/googlecbef9800fec986d9.html` — never delete it**.

## Gotchas

- The hosting serves static files through a **cache** that ignores `?v=` and outlives deletion by a
  TTL. Admin uploads use unique filenames; `/assets/` names are content-hashed.
- `setup.php` `DROP`s every table (behind `SETUP_TOKEN`). It lives in the repo only for a
  from-scratch re-import and must never stay on the server.
- `global.css` uses `overflow-x: clip` (not `hidden`) on `html, body`: `hidden` breaks the sticky
  admin save button.
- `.hero` uses `100svh`, not `dvh` (dvh resizes the cover background while the mobile address bar
  hides).
- `/html` still holds `vieja/`, `nueva/`, `2intraneteliminar/` (old sites, not ours) and `/data/wp-old/`
  (the WordPress, kept for rollback): see the cleanup plan in `docs/IMPROVEMENTS.md`.

## Conventions

- UI text Spanish; commit messages short imperative summaries.
- `.env` keys: `SFTP_HOST/PORT/USER/PASS`, `DB_HOST/NAME/USER/PASS` (www),
  `DEV_DB_HOST/NAME/USER/PASS` + `DEV_MAIL_TO` (staging), `SMTP_HOST/PORT/SECURE/USER/PASS`,
  `MAIL_FROM/TO`, `SETUP_TOKEN` (only for a re-import).
- Tooling: Node 24 (+ PHP 8.2 for `php -l`, via winget on Windows). Fresh machine: install Node,
  `npm install`, copy `.env`.

## History

- **2026-06**: built on Supabase/Bolt, migrated to the client's hosting (PHP API + MySQL + disk
  images); schema rebuilt from the live exported data. Product catalogue dropped (2026-06-18); all
  images and texts made admin-editable.
- **2026-07-01**: hosting DNS finally published; dev served over HTTPS with the
  `*.saneamientos-pereda.com` wildcard. Email moved from Resend to the domain's own SMTP.
- **2026-09-04**: legal basis of the consent clause changed to art. 6.1.b; hero announcement; shared
  `content.php` reads; `setup.php` finally removed from the server.
- **2026-09-15**: full review → SEO launch blockers and the 755-URL redirect map.
- **2026-09-27/28**: SEO work landed (crawlable links, real 404s, sitemap, titles, noindex off www,
  gzip/caching); denuncias admin, private CVs, per-person admin accounts; backups; **switch to www**
  (2.1 s) — see `docs/LAUNCH.md`.
- **2026-09-29**: staging on its own database; share image; page text for non-JS crawlers; CI +
  daily monitor; post-launch redirects from the access logs; first hosting cleanup.
