# Database reference — Saneamientos Pereda

MySQL database `qaqu803` on `lldg503.servidoresdns.net`, migrated from Supabase. Schema lives in [`server/sql/schema.sql`](../server/sql/schema.sql). All 13 tables are in active use.

## How the frontend reaches each table

The React app never talks to MySQL directly. Four PHP endpoints sit in front of it:

| Endpoint | Purpose | Used by |
|---|---|---|
| `api/content.php?resource=<table>` | public **read** of content tables | `src/lib/supabase.js` shim → every public page |
| `api/admin.php` | session-protected **insert/update/delete** | admin panel (via the shim) |
| `api/forms.php?form=<name>` | public form **submissions** | the 4 form components |
| `api/auth.php` | admin **login/session** | `AdminLogin` + `App.jsx` |

`src/lib/supabase.js` is a compatibility shim mimicking the old supabase-js API, so components read with `supabase.from('table').select()...` unchanged. JSON columns (`ambientes.specs`, `tiendas.emails`) are decoded automatically.

## Content tables (public read + admin-managed)

| Table | What it holds | Shown on (public) | Managed in (admin) | Notable columns |
|---|---|---|---|---|
| `products` | Product catalog | `Productos`, `ProductosCategory` | `AdminProductos` | `category`, `featured`, `sold`, `price`, `image_url`, `product_type`, `display_order` |
| `product_photos` | Extra photos per product | `Productos`, `ProductosCategory` | `AdminProductos` | `product_id` → products, `image_url` |
| `brands` | Brand logos (carousel) | `BrandsCarousel` | `AdminProductos` | `name`, `logo_url`, `category` |
| `ambientes` | Inspiration "ambientes" | `Inspirate`, `AmbienteDetail` | `AdminAmbientes` | `title`, `summary`, `specs` (JSON), `cover_image_url` |
| `ambiente_photos` | Photos per ambiente | `AmbienteDetail` | `AdminAmbientes` | `ambiente_id` → ambientes, `caption` |
| `tiendas` | Store locations | `Instalaciones` (map) | `AdminTiendas` | `address`, `lat`, `lon`, `emails` (JSON), `hours_*` |
| `tienda_photos` | Photos per store | `Instalaciones` | `AdminTiendas` | `tienda_id` → tiendas, `image_url` |
| `site_settings` | Editable text, colors, images, CTAs across the whole site (key/value) | almost every page (`App`, `Hero`, `Footer`, `Navigation`, …) | `AdminAjustes`, `AdminHomepage`, `AdminPageEditor`, `AdminProductos` | `key` (unique), `value` |

`site_settings` is the most widely used table — it backs theme colors, hero logo/background, category banners, page descriptions, navbar labels, CTA buttons, etc. Keys are namespaced (e.g. `color_primary`, `hero_background`, `category_banner_<cat>`, `<page>_subtitle`).

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
