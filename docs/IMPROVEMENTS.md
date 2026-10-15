# Follow-up after launch

The site is finished and live (2026-09-28). This is what remains, by who has to act. How the launch
was done: [LAUNCH.md](LAUNCH.md).

## Waiting on the client

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

## Hosting cleanup

✅ **Done 2026-10-15.** The client confirmed they had downloaded their archive of the old site and
that the old folders were unused. Deleted from the server: `/data/wp-old/` (the WordPress, 2.4 GB),
`/html/vieja/` (2.6 GB), `/html/2intraneteliminar/` and `/html/nueva/`; earlier (2026-09-29)
`copia1.zip`, `check-prices.php` and `.tmb`. The developer-side backups were deleted too: the
client's archive is the only copy now. There is no rollback any more.

**Databases**: the old ones (`qaav753` WordPress, `qtq808`, `qtr125`) were deleted in the hosting
panel the same day. Left on the server: `qaqu803` (www) and `qars573` (staging), both verified.

Also worth a look in the panel: unused mailboxes, FTP users, subdomains and cron jobs. The hosting
panel credentials in `.env` do not work and should be updated or removed.

## Measuring how the SEO is doing

Where to look, most important first: Search Console → Performance (compare with the same period
**last year**, not last month; split queries containing "pereda" (brand: should hold) from the rest
(non-brand: should grow; very-long-tail town queries from the old doorway pages are expected to
fade)); Search Console → Pages (indexed ≈ 40, 404s ≈ 0, "Page with redirect" in the hundreds is
expected); Google Business Profile → Performance per store (calls, directions, website clicks); GA4
→ organic sessions. Weeks 1–4 fluctuate; 6–12 settle; the first fair comparison is late December.

Ideas agreed for later (2026-10-15):
- **Leads in GA4**: send an event (e.g. `generate_lead`, with the form name) when a form is sent
  successfully, and mark it as a key event. Answers "does the site bring more customers?", not just
  visits. Consent-gated like the rest of GA4; about an hour.
- **Monthly crawl report from the access logs** (`/logs/access_log.*`): what Googlebot fetched, old
  URLs still requested that fail, 5xx. Could run monthly from GitHub Actions like the monitor.

## Ideas, low priority

- Slugs for ambientes instead of UUIDs (needs a column and redirects from the old URLs).
- BreadcrumbList schema; GA Consent Mode v2.
- Unit tests or JS lint (CI today builds, lints the PHP and checks the redirect map).
- Periodic backups of the live database and `/media` (the hosting panel may offer them).
