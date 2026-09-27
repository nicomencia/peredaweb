# Saneamientos Pereda

Sitio web de **Saneamientos Pereda** (empresa de baño, fontanería y materiales de construcción, Oviedo). SPA en React 19 + Vite 7 con panel de administración integrado, sobre backend propio en PHP 8.2 + MySQL alojado en el hosting del cliente (datos en MySQL, imágenes en disco bajo `/media/`).

## Arquitectura

```
Navegador
  ├─ React SPA (estático)            HTML / JS / CSS / imágenes base
  ├─ /api/*.php   (PHP + MySQL)      contenido, admin, formularios, login
  └─ /media/*     (disco servidor)   imágenes subidas desde el panel
```

- **Frontend** (`src/`): SPA con **react-router** (BrowserRouter), con URLs reales por página; `src/App.jsx` mantiene un adaptador `setCurrentView(view)` para que los componentes naveguen sin cambios. Contenido y ajustes se leen de la BBDD vía un pequeño cliente encadenable (`src/lib/api.js`) que llama al backend PHP. Imágenes optimizadas en cliente antes de subir (`src/lib/upload.js`).
- **Backend** (`server/api/`): endpoints PHP sobre MySQL (PDO) — `content.php` (lectura pública), `admin.php` (CRUD protegido por sesión), `auth.php` (login admin), `upload.php` (subida de imágenes), `forms.php` (formularios) y `mailer.php` (email SMTP). Esquema en `server/sql/schema.sql`. Un front controller `public/index.php` (vía `.htaccess`) sirve el shell de la SPA con meta SEO por ruta y genera `sitemap.xml`/`robots.txt`.
- **Email**: los formularios envían aviso por SMTP autenticado a través del proveedor del propio dominio (serviciodecorreo.es).

## Puesta en marcha

Requisitos: Node 24+, y `.env` con las credenciales (ver `.env` / `server/api/config.sample.php`).

```bash
npm install
npm run dev      # desarrollo local (proxya /api y /media al hosting dev)
```

## Despliegue

```bash
npm run deploy                      # sincroniza imágenes base, build y sube el frontend a staging
node scripts/push-api.mjs           # sube los .php del backend + schema (nunca setup.php ni config.php)
node scripts/push-config.mjs        # regenera y sube config.php desde .env
# Producción: el mismo comando con --prod (npm run deploy -- --prod)
```

Otros scripts útiles: `npm run sync:base`, `npm run sftp:ls <dir>`, `scripts/db-audit.mjs`, `scripts/audit-media.mjs`, `scripts/check-redirects.mjs` (valida el mapa 301 contra las 755 URLs antiguas). Los one-off de la migración están en `scripts/archive/`.

## Documentación

- **[docs/GUIA-ADMIN.md](docs/GUIA-ADMIN.md)** — guía para el cliente: cómo editar el contenido desde el panel.
- **[docs/RUNBOOK.md](docs/RUNBOOK.md)** — manual técnico: hosting, despliegue, variables, scripts, copias y resolución de problemas.
- **[docs/DATABASE.md](docs/DATABASE.md)** — referencia de la base de datos (tablas y uso en el frontend).
- **[docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)** — pendientes: proceso de lanzamiento y mejoras SEO posteriores.
- **[CLAUDE.md](CLAUDE.md)** — contexto del proyecto para asistentes de IA / desarrolladores.

## Estado (2026-09-28)

Listo para producción. Funciona como **staging** en `https://dev.saneamientos-pereda.com` (`/html/dev`) y sale a `www.saneamientos-pereda.com` sustituyendo al WordPress de `/html`.

- **SEO de lanzamiento hecho**: enlaces rastreables, títulos por página, sitemap completo, 404 reales, gzip, apex → www, y **mapa 301 de las 755 URLs antiguas** dentro del propio `public/.htaccess`. Fuera de `www`, todo va con `noindex`.
- **Analítica**: GA4 configurado en Ajustes; solo carga en `www` y tras aceptar cookies.
- **Formularios** probados de extremo a extremo (email SMTP incluido). Canal de denuncias gestionable desde el panel; los CV solo son accesibles para administradores.
- **Sin comercio propio**: la tienda pública es `www.saneamientos-pereda.es` y el acceso profesional `ecommerce.saneamientos-pereda.com`.

Pasos de salida a producción y seguimiento posterior: **[docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)** (secciones C y D).
