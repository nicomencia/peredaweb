# Saneamientos Pereda — project context

Website for Saneamientos Pereda (Spanish bathroom/plumbing/construction-materials company in Oviedo). React 19 + Vite 7 SPA with an integrated admin panel. Originally developed on Bolt; now being moved to the client's own hosting.

## Architecture (current)

- **Frontend**: static build, deployed to the client's server at `/html/dev` (dev subdomain `dev.saneamientos-pereda.com`).
- **Backend**: still 100% Supabase, project `mxhpggzfkrlqmguwichm` (Bolt-provisioned — NOT the `hggbqyamebqyjvdfpwgu` project linked in README.md, which is stale).
  - Data: browser → supabase-js → Postgres REST (anon key + RLS public reads).
  - Admin images: browser → Storage bucket `site-assets`; pages load Supabase CDN URLs stored in the DB. `src/lib/upload.js` is the single upload choke point and resizes to ≤1920px WebP client-side before upload.
  - Admin auth: Supabase Auth (email/password).
  - Forms (candidatura, denuncias, presupuesto, hazte-cliente): browser → Supabase Edge Functions (`supabase/functions/`) → DB insert + CV upload + email via Resend API.
- **No router**: navigation is `useState('currentView')` in `src/App.jsx`; all pages share one URL. Known SEO limitation, accepted for now.
- Admin panel and Instalaciones (Leaflet) are code-split via `React.lazy`.

## Client hosting environment

Shared hosting for saneamientos-pereda.com ("Hosting Avanzado Linux", panel at panelcontrolhosting.com): Apache + PHP 8.2 + MySQL (7 DBs allowed), ~54 GB free disk. Server IP 217.76.142.23. SFTP: `ftp.saneamientos-pereda.com:22`, user = domain name; credentials live in the gitignored `.env` (SFTP_* vars) — transfer that file between machines securely, never commit it.

- Web root is `/html` and contains the client's **live WordPress site — never touch it**. Our app deploys only to `/html/dev`.
- `npm run deploy /html/dev` builds and uploads; `npm run sftp:ls <dir>` lists remote dirs.
- `scripts/optimize-images.mjs` recompresses `public/` images in place.
- `server/api/upload.php` is groundwork for the migration (PHP upload endpoint). It is NOT deployed: it shipped once with its default token (insecure) and was removed from the server. Set a real token before ever deploying it.

## Status as of 2026-06-11

- Dev deploy is live and serving over **HTTP only**; the provider had not yet published the `dev` DNS records (created in panel, visible in DNS editor, not on ns1/ns2.dns-servicios.com) nor the SSL cert. Local testing used a Windows hosts-file entry `217.76.142.23 dev.saneamientos-pereda.com`. Verify whether DNS/SSL has gone live; if so, enable Let's Encrypt in the panel SSL section.
- **Planned migration** (user-confirmed direction): move everything off Supabase onto client hosting — MySQL for data, server disk + secured upload.php for images, PHP sessions for admin auth, PHP endpoints + Resend API for form emails. Resend is already DNS-verified for the domain (DKIM record exists).
- Known issues:
  - Form notification emails likely undelivered: edge functions send from `onboarding@resend.dev` (sandbox sender, only delivers to account owner). Fix: change `from` to the verified domain.
  - `public/productos_construccion.jpg` is corrupt (truncated at exactly 512 KB, also on the Bolt demo). Needs replacement.
  - The intent is to make ALL images admin-modifiable; the Quiénes Somos photos and category card images are currently hardcoded static files.
- Timeline (README): 2026-06-15 aesthetics review with client; 2026-06-22 production launch + SEO.

## Conventions

- UI text is Spanish.
- Commit messages: short imperative summaries (e.g. "Add SFTP deploy scripts").
- `.env` needs: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `SFTP_PASS`. The Supabase anon key is public and recoverable from the deployed site's JS bundle if lost.
