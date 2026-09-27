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
  outside the repo. File backup of `/html`: in progress.
- Scripts able to target `/html` (today they hardcode `/html/dev`; `deploy.mjs` refuses `/html`).
- Dry run: the exact list of WordPress entries to move; check WordPress's `.htaccess` for
  anything the new one must keep (e.g. whether http → https is done there or by the panel).
- Pre-load `api/` (+ `config.php`), `assets/`, `base/`, `media/` into `/html` next to WordPress.

**The switch** (seconds): move the WordPress entries to `/data/wp-old/`, upload `index.php`,
`index.html`, `.htaccess`. Rollback = the same moves in reverse.

**Right after:** status codes, one old URL per redirect rule, http → https, apex → www,
`/sitemap.xml` + `/robots.txt` (indexing on), a form, admin login, a GA4 real-time hit.
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
- **Store JSON-LD** is static in `index.html` while store data lives in `tiendas`, so an edit
  in the panel won't reach it. Generate it in `index.php` from the DB and add
  `openingHoursSpecification` from the `hours_*` columns.
- **Share image.** `og:image` is the logo; a 1200×630 image with
  `twitter:card = summary_large_image` previews better.
- **Hero LCP.** The hero image is a CSS background applied after JS runs, and a first visit
  loads the bundled `/base/hero-bg.webp` before the DB value arrives. Preload the DB image from
  `index.php` (`<link rel="preload" as="image">`); measure with Lighthouse.
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
