# Launch record — WordPress → new site (2026-09-28)

How the new site replaced the client's WordPress on `www.saneamientos-pereda.com`, and the facts
the migration was based on. A record, not a to-do list: open follow-up is in
[IMPROVEMENTS.md](IMPROVEMENTS.md).

**Client report** (Spanish, old vs new site, with the launch plan and its status):
https://claude.ai/artifact/1ma79BJDk5faKfGqxgeDNZ. Shared viewers see a pinned version: update the
pin from the page's Share menu after each change.

## The review (2026-09-15)

- **Canonical host is `https://www.saneamientos-pereda.com`.** WordPress itself sent apex → www and a
  WordPress plugin (Really Simple Security) sent http → https; both are recreated in
  `public/.htaccess`.
- **The old Yoast sitemap listed 755 URLs**: 714 pages, 37 portfolio items and 4 WordPress leftovers,
  frozen in `docs/seo/old-site-urls.txt` (the only record now that WordPress is gone).
- **~700 of them were "product × town" landing pages** with 92–96 % identical main content: doorway
  pages by Google's definition. The new site consolidates them into one page per category.
- **Old site**: keyword-stuffed titles, the same H1 on every page, no `og:` tags on home, generic
  Yoast schema.
- **Dev, as measured before the work**: every unknown path answered 200 + home; no compression or
  caching; robots.txt allowed everything and canonicals pointed at `dev.`.

What came out of it (all done before launch): crawlable links, full sitemap, real 404s, apex → www,
gzip + immutable caching, per-page titles and descriptions, noindex off www, and the 301 map
(`node scripts/check-redirects.mjs` exits 0 against all 755 URLs). Also: an admin view for
denuncias, CVs admin-only, per-person admin accounts with a login limit, GA4 only on www.

## Before the switch

- **Exposure found and fixed**: `copia1.zip` (a 1.7 GB site backup from May 2026) was publicly
  downloadable from `/html`. Moved out of the web root 2026-09-28, deleted 2026-09-29.
- **Backups (2026-09-28)**, kept outside the repo (they hold personal data and credentials):
  WordPress DB `qaav753` dumped (90 tables, 96,422 rows, counts verified) and the panel's zip of
  `/html` (4.0 GB) checked against the server listing: all 86,649 files present with matching sizes,
  hidden files included. An encrypted copy (`.7z`, AES-256, with a restore guide for a technician)
  was prepared for the client to keep.
- **Search Console**: the existing URL-prefix property (16 months of history) verified for the
  client's account with `public/googlecbef9800fec986d9.html`.
- **Scripts**: `--prod` targets for every deploy script, guards against writing `/html` while
  WordPress was there, and `scripts/go-live.mjs plan|preload|switch|rollback`.
- **Dry run** (`go-live.mjs plan`): 21 WordPress entries to move; `vieja/`, `nueva/`,
  `2intraneteliminar/`, `check-prices.php` and `.tmb` left in place. It surfaced the http → https
  plugin rule above.
- **Preload**: build, `api/` + `config.php`, `sql/` (denied) and media copied into `/html` next to
  WordPress, which kept serving; the API already answered on www.

## The switch (2026-09-28 ~01:45)

`go-live.mjs switch`: our entry files staged under temporary names, the plan written to
`/data/wp-old/.go-live-plan.json`, then renames only — WordPress's entries to `/data/wp-old/`, ours
into place. **2.1 seconds.** `go-live.mjs rollback` reverses it from the plan file (also after a
half-finished switch) and stays available until `/data/wp-old/` is deleted.

Right after: `verify-live.mjs` all green on www (pages, canonicals, indexing, sitemap/robots,
http → https, apex → www, all 755 old URLs live in one hop, API, caching, private files). By hand:
a form, admin login, a GA4 real-time hit. `sitemap.xml` submitted; Google read it the same night.
Google Business Profiles of the four stores checked: all link to the new site.

## First days

- **Access logs** showed old URLs outside the Yoast sitemap still being requested: WooCommerce
  product/tag/category pages (→ the public shop), `/index.php` (→ `/`), `/bano/` (→ `/productos`),
  pre-WordPress `/images/` (410). Old WordPress media (`/wp-content/`) answers 410 by decision: not
  kept. No 5xx in the first 12,000 requests.
- **Staging got its own database** (`qars573`, 2026-09-29): until then it shared www's, so a test
  edit or form on dev reached the live site and the client's inbox.
- **Emails** tested end to end on every form (with the client warned); all test data deleted.
