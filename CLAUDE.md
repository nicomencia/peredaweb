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

## Migration status as of 2026-06-11 (IN PROGRESS — finish this first)

Done: schema (`server/sql/schema.sql`, UUIDs as CHAR(36), `specs`/`emails` as JSON), full PHP API (lint-checked PHP 8.2), data export, frontend swapped to the shim + `@supabase/supabase-js` uninstalled, all committed. The deployed dev site still runs the OLD Supabase-backed build on purpose.

Remaining steps, in order:
1. `.env` needs `DB_USER`, `DB_PASS` (MySQL created in panel: db/host `qaqu803` / `qaqu803.saneamientos-pereda.com` — note: NOT localhost, it's a separate MySQL host; its DNS record may suffer the same publication problem as `dev`, see Known issues), and `RESEND_API_KEY`. User chooses admin email+password for the website admin panel.
2. `node scripts/deploy-backend.mjs` — uploads API + config.php (generated from .env, incl. auto SETUP_TOKEN) + schema + import JSON + media to `/html/dev`.
3. `POST http://dev.saneamientos-pereda.com/api/setup.php` with JSON `{token: <SETUP_TOKEN from .env>, admin_email, admin_password}` — creates tables, imports data (rewrites Supabase URLs to `/media/...`), creates admin user. Check the returned report.
4. Smoke-test API: `content.php?resource=products`, login, upload, one form.
5. `npm run deploy /html/dev` — cut the frontend over. Verify site + admin end-to-end.
6. Delete `/html/dev/api/setup.php` and `/html/dev/api/import/` from the server (SFTP).
7. Later: pause/delete the Supabase project; `supabase/` dir in repo becomes historical.

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
