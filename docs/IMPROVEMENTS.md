# Improvements backlog

Findings from a full review on **2026-09-15**; delete items as they land.

- **[C. Launch process](#c-launch-process)** — the go-live steps.
- **[D. SEO after launch](#d-seo-after-launch)** — worthwhile, not blocking.
- **[E. Other findings](#e-other-findings)** — what is left outside SEO.
- **[F. Hosting cleanup](#f-hosting-cleanup)** — after launch, once a rollback is no longer needed.

**Done (2026-09-27/28):** all of A (crawlable links, full sitemap, real 404s, apex → www,
gzip + immutable caching, per-page titles, noindex off `www`) and B (the 301 map now lives in
`public/.htaccess`; `node scripts/check-redirects.mjs` exits 0 against all 755 old URLs), plus
E1 (denuncias admin), E2 (vite proxy), E3 (`push-api` never uploads `setup.php`;
`deploy-backend` archived), E4 (CVs admin-only), E5 (docs) and E7 (`loadSettings` shadowing).

**Client report.** A Spanish report comparing the old and new site for the client:
https://claude.ai/artifact/1ma79BJDk5faKfGqxgeDNZ. Written before the final map: its redirect
chart sends the old WooCommerce URLs to the ecommerce subdomain, but they now go to the public
shop `www.saneamientos-pereda.es` — update it before sharing.

## Facts established during the review

- **Canonical host is `https://www.saneamientos-pereda.com`.** The apex → www 301 is sent by
  **WordPress** (`X-Redirect-By: WordPress`), not Apache; Apache only upgrades http → https on
  the same host. So the hardcoded `www` in the `index.html` JSON-LD is correct, and the apex
  redirect disappears with WordPress, so `public/.htaccess` recreates it.
- **The old Yoast sitemap lists 755 URLs**: 714 pages, 37 portfolio items and 4 WordPress
  leftovers. Frozen in `docs/seo/old-site-urls.txt` — after the swap it is the only record.
- **~700 of them are "product × town" landing pages** with 92–96 % identical main content
  (measured without header/nav/footer): doorway pages by Google's definition. The old home page
  links to 659 of them. Consolidating them is aligned with Google's guidelines; their
  very-long-tail rankings will partly fade.
- **Old site**: real 404s, gzip, keyword-stuffed titles/descriptions, the same H1 on every page
  ("Instalaciones de Pruvia totalmente renovadas"), no `og:` tags on home, generic Yoast schema.
- **Dev, as measured**: every unknown path returns `200` + the home page; HTML, the 400 KB JS
  bundle and the JSON API go out uncompressed with no `Cache-Control`; robots.txt allows
  everything and canonicals point at `dev.`; a web search found no dev pages indexed (yet).
- The public product grid has **10 categories** (`Productos.jsx`); `bano` survives only as a
  fallback key in `ProductosCategory.jsx`.
- `/media/` returns 403 — Apache directory listing is off.
- On a Windows machine behind a corporate network, `curl` can hang on HTTPS (certificate
  revocation check): use `curl --ssl-no-revoke`.

---

## C. Launch process

Plan agreed on 2026-09-28: the new site moves **into `/html`**; WordPress moves out to
`/data/wp-old/` (outside the web root — the SFTP root itself is read-only). `/html/dev` stays
as staging on the same database.

**Before the switch**
- ✅ Search Console: the domain has `google-site-verification` **DNS** TXT records, so
  verification survives WordPress going away. Still worth exporting Performance → Pages (last
  16 months) as the before-picture.
- ✅ `copia1.zip` (a 1.7 GB backup that was publicly downloadable from `/html`) moved to
  `/data/backups/` on 2026-09-28.
- ✅ Backup of the WordPress DB (`qaav753`, 90 tables, 96,422 rows) taken 2026-09-28, kept
  outside the repo. File backup of `/html`: the panel's zip (4.0 GB), checked against the
  server listing — all 86,649 files present with matching sizes, hidden files included.
- ✅ Scripts: `deploy`, `push-api`, `push-config` and `prune-deployed` take `--prod` (default
  stays `/html/dev`); `deploy` and `prune` refuse `/html` while `wp-config.php` is there.
  The switch is `scripts/go-live.mjs plan|preload|switch|rollback`.
- ✅ Dry run (`go-live.mjs plan`): 21 WordPress entries move; `vieja`, `nueva`,
  `2intraneteliminar`, `check-prices.php` and `.tmb` stay in place (see F). Finding:
  **http → https on www came from a WordPress plugin** (Really Simple Security), not the
  panel — now in `public/.htaccess`. Nothing else in WordPress's `.htaccess` is needed (the rest
  is WP Fastest Cache and WordPress routing).
- `go-live.mjs preload`: the build, `api/` + `config.php`, `sql/` (denied) and a copy of the
  staging `media/` go into `/html` next to WordPress, which keeps serving; the API then
  already answers on www.

✅ **Done 2026-09-28 ~01:45: switched in 2.1 s; `verify-live.mjs` passed every check on www.**

**The switch** (`go-live.mjs switch`, ~10 s): our three entry files are staged under
temporary names, the plan is written to `/data/wp-old/.go-live-plan.json`, then renames only —
WordPress's entries to `/data/wp-old/`, ours into place. `go-live.mjs rollback` reverses it
from that plan file (works after a half-finished switch too).

**Right after:** `node scripts/verify-live.mjs` (≈30 s; passes on dev with `--dev`): pages, titles,
canonicals and indexing, 404s, sitemap/robots, http → https, apex → www, **all 755 old URLs followed
live**, API, gzip/caching and the private files. By hand: one form, admin login, a GA4 real-time hit.
Submit `https://www.saneamientos-pereda.com/sitemap.xml` in Search Console.

**After launch, content is edited on `www` only:** its uploads land in `/html/media`, which
dev doesn't see (shared DB, separate media folders).

**First month:** weekly Search Console check (404 / soft 404 / redirect errors, clicks vs the
previous period). Update the website link on the Google Business Profiles of the four stores.

**At three months:** compare clicks and impressions year over year.

---

## D. SEO after launch

- **Content without JavaScript.** The initial HTML is `<div id="root"></div>`. Google renders
  JS; Bing only partly; social scrapers and most AI crawlers don't. `index.php` could inject a
  per-route static summary (H1, description, key links) inside `#root` — `createRoot` replaces
  it on render — or static routes could be prerendered at build time.
- **Thin category pages.** One paragraph each. Ask the client for 2–3 paragraphs per category
  (`category_desc_<cat>`, edited in Productos): brands, product types, which store shows them.
- **Ambiente names.** 7 of the 12 were still "Ambiente 1…7" on 2026-09-15; the name is the
  page H1 and the photos' alt text.
- **Share image.** `og:image` is the logo; a 1200×630 image with
  `twitter:card = summary_large_image` previews better.
- Low priority: slugs for ambientes instead of UUIDs (needs a column), BreadcrumbList schema,
  GA Consent Mode v2.

---

## E. Other findings

1. **No tests, lint or CI.** `check-redirects.mjs` is the first check that can gate anything.
2. **Email deliverability.** SPF is set, but there is **no DKIM and no DMARC** (checked
   2026-09-28). Enable DKIM in the mail provider's panel and publish `_dmarc` TXT
   `v=DMARC1; p=none`.

---

## F. Hosting cleanup

**When:** a few weeks after launch, once a rollback to WordPress is no longer needed. **Ask the
client before deleting anything** — some of this may still be in use. Take a backup of each
item first (DB dump / file download) and keep it outside the repo.

Inventory as of 2026-09-28:

| Item | What it is | Proposal |
|---|---|---|
| DB `qaqu803` (lldg503, 0.3 MB) | **The new website** | Keep |
| DB `qaav753` (lldf084, 89 MB) | The WordPress being replaced (backed up 2026-09-28) | Delete after the rollback window |
| DB `qtq808` (lldc718, 25 MB) | Unknown — likely one of the old sites below | Identify, then decide |
| DB `qtr125` (lldc718, 4 MB) | Unknown — likely one of the old sites below | Identify, then decide |
| `/data/wp-old/` | WordPress files after the switch | Delete after the rollback window |
| `/data/backups/copia1.zip` (1.7 GB) | Site backup from 2026-05-05, was public until 2026-09-28 | Delete (superseded by the 2026-09-28 backup) |
| `/html/vieja/` | An old site; answers 500 | Likely delete |
| `/html/2intraneteliminar/` | Old intranet ("eliminar" = to delete); 404 at its root | Confirm with the client, then delete |
| `/html/nueva/` | One file; 403 | Likely delete |
| `/html/check-prices.php` | Unknown script, publicly executable (200) | Find out what calls it; delete if nothing |
| `/html/.tmb` | Empty (file-manager thumbnails) | Delete |

To identify `qtq808` / `qtr125`: match their names against the DB settings in the old sites'
config files (`vieja/`, `2intraneteliminar/`, `nueva/`) — those files hold credentials, so
read them deliberately, not in passing. Also review the panel for unused mailboxes, FTP users,
subdomains and cron jobs.
