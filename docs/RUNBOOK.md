# Runbook técnico — Saneamientos Pereda

Manual de operación y mantenimiento. Para la arquitectura general ver [README](../README.md); para las tablas ver [DATABASE](DATABASE.md); para contexto de desarrollo ver [CLAUDE.md](../CLAUDE.md).

## Hosting

- Panel: **panelcontrolhosting.com** ("Hosting Avanzado Linux"). Apache + PHP 8.2 + MySQL, ~54 GB.
- IP del servidor web: **217.76.142.23**.
- SFTP: **ftp.saneamientos-pereda.com:22**, usuario = nombre de dominio. Credenciales en `.env` (`SFTP_*`).
- **Raíz `/html` = WordPress en producción del cliente — NO TOCAR.** La app se despliega solo en **`/html/dev`**.
- Subdominio `dev.saneamientos-pereda.com` → `/html/dev`. **DNS y SSL resueltos (2026-07-01)**: resuelve en resolvers públicos y sirve HTTPS con el comodín `*.saneamientos-pereda.com` (Sectigo DV, válido hasta 2026-12-16), con redirección HTTP→HTTPS.

## Variables de entorno (`.env`, NO se commitea)

| Clave | Uso |
|---|---|
| `SFTP_HOST/PORT/USER/PASS` | despliegue por SFTP |
| `DB_HOST/NAME/USER/PASS` | MySQL (`DB_HOST=lldg503.servidoresdns.net`, ver Base de datos) |
| `SMTP_HOST/PORT/SECURE/USER/PASS` | envío de email de los formularios |
| `MAIL_FROM` / `MAIL_TO` | remitente y destinatario de los avisos |
| `SETUP_TOKEN` | protege `setup.php` (solo para una re-importación desde cero) |

En el servidor, estas se traducen a `server/api/config.php` (generado por los scripts; nunca se commitea). Plantilla: `server/api/config.sample.php`.

## Puesta en marcha en una máquina nueva

1. Instalar **Node 24+** (y **PHP 8.2** opcional, para `php -l`).
2. `npm install`.
3. Copiar `.env` por un canal privado (nunca por git/email).
4. ~~Hosts local~~ — **ya no hace falta** (el DNS publica desde 2026-07-01). Si tienes la línea `217.76.142.23 dev.saneamientos-pereda.com` en `C:\Windows\System32\drivers\etc\hosts` de la migración, puedes borrarla.

## Despliegue

| Comando | Qué hace |
|---|---|
| `npm run deploy` | sincroniza imágenes base (sync:base), hace `build` y sube `dist/` a `/html/dev` |
| `node scripts/push-api.mjs` | sube los `.php` + schema (no toca config ni media, y **nunca sube `setup.php`**) |
| `node scripts/push-config.mjs` | regenera y sube solo `config.php` desde `.env` |
| `npm run sync:base` | refresca `public/base/` (logo+hero) desde la BBDD |
| `node scripts/prune-deployed.mjs <archivos>` | borra del servidor archivos eliminados localmente (deploy solo añade/sobrescribe) |

Todos van a staging (`/html/dev`) por defecto y a producción (`/html`) con **`--prod`** (`npm run deploy -- --prod`). `deploy` y `prune-deployed` se niegan a tocar `/html` mientras siga el WordPress. El cambio de WordPress a la web nueva es `node scripts/go-live.mjs plan|preload|switch|rollback`.

El frontend usa rutas relativas `/api` y `/media`, así que funciona en cualquier carpeta/host.

> **En Windows, lanza los despliegues desde PowerShell, no desde Git Bash.** MSYS reescribe
> los argumentos que parecen rutas POSIX: `npm run deploy /html/dev` le llega al script como
> `C:/Program Files/Git/html/dev`, que al no ser absoluta se interpretaría como relativa al
> home del SFTP. `deploy.mjs` ahora rechaza cualquier destino no absoluto, y también `/` y
> `/html` (el WordPress vivo del cliente).

> `setup.php` hace `DROP` de todas las tablas, así que ningún script de uso diario lo sube.
> `scripts/archive/deploy-backend.mjs` (el despliegue de la migración) sí lo hace: úsalo solo
> para una re-importación desde cero.

## Base de datos

- MySQL `qaqu803`. **`DB_HOST=lldg503.servidoresdns.net`** (el servidor real de BBDD): el nombre del panel `qaqu803.saneamientos-pereda.com` es un CNAME no publicado (ver Problemas), y `localhost` apunta al MySQL propio del host web, que NO tiene esta BBDD.
- Esquema: `server/sql/schema.sql` (UUIDs como CHAR(36); `specs`/`emails` como JSON). El mapa de columnas permitidas por la API está en `TABLE_COLUMNS` de `server/api/db.php` — **mantener ambos sincronizados**.
- Auditorías: `node scripts/db-audit.mjs` (conteos + referencias a `/media`), `node scripts/audit-media.mjs` (árbol de `/media`). Conectan directo por el puerto 3306 con SSL.
- **Re-importación desde cero** (solo si hiciera falta): re-desplegar `setup.php` (borrado del servidor el 2026-09-04) con `scripts/archive/deploy-backend.mjs`, subir los JSON de datos a `api/import/`, y hacer `POST /api/setup.php` con `{token, admin_email, admin_password}`. **Vuelve a borrarlo al terminar** (`node scripts/prune-deployed.mjs api/setup.php`): hace `DROP` de todas las tablas.
- **Copia del WordPress antiguo** (BBDD `qaav753` + archivos de `/html`): tomada el 2026-09-28 antes de la salida a producción, guardada fuera del repo (contiene datos personales y credenciales).
- **Copias de seguridad**: la BBDD es ahora el dato vivo. Recomendado un `mysqldump` periódico (o export desde el panel) y backup de `/html/dev/media/`.

## Imágenes / media

- Subidas del panel → `/html/dev/media/...` (nombres únicos, así esquivan la caché de estáticos). El frontend las optimiza a WebP ≤1920px antes de subir (`src/lib/upload.js`).
- Imágenes base (logo, hero) bundleadas en `public/base/` y mantenidas al día por `sync-base-images.mjs` (corre antes de cada deploy). El resto es 100% de BBDD.
- Recompresión puntual: `scripts/optimize-images.mjs` (sobre `public/`).
- **Limpieza de huérfanos**: al reemplazar una imagen desde el panel, el archivo antiguo queda en disco (nombres únicos). `node scripts/prune-orphan-media.mjs` lista las imágenes que ninguna fila de la BBDD referencia; añade `--delete` para borrarlas. Salvaguardas: dry-run por defecto, **periodo de gracia** (`--days N`, 7 por defecto, nunca borra subidas recientes), ignora `/media/base/` y los dotfiles (`.htaccess`). Recomendado ejecutarlo de forma puntual (p. ej. trimestral) o cuando el disco crezca; no es urgente (imágenes WebP ~100-300 KB, ~54 GB libres).

## Email (formularios)

- `server/api/mailer.php` envía por **SMTP autenticado** vía `smtp.serviciodecorreo.es:465` (SSL) con el buzón `web@saneamientos-pereda.com`. Pasa el SPF del dominio (`include:_spf.serviciodecorreo.es`). **No usa Resend** (se descartó).
- Destinatario por defecto: `MAIL_TO` (admite lista separada por comas). **Por formulario** se puede sobrescribir desde el panel (Ajustes → Destinatarios) con las claves `mail_to_<formulario>` en `site_settings`. `forms.php` lee la clave del formulario y cae a `MAIL_TO` si está vacía. Estas claves son **confidenciales**: `content.php` las excluye de la API pública y el panel las lee por el endpoint autenticado `admin.php` (`action: get_settings`).
- Los formularios nunca fallan por un problema de email (el envío es "best-effort"): un fallo solo queda en el log de errores de PHP, así que tras cambiar credenciales SMTP prueba un formulario de verdad.
- Candidaturas: el CV va **adjunto** al aviso. `/media/cvs/*` no se sirve como estático: `.htaccess` lo pasa a `api/cv.php`, que exige sesión de admin.
- Canal de denuncias: la consulta por PIN admite 10 fallos por IP y hora (contador en el directorio temporal del sistema).
- **Entregabilidad**: el dominio tiene SPF pero **ni DKIM ni DMARC** (comprobado 2026-09-28). Activar DKIM en el panel de correo y publicar `_dmarc` TXT `v=DMARC1; p=none` reduce el riesgo de spam.

## Admin / auth

- Sesiones PHP + bcrypt en la tabla `admin_users`. Login vía `api/auth.php`; acceso desde el enlace **«Admin»** del footer.
- Crear/cambiar admin: vía `setup.php` (re-import) o un `INSERT`/`UPDATE` directo con `password_hash(..., PASSWORD_BCRYPT)`.

## Problemas conocidos

- ~~**Publicación de DNS atascada (proveedor)**~~ — **RESUELTO 2026-07-01**. La zona ya publica (`dev` A, `www.dev` A → 217.76.142.23, y el CNAME `qaqu803` → lldg503.servidoresdns.net). El subdominio dev va por HTTPS con el certificado comodín instalado desde el panel; ya no hace falta la entrada en `hosts`. `DB_HOST` sigue apuntando directo a `lldg503.servidoresdns.net` (funciona; podría usar el CNAME, pero no aporta nada).
- **Caché de estáticos del hosting**: sirve copias cacheadas de archivos en la misma ruta durante un TTL, incluso tras borrarlos, e ignora el `?v=`. Las subidas del panel usan nombres únicos, así que no se ven afectadas.

## Salida a producción

El proceso (copia, cambio, verificación, Search Console) está en [IMPROVEMENTS.md → C](IMPROVEMENTS.md#c-launch-process). Pendientes de infraestructura:

- **Certificado**: el comodín `*.saneamientos-pereda.com` + apex caduca el **2026-12-15**. Hay que tener claro quién lo renueva.
- Configurar copias de seguridad periódicas (MySQL + `/media`).
