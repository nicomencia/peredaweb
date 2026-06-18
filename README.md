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

## Estado

Desplegado y funcionando en el subdominio de desarrollo `/html/dev`. Pendiente: publicación del DNS del subdominio + certificado SSL (lado del proveedor de hosting) y salida a producción. Ver RUNBOOK.
