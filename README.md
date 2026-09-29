# Saneamientos Pereda

Web de **Saneamientos Pereda**, empresa de baño, fontanería y materiales de construcción de Oviedo con
cuatro tiendas en Asturias. SPA en React 19 + Vite 7 con panel de administración integrado, sobre un
backend propio en PHP 8.2 + MySQL en el hosting del cliente.

**En producción desde el 28 de septiembre de 2026** en <https://www.saneamientos-pereda.com>,
sustituyendo a la web anterior en WordPress. Proyecto terminado y entregado (`v1.0`); en
mantenimiento.

## Qué hace

- **Web pública**: portada, productos (10 categorías con texto, fotos y marcas), ambientes de
  inspiración, tiendas con mapa y horarios, quiénes somos, área profesional, preguntas frecuentes,
  financiación, cita previa y páginas legales.
- **Formularios**: presupuesto, hazte cliente, empleo (con CV), desistimiento y **canal de
  denuncias** con PIN de seguimiento. Se guardan en la base de datos y avisan por correo.
- **Panel de administración** (`/admin`): casi todo el contenido es editable (textos, imágenes,
  logos, ambientes, tiendas, categorías, avisos), gestión del canal de denuncias, destinatarios de
  cada formulario y una cuenta por persona.
- **SEO**: URLs reales por página con título y descripción propios, sitemap y robots generados,
  404 reales, datos estructurados de la empresa y sus tiendas (con horarios), imagen para compartir,
  texto de cada página legible sin JavaScript, y **redirecciones 301 de las 755 direcciones de la web
  anterior**.
- **Privacidad**: analítica (GA4) solo con consentimiento de cookies; CV y denuncias solo para
  administradores; límite de intentos en el login y en la consulta por PIN.

## Entornos

| | Producción | Staging (pruebas) |
|---|---|---|
| Dirección | www.saneamientos-pereda.com | dev.saneamientos-pereda.com (oculta a Google) |
| Carpeta en el servidor | `/html` | `/html/dev` |
| Base de datos | `qaqu803` | `qars573` (independiente) |

El contenido real se edita en www. Staging es para probar código y cambios; se refresca desde www
con `node scripts/refresh-dev.mjs`.

## Arquitectura

```
Navegador
  ├─ React SPA (estático)          /assets, /base      HTML, JS, CSS, imágenes base
  ├─ public/index.php                                  meta SEO por ruta, sitemap, robots, 404
  ├─ /api/*.php  (PHP + MySQL)                         contenido, admin, formularios, login
  └─ /media/*    (disco del servidor)                  imágenes subidas desde el panel
```

- **Frontend** (`src/`): react-router; el contenido se lee de la base de datos con un pequeño
  cliente encadenable (`src/lib/api.js`). Las imágenes se optimizan en el navegador antes de subir.
- **Backend** (`server/api/`): `content.php` (lectura pública), `admin.php` (CRUD con sesión),
  `auth.php`, `upload.php`, `forms.php`, `cv.php` y `mailer.php` (SMTP del dominio). Esquema en
  `server/sql/schema.sql`.
- **`public/.htaccess`**: compresión, caché, www y https, y el mapa de redirecciones.

## Puesta en marcha

Node 24+ y el `.env` con las credenciales (se pasa por un canal privado, nunca por git).

```bash
npm install
npm run dev        # desarrollo local; /api y /media van a staging
```

## Despliegue

Primero a staging, después a producción. **En Windows, desde PowerShell.**

```bash
npm run deploy                     # frontend a staging
node scripts/push-api.mjs          # backend PHP a staging
npm run deploy -- --prod           # lo mismo a producción (y push-api.mjs --prod)
node scripts/verify-live.mjs       # comprobación completa de www (--dev para staging)
```

**Comprobaciones automáticas** (GitHub Actions): en cada push se compila, se revisa el PHP y se
valida el mapa de redirecciones; cada día se comprueba www y staging de punta a punta, incluido el
certificado SSL con 21 días de margen. Si algo falla, GitHub avisa por correo.

## Documentación

- **[docs/GUIA-ADMIN.md](docs/GUIA-ADMIN.md)**: guía del panel para el cliente.
- **[docs/RUNBOOK.md](docs/RUNBOOK.md)**: manual técnico (hosting, variables, scripts, mantenimiento).
- **[docs/DATABASE.md](docs/DATABASE.md)**: tablas y su uso.
- **[docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)**: pendientes tras el lanzamiento.
- **[docs/LAUNCH.md](docs/LAUNCH.md)**: cómo se hizo el cambio desde WordPress.
- **[CLAUDE.md](CLAUDE.md)**: contexto técnico completo para desarrolladores y asistentes de IA.
