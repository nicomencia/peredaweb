# Improvements backlog

Findings from a full review on **2026-09-15** (done on a secondary machine — no
application code was changed). Priority order inside each section; delete items
as they land.

- **[A. SEO launch blockers](#a-seo-launch-blockers)** — must be done before the WordPress → SPA swap.
- **[B. Redirect map](#b-redirect-map)** — fixes to `docs/prod-redirects.htaccess`, checked by `scripts/check-redirects.mjs`.
- **[C. Launch process](#c-launch-process)** — the non-code steps.
- **[D. SEO after launch](#d-seo-after-launch)** — worthwhile, not blocking.
- **[E. Other findings](#e-other-findings)** — bugs, gaps and housekeeping outside SEO.

**Client report.** A Spanish report comparing the old and new site for the client:
https://claude.ai/artifact/1ma79BJDk5faKfGqxgeDNZ. It describes the site **after A and B are
done** — don't share it before they are live, and update its redirect chart if the final
counts from `check-redirects.mjs` differ. Its chart assumes B items 1–3 applied as written
(`/mantenimiento/` counted among corporate pages; optional items 4–5 not applied).

## Facts established during the review

- **Canonical host is `https://www.saneamientos-pereda.com`.** The apex → www 301 is sent by
  **WordPress** (`X-Redirect-By: WordPress`), not Apache; Apache only upgrades http → https on
  the same host. So the hardcoded `www` in the `index.html` JSON-LD is correct, and the apex
  redirect disappears with WordPress unless recreated (A4).
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

## A. SEO launch blockers

### A1. Make internal links crawlable

Every internal link except one (the policy link in `CookieConsent`) is a
`<button onClick={() => setCurrentView(...)}>`. Crawlers don't click buttons, so no page links
to any other — and since the category and ambiente pages are not in the sitemap either (A2),
they are undiscoverable, although ~700 redirects will land on them.

Switch to react-router `<Link to="/path">`: it renders a real `<a href>` and keeps SPA
navigation. Keep side effects (closing the mobile menu) in the Link's `onClick`, keep the
classNames, and reset anchor styles where buttons were styled. Call sites:

- [`Navigation.jsx`](../src/components/Navigation.jsx) — logo, menu items, mega-menu
  categories, mobile categories, Área Profesional. Keep the "Productos" trigger a Link to
  `/productos` so the hover dropdown still works.
- [`Footer.jsx`](../src/components/Footer.jsx) — the "Navegar" list and the legal links (the
  cookie-settings control stays a button).
- [`Productos.jsx:101`](../src/components/Productos.jsx#L101) category cards,
  [`Inspirate.jsx:91`](../src/components/Inspirate.jsx#L91) ambiente cards.
- [`AboutIntro.jsx:64`](../src/components/AboutIntro.jsx#L64),
  [`AreaProfesional.jsx:85`](../src/components/AreaProfesional.jsx#L85),
  [`Instalaciones.jsx:79`](../src/components/Instalaciones.jsx#L79), and the back buttons in
  `AmbienteDetail.jsx` and `ProductosCategory.jsx`.

Move `VIEW_TO_PATH` out of `App.jsx` into a small module so components build hrefs from the
same map the `setCurrentView` adapter uses.

Verify: on any page, `document.querySelectorAll('a[href^="/"]').length` in the console should
be in the dozens, not 0–1.

### A2. Complete the sitemap

[`public/index.php`](../public/index.php) lists 18 static routes. Add:

- `/productos/<key>` for the 10 keys in `Productos.jsx`: sanitarios, griferia, muebles-bano,
  climatizacion, fontaneria, ceramica, materiales, mamparas, herramientas, electricidad.
- `/inspirate/<id>` for every row of `ambientes`. On the server `index.php` sits next to
  `api/`, so `require __DIR__ . '/api/db.php'` works (in the repo they live apart, in `public/`
  and `server/api/`). Wrap the query in try/catch so the sitemap still renders if MySQL is down.
- Optional: `<lastmod>`.

### A3. Return real 404s

`index.php` serves the SPA shell with `200` for any path, and the SPA's catch-all is
`<Navigate to="/" replace />` in `App.jsx`, so every unknown URL is a soft 404 showing the home
page. After the swap that covers every old URL the map misses and every old
`/wp-content/uploads/...` image. On top of that, `/productos/<anything>` renders the Baño page
(`ProductosCategory.jsx` falls back to `CATEGORY_CONFIG.bano`).

- `index.php`: pick the status before serving — 200 for `$ROUTES`, `/productos/<known key>`,
  `/inspirate/<existing id>` (DB lookup) and `/admin`; otherwise `http_response_code(404)` plus
  `<meta name="robots" content="noindex">`. Keep serving the shell so the SPA renders a page.
- SPA: replace the `*` route's `<Navigate>` with a small NotFound page (links to home,
  productos, tiendas). An unknown category renders NotFound instead of Baño. `AmbienteDetail`
  already has a "no encontrado" state.
- `/productos/bano` is not in the grid: 404 it or 301 it to `/productos`.
- `/index.html` is served as a static file (no meta injection, no canonical): add
  `RewriteRule ^index\.html$ / [R=301,L]` to `public/.htaccess`.

Verify on dev — expect 404 four times, then 200:

```sh
for p in /esta-pagina-no-existe /productos/no-existe /inspirate/no-existe /wp-content/uploads/x.jpg /productos/mamparas; do
  curl -s --ssl-no-revoke -o /dev/null -w "%{http_code} $p\n" "https://dev.saneamientos-pereda.com$p"
done
```

### A4. Recreate the apex → www redirect

Canonicals, `og:url` and the sitemap are built from `HTTP_HOST`, so without it both
`saneamientos-pereda.com` and `www.` serve a complete self-canonical copy of the site. First
rules of the production `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^saneamientos-pereda\.com$ [NC]
RewriteRule ^ https://www.saneamientos-pereda.com%{REQUEST_URI} [R=301,L]
```

http → https is the hosting panel's "Redirección HTTPS" — confirm it is on for the production
site after the swap. Make the redirect-map targets absolute
(`https://www.saneamientos-pereda.com/...`) so an old `http://` apex URL takes one hop, not three.

SSL: the `*.saneamientos-pereda.com` wildcard expires **2026-12-16**. Check whether it also
lists the bare apex (wildcards often, not always, do); the apex needs a valid certificate for
its redirect to work over HTTPS. Give the renewal an owner.

### A5. Compression and caching

The old site on the same host is gzipped (home: 54 KB over the wire), so the server can do it.
Add to `public/.htaccess`:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json application/xml image/svg+xml
</IfModule>
<IfModule mod_headers.c>
  <If "%{REQUEST_URI} =~ m#^/assets/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
</IfModule>
```

`/assets/*` names are content-hashed, so a one-year immutable cache is safe; not for `/base/`
or `/media/` (paths get reused). If `mod_deflate` skips PHP's JSON, gzip it in `json_out()`
([`db.php`](../server/api/db.php)) with `ob_start('ob_gzhandler')`. Mind the host's static
cache layer (CLAUDE.md) when verifying:

```sh
curl -s --ssl-no-revoke -o /dev/null -D - -H 'Accept-Encoding: gzip' https://dev.saneamientos-pereda.com/ | grep -i content-encoding
```

### A6. Titles and descriptions that carry keywords

The home title is just "Saneamientos Pereda", all categories share "Productos | Saneamientos
Pereda" plus the catalogue description, and all ambientes share "Inspírate".

- Home: `Saneamientos Pereda | Baño, fontanería y materiales de construcción en Oviedo` —
  quoted verbatim in the client report; change both together.
- Categories: e.g. `Mamparas de ducha y baño en Oviedo y Asturias | Saneamientos Pereda`, with
  its own description.
- Ambientes: the ambiente's title (server: DB lookup in `index.php`; client: once loaded).

The metadata exists twice — `$META` in `index.php` (what crawlers get) and `TITLES` /
`DESCRIPTIONS` in `App.jsx` (set on client-side navigation) — and has already drifted
(`/desistimiento`). Make one source: `index.php` can also inline the whole map as
`<script>window.__SEO__ = …</script>` for `App.jsx` to read instead of its own copy.

### A7. Keep staging out of search engines

Dev invites indexing today (robots `Allow: /`, sitemap and canonicals on `dev.`). Once
production is live, an indexed dev copy is duplicate content. In `index.php`, when
`HTTP_HOST` is not `www.saneamientos-pereda.com` (allow-list production rather than
block-listing dev), send `X-Robots-Tag: noindex, nofollow`, inject
`<meta name="robots" content="noindex">` and drop the `Sitemap:` line from robots.txt. Don't
`Disallow: /` as well — a crawler that can't fetch the page can't see the noindex.

---

## B. Redirect map

Run `node scripts/check-redirects.mjs` after each change. It simulates the rules against the
755 old URLs, follows chains, checks every destination is a real route of the new site
(read from `index.php` and `Productos.jsx`), and exits 1 while anything falls through.
`--verbose` lists the URLs per destination; `--refresh` re-downloads the old sitemap right
before the swap in case the client added pages (it refuses once the live sitemap is no longer
the Yoast one).

Current result: 734 redirect, 5 are served under the same path, **16 fall through**, and
**77 land on the generic `/productos`**.

**Ready-made fix:** [`docs/seo/prod-redirects.proposed.htaccess`](seo/prod-redirects.proposed.htaccess)
applies items 1–3 and 6 plus the A4 host rule with absolute targets; the checker resolves all
755 URLs on it (exit 0). One placeholder to settle (`/mantenimiento/`), then replace the
original with it.

1. **Fall-throughs (16):**
   - `/mejores-mamparas-de-bano-en-*` (7) and `/instalacion-de-mamparas-de-ducha/` →
     `/productos/mamparas`.
   - `/consentimiento/` and `/tratamiento-candidato/` (consent texts) → `/politica-privacidad`.
   - `/mantenimiento/` (title "Mantenimiento - Saneamientos Pereda") → read it and decide.
   - WordPress leftovers → 410:
     `RewriteRule ^(hola-mundo|prueba|author|category|area-item)(/.*)?$ - [G,L]`
2. **Too generic.** `^comprar[-/]` and `^precio[-/]` match on the first word only. Put these
   before them (49 / 14 / 14 URLs):

   ```apache
   RewriteRule ^(comprar|precio)-(mueble|muebles|armario|armarios|espejo|espejos)[-/] /productos/muebles-bano [R=301,L]
   RewriteRule ^(comprar|precio)-(mampara|mamparas)[-/] /productos/mamparas [R=301,L]
   RewriteRule ^(comprar|precio)-(grifo|grifos|griferia|griferias)[-/] /productos/griferia [R=301,L]
   ```
3. **Wrong category.** `calefaccion|radiador|radiadores|caldera|calderas` go to
   `climatizacion`, but the new site files heating under `fontaneria` ("Fontanería y
   calefacción"). Split the rule; `climatizacion|aerotermia` stay. In the snapshot:
   `/calefaccion-fontaneria-en-oviedo/`.
4. Optional: `/tiendas-griferia-*` → `/productos/griferia` instead of `/instalaciones`.
5. Portfolio → `/inspirate` is right. Cellini and Desert exist as new ambientes and could go
   1:1 to their `/inspirate/<id>` (ids from `/api/content.php?resource=ambientes`).
6. Old Yoast child sitemaps (`/page-sitemap.xml`, `/post-sitemap.xml`,
   `/portfolio-sitemap.xml`, `/area-item-sitemap.xml`, `/category-sitemap.xml`,
   `/author-sitemap.xml`) and `/wp-sitemap.xml` → `/sitemap.xml`. Only `sitemap_index.xml` is
   handled today.
7. `/wp-content/uploads/*` → 410, unless old images bring Google Images traffic (then keep a
   copy of the folder). A3 turns them into 404s otherwise.
8. Host rule first and absolute targets (A4). Optionally a last rule stripping trailing slashes
   so `/financiacion/` → `/financiacion`:
   `RewriteCond %{REQUEST_FILENAME} !-d` + `RewriteRule ^(.+)/$ https://www.saneamientos-pereda.com/$1 [R=301,L]`.
   The checker follows the chains this creates and flags any that end on an unknown route.

---

## C. Launch process

**Before the swap**
- Search Console: export Performance → Pages (last 16 months). Every old URL with real clicks
  gets its most relevant destination, or its content recreated.
- Verify the Search Console property **by DNS** (Domain property). If it is verified through
  WordPress (Yoast meta tag or an HTML file in `/html`), removing WordPress breaks verification
  in the middle of the migration.
- Full backup of `/html` (files + WordPress database).
- A1–A7 and B done; `node scripts/check-redirects.mjs --refresh` exits 0.

**Swap day**
- Point the docroot at the new build; redirect block above the SPA rules; confirm
  http → https and apex → www.
- Spot-check an old URL per rule with curl; submit `https://www.saneamientos-pereda.com/sitemap.xml`.

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

1. **The admin panel can't show form submissions.** Candidaturas, denuncias, presupuestos,
   clientes and desistimientos only arrive by email. The denuncia email omits the facts and says
   "Accede al panel para ver el contenido completo", but no such view exists, and nothing sets
   `estado` / `respuesta`, so a PIN lookup always shows "pendiente". `admin.php` can already
   update `denuncias`; what's missing is an authenticated read action and an admin tab. For a
   whistleblowing channel this likely matters legally.
2. **Local dev proxy.** [`vite.config.js`](../vite.config.js) proxies to
   `http://dev.saneamientos-pereda.com`, which now answers `302` to https, so API calls through
   the proxy most likely fail on CORS. Use
   `{ target: 'https://dev.saneamientos-pereda.com', changeOrigin: true }`. Not verified by
   running dev.
3. **`deploy-backend.mjs` re-uploads `setup.php`** too (it uploads all of `server/api/`), not
   only `push-api.mjs` — run `node scripts/prune-deployed.mjs api/setup.php` after either, or
   filter it out of both uploads. Its header comment still mentions `RESEND_API_KEY`.
4. **CVs are public by URL.** `/media/cvs/*.pdf` needs no login (names aren't guessable, but a
   forwarded link is enough). Consider serving them through an authenticated PHP endpoint and
   denying direct access.
5. **Docs drift.** [`DATABASE.md`](DATABASE.md) says 11 tables / 4 forms (misses
   `desistimiento_requests`); [`GUIA-ADMIN.md:76`](GUIA-ADMIN.md#L76) says recipients need the
   developer, contradicting line 60 (Ajustes → Destinatarios); CLAUDE.md's forms line misses
   `desistimiento`; `index.php`'s header says robots.txt is static, but it generates it.
6. **No tests, lint or CI.** `check-redirects.mjs` is the first check that can gate anything.
7. **Naming trap:** [`App.jsx:234`](../src/App.jsx#L234) defines a local `loadSettings` that
   shadows the one imported from `lib/settings.js`.
