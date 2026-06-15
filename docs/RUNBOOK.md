# Runbook técnico — Saneamientos Pereda

Manual de operación y mantenimiento. Para la arquitectura general ver [README](../README.md); para las tablas ver [DATABASE](DATABASE.md); para contexto de desarrollo ver [CLAUDE.md](../CLAUDE.md).

## Hosting

- Panel: **panelcontrolhosting.com** ("Hosting Avanzado Linux"). Apache + PHP 8.2 + MySQL, ~54 GB.
- IP del servidor web: **217.76.142.23**.
- SFTP: **ftp.saneamientos-pereda.com:22**, usuario = nombre de dominio. Credenciales en `.env` (`SFTP_*`).
- **Raíz `/html` = WordPress en producción del cliente — NO TOCAR.** La app se despliega solo en **`/html/dev`**.
- Subdominio `dev.saneamientos-pereda.com` apuntando a `/html/dev` (pendiente de DNS, ver Problemas conocidos).

## Variables de entorno (`.env`, NO se commitea)

| Clave | Uso |
|---|---|
| `SFTP_HOST/PORT/USER/PASS` | despliegue por SFTP |
| `DB_HOST/NAME/USER/PASS` | MySQL (`DB_HOST=lldg503.servidoresdns.net`, ver Base de datos) |
| `SMTP_HOST/PORT/SECURE/USER/PASS` | envío de email de los formularios |
| `MAIL_FROM` / `MAIL_TO` | remitente y destinatario de los avisos |
| `SETUP_TOKEN` | protege `setup.php` (lo autogenera `deploy-backend`) |
| `VITE_SUPABASE_URL/ANON_KEY` | legado, solo lo usa `scripts/archive/export-supabase.mjs` |

En el servidor, estas se traducen a `server/api/config.php` (generado por los scripts; nunca se commitea). Plantilla: `server/api/config.sample.php`.

## Puesta en marcha en una máquina nueva

1. Instalar **Node 24+** (y **PHP 8.2** opcional, para `php -l`).
2. `npm install`.
3. Copiar `.env` por un canal privado (nunca por git/email).
4. Hosts local (mientras el DNS no publique): añadir `217.76.142.23 dev.saneamientos-pereda.com` a `C:\Windows\System32\drivers\etc\hosts`.

## Despliegue

| Comando | Qué hace |
|---|---|
| `npm run deploy /html/dev` | sincroniza imágenes base (sync:base), hace `build` y sube `dist/` a `/html/dev` |
| `node scripts/deploy-backend.mjs` | sube `server/api/*` + `schema.sql` + genera y sube `config.php` (úsalo al cambiar el backend) |
| `node scripts/push-api.mjs` | sube solo los `.php` + schema (iteración rápida, no toca config ni media) |
| `node scripts/push-config.mjs` | regenera y sube solo `config.php` desde `.env` |
| `npm run sync:base` | refresca `public/base/` (logo+hero) desde la BBDD |
| `node scripts/prune-deployed.mjs <archivos>` | borra del servidor archivos eliminados localmente (deploy solo añade/sobrescribe) |

El frontend usa rutas relativas `/api` y `/media`, así que funciona en cualquier carpeta/host.

## Base de datos

- MySQL `qaqu803`. **`DB_HOST=lldg503.servidoresdns.net`** (el servidor real de BBDD): el nombre del panel `qaqu803.saneamientos-pereda.com` es un CNAME no publicado (ver Problemas), y `localhost` apunta al MySQL propio del host web, que NO tiene esta BBDD.
- Esquema: `server/sql/schema.sql` (UUIDs como CHAR(36); `specs`/`emails` como JSON). El mapa de columnas permitidas por la API está en `TABLE_COLUMNS` de `server/api/db.php` — **mantener ambos sincronizados**.
- Auditorías: `node scripts/db-audit.mjs` (conteos + referencias a `/media`), `node scripts/audit-media.mjs` (árbol de `/media`). Conectan directo por el puerto 3306 con SSL.
- **Re-importación desde cero** (solo si hiciera falta): re-desplegar `setup.php` (está borrado del servidor) con `deploy-backend`, subir los JSON a `api/import/`, y hacer `POST /api/setup.php` con `{token, admin_email, admin_password}`. El export original está en el historial de git (`migration-data/`) y en `scripts/archive/export-supabase.mjs`.
- **Copias de seguridad**: la BBDD es ahora el dato vivo. Recomendado un `mysqldump` periódico (o export desde el panel) y backup de `/html/dev/media/`.

## Imágenes / media

- Subidas del panel → `/html/dev/media/...` (nombres únicos, así esquivan la caché de estáticos). El frontend las optimiza a WebP ≤1920px antes de subir (`src/lib/upload.js`).
- Imágenes base (logo, hero) bundleadas en `public/base/` y mantenidas al día por `sync-base-images.mjs` (corre antes de cada deploy). El resto es 100% de BBDD.
- Recompresión puntual: `scripts/optimize-images.mjs` (sobre `public/`).

## Email (formularios)

- `server/api/mailer.php` envía por **SMTP autenticado** vía `smtp.serviciodecorreo.es:465` (SSL) con el buzón `web@saneamientos-pereda.com`. Pasa el SPF del dominio (`include:_spf.serviciodecorreo.es`). **No usa Resend** (se descartó).
- Destinatario: `MAIL_TO` (admite lista separada por comas). Para añadir/quitar destinatarios, editar `.env` y `node scripts/push-config.mjs`.
- Los formularios nunca fallan por un problema de email (el envío es "best-effort").

## Admin / auth

- Sesiones PHP + bcrypt en la tabla `admin_users`. Login vía `api/auth.php`; acceso desde el enlace **«Admin»** del footer.
- Crear/cambiar admin: vía `setup.php` (re-import) o un `INSERT`/`UPDATE` directo con `password_hash(..., PASSWORD_BCRYPT)`.

## Problemas conocidos

- **Publicación de DNS atascada (proveedor)**: los registros añadidos en el editor del panel (`dev` A, `www.dev` A, `qaqu803` CNAME) aparecen pero **no los sirven** ns1/ns2.dns-servicios.com, mientras que los registros antiguos sí resuelven. Consecuencias: el subdominio dev necesita entrada en `hosts` y va por **HTTP** (sin SSL); la BBDD se conecta por `lldg503...` directo. **Acción**: ticket al proveedor para que regeneren/republiquen la zona. Al resolverse: emitir Let's Encrypt en el panel (sección SSL).
- **Caché de estáticos del hosting**: sirve copias cacheadas de archivos en la misma ruta durante un TTL, incluso tras borrarlos, e ignora el `?v=`. Las subidas del panel usan nombres únicos, así que no se ven afectadas.

## Salida a producción (checklist)

1. Resolver la publicación de DNS y emitir SSL para el subdominio.
2. Decidir la ubicación de producción y su relación con el WordPress de `/html`.
3. Revisar SEO (limitación conocida: SPA sin router, una sola URL).
4. Configurar copias de seguridad periódicas (MySQL + `/media`).
5. Pausar/eliminar el proyecto Supabase antiguo (`mxhpggzfkrlqmguwichm`).
6. Rotar contraseñas si fuera necesario (admin, SMTP, DB).
