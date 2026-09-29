# Follow-up after launch

The site is finished and live (2026-09-28). This is what remains, by who has to act. How the launch
was done: [LAUNCH.md](LAUNCH.md).

## Waiting on the client

- **Confirm they have stored their copy of the old website** (the encrypted `.7z` shared by Drive,
  password sent separately). Until then, nothing of the old site is deleted from the server (see
  Hosting cleanup).
- **Old folders**: does anyone still use `vieja/`, `nueva/` or the old intranet
  (`2intraneteliminar/`)? Their answer unblocks the cleanup.
- **Who renews the SSL certificate** (`*.saneamientos-pereda.com` + apex, Sectigo, expires
  **2026-12-15**). The daily monitor starts failing 21 days before, but someone has to renew it.
- **Content**: fill the FAQ (the page is empty until then); check the form recipients in
  Ajustes → Destinatarios, above all the denuncias one; 2–3 paragraphs per product category (each
  has one today, 190–510 characters) help search.
- **Email deliverability — out of our scope.** The domain has SPF but no DKIM or DMARC; the
  company's email is managed by another provider. If the site's notifications land in spam, that
  provider is the first stop.

## Search Console (first month)

- Confirm `sitemap.xml` shows "Correcto" (Googlebot has fetched it several times; the status lags),
  remove the old Yoast sitemaps from the list, request indexing of the main pages, and export
  Performance → Pages (16 months) as the before-picture.
- Weekly: 404 / soft 404 / redirect errors, clicks vs the previous period. "Page with redirect"
  growing into the hundreds is expected (the old URLs).
- **At three months (late December 2026)**: compare clicks and impressions year over year.

## Hosting cleanup (mid/late October 2026)

**When:** once the rollback window has passed (a few weeks without surprises) and the client has
answered the two questions above. **Ask before deleting anything; back up each item first.** The
permanent archive of the old site is the client's copy — not the server, not a developer's laptop.

| Item | What it is | Plan |
|---|---|---|
| DB `qaqu803` | **The website (www)** | Keep |
| DB `qars573` | **Staging** | Keep |
| DB `qaav753` (89 MB) | The old WordPress | Delete after the rollback window |
| `/data/wp-old/` (2.4 GB, 41,958 files) | The old WordPress files | Delete after the rollback window; `scripts/go-live.mjs` can go with it |
| DB `qtq808` (25 MB), DB `qtr125` (4 MB) | Unknown — likely the old sites below | Identify, then decide |
| `/html/vieja/` (2.6 GB, 43,540 files) | A site older than WordPress; answers 500 | Delete if unused |
| `/html/2intraneteliminar/` (21 MB) | Old intranet ("eliminar" = to delete) | Confirm with the client, then delete |
| `/html/nueva/` | One config file | Delete if unused |
| ~~`/data/backups/copia1.zip`~~, ~~`/html/check-prices.php`~~, ~~`/html/.tmb`~~ | Old backup, broken price-sync script, empty folder | ✅ Deleted 2026-09-29 |

To identify `qtq808` / `qtr125`: match their names against the DB settings in the old sites' config
files — those files hold credentials, so read them deliberately. Also review the panel for unused
mailboxes, FTP users, subdomains and cron jobs. The hosting panel credentials in `.env` do not work
and should be updated or removed.

## Ideas, low priority

- Slugs for ambientes instead of UUIDs (needs a column and redirects from the old URLs).
- BreadcrumbList schema; GA Consent Mode v2.
- Unit tests or JS lint (CI today builds, lints the PHP and checks the redirect map).
- Periodic backups of the live database and `/media` (the hosting panel may offer them).
