# Database reference — Saneamientos Pereda

MySQL database `qaqu803` on `lldg503.servidoresdns.net`. Schema lives in [`server/sql/schema.sql`](../server/sql/schema.sql). All 11 tables are in active use.

## How the frontend reaches each table

The React app never talks to MySQL directly. Four PHP endpoints sit in front of it:

| Endpoint | Purpose | Used by |
|---|---|---|
| `api/content.php?resource=<table>` | public **read** of content tables | `src/lib/api.js` client → every public page |
| `api/admin.php` | session-protected **insert/update/delete** | admin panel (via the shim) |
| `api/forms.php?form=<name>` | public form **submissions** | the 4 form components |
| `api/auth.php` | admin **login/session** | `AdminLogin` + `App.jsx` |

`src/lib/api.js` is a small chainable client, so components read with `api.from('table').select()...`. JSON columns (`ambientes.specs`, `tiendas.emails`) are decoded automatically.

## Content tables (public read + admin-managed)

| Table | What it holds | Shown on (public) | Managed in (admin) | Notable columns |
|---|---|---|---|---|
| `brands` | Brand logos (carousel) | `BrandsCarousel` | `AdminProductos` | `name`, `logo_url`, `category` |
| `ambientes` | Inspiration "ambientes" | `Inspirate`, `AmbienteDetail` | `AdminAmbientes` | `title`, `cover_image_url`, `summary`/`description`/`specs` (JSON) exist but are unused by the UI |
| `ambiente_photos` | Photos per ambiente | `AmbienteDetail` | `AdminAmbientes` | `ambiente_id` → ambientes, `caption` |
| `tiendas` | Store locations | `Instalaciones` (map + photo carousel) | `AdminTiendas` | `address`, `lat`, `lon`, `emails` (JSON), `hours_*`, `cover_image_url` |
| `tienda_photos` | Photos per store | `Instalaciones` (carousel) | `AdminTiendas` | `tienda_id` → tiendas, `image_url` |
| `site_settings` | Editable text, colors, images, CTAs and product-category content across the whole site (key/value) | almost every page (`App`, `Hero`, `Footer`, `Navigation`, `Productos`, `ProductosCategory`, …) | `AdminAjustes`, `AdminHomepage`, `AdminPageEditor`, `AdminProductos` | `key` (unique), `value` |

> The per-product catalogue (`products` / `product_photos`) was **removed** (the client has 15k+ SKUs, unmanageable one by one). Each product **category** is now a presentation page — descriptive text + photo carousel + brand carousel — driven entirely by `site_settings` keys (see below). The `ProductosCategory` page reads `category_desc_<cat>` / `category_photos_<cat>` + `brands`.

`site_settings` is the most widely used table — it backs theme colors, the four logos, hero background, hero link buttons, per-category text/photos, page descriptions, navbar labels, CTA buttons, etc. Keys are namespaced, e.g.:
- **Logos**: `hero_logo` (over the hero), `navbar_logo` (top bar), `favicon` (browser tab), `footer_logo`.
- **Hero**: `hero_background`, `hero_buttons` (JSON array of `{label, url}` external link buttons).
- **Per category**: `category_desc_<cat>`, `category_photos_<cat>` (JSON array of image URLs for the carousel). `category_banner_<cat>` is the legacy single-image key, still read as a fallback.
- **Misc**: `color_primary`, `<page>_subtitle`, repeatable lists as JSON (`area_faq`, `quienes_stats`, `pidecita_locations`, …).

## Form tables (written by public forms, read in admin)

Written via `api/forms.php` (not the shim); never publicly readable.

| Table | Form | Submitted from | Notes |
|---|---|---|---|
| `job_applications` | `candidatura` | `CareersModal` | optional CV PDF → `/media/cvs/`, `cv_url` |
| `denuncias` | `denuncia` | `CanalDenuncias` | generates an 8-digit `pin`; status looked up by PIN via GET |
| `presupuesto_requests` | `presupuesto` | `Presupuesto` | budget request |
| `cliente_requests` | `cliente` | `HazteCliente` | become-a-client request |

Each submission inserts a row **and** emails a notification to `MAIL_TO` (`ines@saneamientos-pereda.com`) via authenticated SMTP — see [email setup](../CLAUDE.md).

## Auth

| Table | Purpose |
|---|---|
| `admin_users` | Admin panel accounts (email + bcrypt `password_hash`). Login via `api/auth.php`; currently one user, `admin@saneamientos-pereda.com`. |

## Maintenance

- `node scripts/db-audit.mjs` — row counts, form-table contents, and all `/media/` references (orphan check).
- `node scripts/audit-media.mjs` — recursive listing of `/html/dev/media`.
Both connect directly to MySQL using `.env` credentials (port 3306, SSL).
