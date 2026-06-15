# Saneamientos Pereda — project context

Website for Saneamientos Pereda (Spanish bathroom/plumbing/construction-materials company in Oviedo). React 19 + Vite 7 SPA with an integrated admin panel. Originally developed on Bolt; **mid-migration from Supabase to the client's own hosting (PHP 8.2 + MySQL)** — see "Migration status" below.

## Architecture (target, mostly built)

- **Frontend**: static build deployed to client server `/html/dev` (dev subdomain `dev.saneamientos-pereda.com`). No router: navigation is `useState('currentView')` in `src/App.jsx`; all pages share one URL (known SEO limitation, accepted for now). Admin panel + Instalaciones (Leaflet) code-split via `React.lazy`.
- **Backend**: PHP API in `server/api/` (deployed to `/html/dev/api/`), MySQL, images on server disk under `/html/dev/media/`.
  - `src/lib/supabase.js` is now a **compatibility shim** mimicking the supabase-js query surface (`from().select().eq().in().or().order().maybeSingle()`, `insert/update/delete`, `auth.*`) but calling the PHP API — components were NOT rewritten. Don't "clean it up" into per-component fetches without reason.
  - `src/lib/upload.js` resizes client-side (≤1920px WebP) then POSTs to `api/upload.php` (PHP-session protected).
  - Admin auth: PHP sessions (`auth.php`, bcrypt in `admin_users` table) via the shim's `auth.*` methods.
  - Forms: `api/forms.php?form=candidatura|denuncia|presupuesto|cliente` → MySQL insert + email via Resend (from the verified domain, with reply_to). Denuncia status lookup: GET with `&pin=`.
  - Local dev: `vite.config.js` proxies `/api` and `/media` to `http://dev.saneamientos-pereda.com`.
- The old Supabase project (`mxhpggzfkrlqmguwichm`, Bolt-provisioned) still holds the original data; the export snapshot lives in `migration-data/` (8 content tables + 12 media files; form tables were empty).

## Migration status as of 2026-06-15 (DONE — public site fully on client infra)

The Supabase→MySQL migration is **complete and live** on `/html/dev`. The public site reads from the client's MySQL, serves images from the client's disk under `/media/`, and uses PHP session admin auth + PHP form endpoints. `@supabase/supabase-js` is uninstalled; no Supabase refs remain in the build.

Key facts established during cutover:
- **DB connection: `DB_HOST=lldg503.servidoresdns.net`** (the real DB server, IP 82.223.113.26). The panel's `qaqu803.saneamientos-pereda.com` is an unpublished CNAME to it (stuck DNS — see Known issues), so it doesn't resolve from PHP; `localhost` reaches the web host's *own* MySQL which does NOT have this DB. DB name/user `qaqu803`, password in `.env`.
- **Schema was corrected from the live exported data, NOT the old migration files** (which were stale): `products` uses `category`/`featured` (not `collection`/`variant`/`available`); `tiendas` has `lat`/`lon`. `server/sql/schema.sql` `DROP`s then `CREATE`s, with defaults so imports are strict-mode-safe. `TABLE_COLUMNS` in `db.php` mirrors this.
- Admin user: `admin@saneamientos-pereda.com` (created via setup). Login/upload verified; security boundaries verified (401 unauth upload/admin, 403 on config.php/db.php/import).
- `setup.php` + `api/import/` were deleted from the server post-import (`scripts/cleanup-setup.mjs`).

Helper scripts: `scripts/push-config.mjs` (regen+upload config.php from .env), `scripts/push-api.mjs` (upload api/*.php + schema, no media), `scripts/cleanup-setup.mjs`.

Remaining / later:
- Re-running `setup.php` requires re-deploying it (deploy-backend) — only needed for a fresh re-import.
- Pause/delete the old Supabase project (`mxhpggzfkrlqmguwichm`) once happy; `supabase/` dir becomes historical.
- Forms email depends on Resend domain verification (blocked by the same stuck DNS).

## Client hosting environment

Shared hosting ("Hosting Avanzado Linux", panel at panelcontrolhosting.com): Apache + PHP 8.2 + MySQL, ~54 GB free. Server IP 217.76.142.23. SFTP `ftp.saneamientos-pereda.com:22`, user = domain name, password in `.env` (SFTP_*) — **transfer .env between machines via a private channel, never commit it** (it was committed once by accident; that password has been rotated).

- Web root `/html` = client's **live WordPress — never touch**. We deploy only to `/html/dev`.
- `npm run deploy /html/dev` (frontend), `node scripts/deploy-backend.mjs` (backend), `npm run sftp:ls <dir>`, `scripts/optimize-images.mjs`, `scripts/export-supabase.mjs`.
- `uploadDir` only adds/overwrites — frontend deploys won't delete `/api` or `/media`.

## Known issues / pending

- **Hosting DNS publication is STUCK**: records added in the panel DNS editor (`dev` A, `send` SPF/MX, `resend._domainkey` TXT) exist in the editor but are NOT served by ns1/ns2.dns-servicios.com (old records resolve fine, so the zone itself is live). User was advised to find an "apply changes" step or open a support ticket. Consequences: dev subdomain needs a local hosts entry `217.76.142.23 dev.saneamientos-pereda.com` (HTTP only — no SSL cert yet; enable Let's Encrypt in panel once DNS publishes), and Resend domain verification was still pending (user re-triggered it).
- `public/productos_construccion.jpg` is corrupt (truncated at exactly 512 KB everywhere, incl. Bolt demo). Replace it.
- Goal: make ALL images admin-modifiable; Quiénes Somos photos + category card images are still hardcoded static files.
- Timeline (README): 2026-06-15 aesthetics review; 2026-06-22 production launch + SEO.

## Conventions

- UI text Spanish; commit messages short imperative summaries.
- `.env` keys: `VITE_SUPABASE_URL/ANON_KEY` (legacy, still used by `scripts/export-supabase.mjs` only), `SFTP_HOST/PORT/USER/PASS`, `DB_HOST/NAME/USER/PASS`, `RESEND_API_KEY`, `SETUP_TOKEN` (auto-generated by deploy-backend).
- Local tooling on the original dev machine: Node 24 + PHP 8.2 via winget (`php -l` for linting). On a fresh machine: install Node, `npm install`, copy `.env`, add the hosts entry.
