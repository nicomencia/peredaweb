# Saneamientos Pereda — project context

Website for Saneamientos Pereda (Spanish bathroom/plumbing/construction-materials company in Oviedo). React 19 + Vite 7 SPA with an integrated admin panel, on the client's own hosting (PHP 8.2 + MySQL + images on disk).

## Architecture

- **Frontend**: static build deployed to client server `/html/dev` (dev subdomain `dev.saneamientos-pereda.com`). **react-router** (BrowserRouter) gives real per-page URLs; `App.jsx` keeps a `setCurrentView(view)` adapter (maps view→path via `VIEW_TO_PATH`) so child components navigate unchanged. Admin panel + Instalaciones (Leaflet) code-split via `React.lazy`.
- **SEO**: a PHP front controller `public/index.php` (served via `.htaccess`, `DirectoryIndex index.php`) serves the SPA shell with per-route `<title>`/description/`og:*`/canonical injected, and generates `/sitemap.xml` + `/robots.txt` dynamically (live host). JSON-LD `HardwareStore` in `index.html`. Per-route meta also set client-side in `App.jsx`. Canonical domain in the JSON-LD is hardcoded `https://www.saneamientos-pereda.com` — confirm at production launch.
- **Backend**: PHP API in `server/api/` (deployed to `/html/dev/api/`), MySQL, images on server disk under `/html/dev/media/`.
  - `src/lib/api.js` is a small **chainable client** (`from().select().eq().in().or().order().maybeSingle()`, `insert/update/delete`, `auth.*`) that calls the PHP API — components use it like a mini query builder. Don't "clean it up" into per-component fetches without reason.
  - `src/lib/upload.js` resizes client-side (≤1920px WebP) then POSTs to `api/upload.php` (PHP-session protected).
  - Admin auth: PHP sessions (`auth.php`, bcrypt in `admin_users` table) via the shim's `auth.*` methods.
  - Forms: `api/forms.php?form=candidatura|denuncia|presupuesto|cliente` → MySQL insert + notification email. Denuncia status lookup: GET with `&pin=`.
  - Email: `api/mailer.php` sends via **authenticated SMTP through the domain's own provider** (`smtp.serviciodecorreo.es:465` SSL, mailbox `web@saneamientos-pereda.com`) — passes the domain SPF (`include:_spf.serviciodecorreo.es`). **Resend was dropped** (its DNS verification was stuck for a month). Config keys: `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM`, `MAIL_TO`.
  - Local dev: `vite.config.js` proxies `/api` and `/media` to `http://dev.saneamientos-pereda.com`.

## Status as of 2026-06-15 (live on client infra)

The public site on `/html/dev` reads from the client's MySQL, serves images from the client's disk under `/media/`, and uses PHP session admin auth + PHP form endpoints.

Key facts established during cutover:
- **DB connection: `DB_HOST=lldg503.servidoresdns.net`** (the real DB server, IP 82.223.113.26). The panel's `qaqu803.saneamientos-pereda.com` is an unpublished CNAME to it (stuck DNS — see Known issues), so it doesn't resolve from PHP; `localhost` reaches the web host's *own* MySQL which does NOT have this DB. DB name/user `qaqu803`, password in `.env`.
- **Schema was corrected from the live exported data, NOT the old migration files** (which were stale): `tiendas` has `lat`/`lon`. `server/sql/schema.sql` `DROP`s then `CREATE`s, with defaults so imports are strict-mode-safe. `TABLE_COLUMNS` in `db.php` mirrors this. **(Update 2026-06-18: the `products`/`product_photos` tables were later dropped — see Recent changes.)**
- Admin user: `admin@saneamientos-pereda.com` (created via setup). Login/upload verified; security boundaries verified (401 unauth upload/admin, 403 on config.php/db.php/import).
- `setup.php` + `api/import/` were deleted from the server post-import (`scripts/cleanup-setup.mjs`).

Helper scripts: `scripts/push-config.mjs` (regen+upload config.php from .env), `scripts/push-api.mjs` (upload api/*.php + schema, no media), `scripts/cleanup-setup.mjs`.

Remaining / later:
- Re-running `setup.php` requires re-deploying it (deploy-backend) — only needed for a fresh re-import.
- Forms email works via SMTP (above), independent of the stuck DNS. Resend resources + their DNS records (`send` MX/SPF, `resend._domainkey` TXT) were deleted.

## Recent changes (2026-06-18)

- **Product catalogue removed.** `products`/`product_photos` tables were dropped (client has 15k+ SKUs, unmanageable one by one). Each category is now a one-screen presentation: descriptive text (left) + photo carousel (right) + brand carousel (below), all from `site_settings` (`category_desc_<cat>`, `category_photos_<cat>` JSON image list; legacy `category_banner_<cat>` is a fallback). Dead components `ProductCard`/`CollectionDetail` removed; `products`/`product_photos` scrubbed from `db.php`/`content.php`/`schema.sql`/`setup.php`. `AdminProductos` now manages only per-category text/photos + brands.
- **Reusable `ImageCarousel`** (`src/components/ImageCarousel.jsx`, arrows + dots) powers the store photos (`Instalaciones`) and the category photos.
- **Four independent logos** (all `site_settings`): `hero_logo` (over the hero, edited in Portada), `navbar_logo` (top bar), `favicon` (browser tab), `footer_logo` (footer); the last three edited in Ajustes.
- **Hero link buttons**: `hero_buttons` (JSON `[{label,url}]`) renders external-link buttons over the hero (e.g. an Instagram offers post). Edited in Portada (folded into `AdminHomepage` so the tab has a single save button).
- **Sticky admin save**: the page-level "Guardar cambios" floats via `position: sticky`; this required changing the global `html, body { overflow-x: hidden }` → `overflow-x: clip` (hidden creates a scroll container that breaks sticky).
- New `site_settings` keys must be **seeded** (`node scripts/seed-setting.mjs <key> [value]`) because admin saves use `update` (which won't create a missing row).

## Client hosting environment

Shared hosting ("Hosting Avanzado Linux", panel at panelcontrolhosting.com): Apache + PHP 8.2 + MySQL, ~54 GB free. Server IP 217.76.142.23. SFTP `ftp.saneamientos-pereda.com:22`, user = domain name, password in `.env` (SFTP_*) — **transfer .env between machines via a private channel, never commit it** (it was committed once by accident; that password has been rotated).

- Web root `/html` = client's **live WordPress — never touch**. We deploy only to `/html/dev`.
- `npm run deploy /html/dev` (frontend), `node scripts/deploy-backend.mjs` (backend), `npm run sftp:ls <dir>`, `scripts/optimize-images.mjs`, `scripts/prune-orphan-media.mjs`.
- `uploadDir` only adds/overwrites — frontend deploys won't delete `/api` or `/media`.

## Known issues / pending

- **Hosting DNS + SSL: RESOLVED 2026-07-01.** The previously-stuck zone now publishes: `dev` A, `www.dev` A (→ 217.76.142.23) and the `qaqu803` CNAME (→ lldg503.servidoresdns.net → 82.223.113.26) all resolve on public resolvers (8.8.8.8, 1.1.1.1). SSL for `dev.saneamientos-pereda.com` is served by the existing **`*.saneamientos-pereda.com` wildcard** (Sectigo DV, valid to 2026-12-16) — installed on the dev subdomain via the panel (SSL → Operaciones certificado → *Instalar* ON), with **Redirección HTTPS** ON (http→https 302). So dev is now a proper HTTPS staging site; the local hosts entry is no longer required (can be removed). `DB_HOST` still uses `lldg503.servidoresdns.net` directly (works fine); it *could* now switch to the `qaqu803` CNAME but there's no need. The Resend records (`send` MX/SPF, `resend._domainkey` TXT) were **deleted** by the user (email moved to SMTP, see above).
  - **Production launch is still gated on migration/parity work, not infra:** the live `/html` WordPress site has 700+ indexed URLs (WooCommerce shop `/tienda/` etc., hundreds of programmatic local-SEO landing pages like `/mueble-de-bano-*-en-asturias/`, blog, portfolio, `/contacto/`, `/trabaja-con-nosotros/`, differing legal slugs). Cutover needs: a 301 redirect map (old→new), a decision on whether the `www` WooCommerce shop is still used for sales, a cookie-consent banner + web analytics (GA/GTM id needed — SPA currently has neither), and the docroot swap. Client is still testing content on dev.
- All site images are now DB-driven/admin-editable (2026-06-15): Quiénes Somos (bg + 4 photos → `quienes_somos_*` settings), Área Profesional bg (`area_profesional_bg`), per-category images (now `category_photos_<key>`, a JSON photo list driving the carousel — supersedes the legacy single `category_banner_<key>`, still read as a fallback; edited in AdminProductos). `AdminPageEditor` gained an `image` field type. Base images seeded via `scripts/seed-image-settings.mjs`. Unused `inspirate1-3.jpg` and the corrupt `productos_construccion.jpg` were removed.
- Note: the hosting serves static assets through a **cache** that ignores query-string busting and outlives file deletion by a TTL — deleted/replaced same-path files linger briefly. Admin uploads use unique filenames so they're unaffected. `scripts/prune-deployed.mjs` deletes server files removed locally (deploy only adds/overwrites).
- Timeline (README): 2026-06-15 aesthetics review; 2026-06-22 production launch + SEO.

## Conventions

- UI text Spanish; commit messages short imperative summaries.
- `.env` keys: `SFTP_HOST/PORT/USER/PASS`, `DB_HOST/NAME/USER/PASS`, `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM/TO`, `SETUP_TOKEN` (auto-generated by deploy-backend).
- Local tooling on the original dev machine: Node 24 + PHP 8.2 via winget (`php -l` for linting). On a fresh machine: install Node, `npm install`, copy `.env` (DNS now resolves publicly, so no hosts entry needed).
