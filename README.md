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
npm run deploy /html/dev            # sincroniza imágenes base, build y sube el frontend
node scripts/deploy-backend.mjs     # sube el backend PHP + genera config.php (solo si cambia el backend)
```

Otros scripts útiles: `npm run sync:base`, `npm run sftp:ls <dir>`, `scripts/db-audit.mjs`, `scripts/audit-media.mjs`. Los one-off de la migración están en `scripts/archive/`.

## Documentación

- **[docs/GUIA-ADMIN.md](docs/GUIA-ADMIN.md)** — guía para el cliente: cómo editar el contenido desde el panel.
- **[docs/RUNBOOK.md](docs/RUNBOOK.md)** — manual técnico: hosting, despliegue, variables, scripts, copias y resolución de problemas.
- **[docs/DATABASE.md](docs/DATABASE.md)** — referencia de la base de datos (tablas y uso en el frontend).
- **[CLAUDE.md](CLAUDE.md)** — contexto del proyecto para asistentes de IA / desarrolladores.

## Estado (2026-07-01)

Desplegado y funcionando como **staging** en `https://dev.saneamientos-pereda.com` (sobre `/html/dev`).

- **DNS + SSL resueltos** (2026-07-01): el subdominio ya publica en DNS y sirve HTTPS con el certificado comodín `*.saneamientos-pereda.com`, con redirección HTTP→HTTPS. Ya no hace falta la entrada `hosts` local.
- **Contenido** editable desde el panel; el cliente está terminando de cargar los datos reales (fotos de categorías, logos de marcas, FAQ del Área Profesional, etc.).
- **Cookies + analítica**: banner de consentimiento activo; Google Analytics (GA4) se activa solo tras aceptar cookies **y** cuando se rellene el *ID de medición* en Ajustes (vacío por ahora = sin seguimiento).
- **Sin comercio**: la web no vende nada; todo el ecommerce vive en `ecommerce.saneamientos-pereda.com`.
- **Móvil** revisado y pulido.

## Próximos pasos (salida a producción)

El código está listo; la salida a producción depende de contenido + migración, no de infraestructura:

1. **Cliente**: terminar de cargar el contenido real desde el panel.
2. **Analítica**: pegar el *ID de GA4* (`G-XXXXXXXXXX`) en Ajustes (o confirmar que no se quiere analítica).
3. **SEO / redirecciones**: la web actual (WordPress en `/html`) tiene ~750 URLs indexadas (páginas SEO tipo `…-en-asturias`, tienda WooCommerce, blog). Hay un mapa de redirecciones 301 preparado en **[docs/prod-redirects.htaccess](docs/prod-redirects.htaccess)** (URLs antiguas → nuevas rutas; tienda → subdominio ecommerce). Conviene revisar Search Console para proteger las URLs con tráfico real.
4. **Corte a producción**: mover el docroot del dominio principal a la SPA (`/html` es el WordPress vivo del cliente — **hacer copia antes**), pegar el bloque de redirecciones en el `.htaccess` de producción y activar Let's Encrypt en el dominio principal.
5. **Post-lanzamiento**: enviar el nuevo sitemap en Search Console y vigilar los 404.

Detalles técnicos completos en **[CLAUDE.md](CLAUDE.md)** y **[docs/RUNBOOK.md](docs/RUNBOOK.md)**.
