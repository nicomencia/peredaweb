# SEO & routing — plan (no implementar todavía)

Documento de análisis. **Pendiente de implementar** tras la fase de pruebas del cliente y antes de la salida a producción. Hacerlo *antes* de ser público evita deuda de redirecciones (no hay URLs indexadas que preservar).

## Estado actual y limitaciones

- **SPA sin router**: la navegación es estado (`currentView` en `App.jsx`); **todas las páginas comparten una sola URL**.
  - No se pueden indexar páginas individuales ni compartir/guardar enlaces a una página concreta.
  - El `document.title` por página se fija por JS (`App.jsx`), pero solo en cliente.
- **Renderizado en cliente**: el HTML inicial es casi vacío (`#root`); el contenido aparece tras ejecutar JS y consultar la API. Google sí ejecuta JS, pero es más lento/frágil y otros bots/scrapers sociales no.
- **Metadatos**: `index.html` tiene `title`, `description` y `og:*`, pero **estáticos e iguales para todas las "páginas"**. Compartir cualquier enlace en WhatsApp/Facebook muestra la misma previsualización.
- **Sin** `sitemap.xml` ni datos estructurados (schema.org).

## Restricciones del proyecto

- Hosting **PHP 8.2 + Apache**, sin runtime Node → SSR clásico de React no es viable; sí lo es renderizar **metadatos** desde PHP.
- Contenido **dinámico** (productos, tiendas… desde MySQL) → el prerender estático quedaría desfasado sin rebuild.
- Negocio **local** (Oviedo, tiendas físicas, catálogo) → el SEO local y los datos estructurados aportan mucho.
- Aún **no es público** → momento óptimo para introducir URLs limpias sin migraciones.

## Opciones

| Opción | Qué da | Coste | Límite |
|---|---|---|---|
| **A. Router en cliente** (react-router) | URLs reales por página, enlazables; back/forward; títulos por página | Medio (~1-2 días) | Sigue siendo render en cliente; og/meta sociales no se ven sin JS |
| **B. Routing + prerender (SSG)** | HTML por página con meta correctos; rápido; vale para todo bot | Alto | Contenido dinámico se queda fijo al build (hay que rebuild) |
| **C. SSR (Node)** | Render por petición | No viable | El hosting no tiene Node |
| **D. Routing (A) + inyección de meta por PHP** | URLs + `title`/`description`/`og` correctos servidos por PHP por ruta; contenido hidrata en cliente | Medio | Contenido sigue en cliente (Google lo renderiza igual) |

## Plan recomendado (por fases)

**Fase 1 — Router en cliente (base).** Añadir `react-router-dom`, mapear cada vista a una URL limpia (ver esquema abajo), sustituir los `setCurrentView(...)` por navegación, y mantener el fallback SPA del `.htaccess` (ya existe). Es el mayor salto de UX/SEO y prerrequisito del resto.

**Fase 2 — Inyección de metadatos por PHP (alto impacto, encaja con el stack).** Un front controller PHP (`index.php`) sirve el HTML inyectando `title`, `meta description` y `og:*` según la ruta (datos en un mapa o en `site_settings`). Así las previsualizaciones sociales y los crawlers ven metadatos correctos por página. Opcional: un `<noscript>` con resumen de contenido para bots.

**Fase 3 — Pulido SEO.**
- `sitemap.xml` (estático o generado por PHP a partir de la BBDD) + `robots.txt` apuntándolo.
- **Datos estructurados JSON-LD**: `LocalBusiness`/`Store` (NAP de cada tienda, horarios), `Product` para el catálogo, `BreadcrumbList`.
- **SEO local**: Google Business Profile por tienda, coherencia de nombre/dirección/teléfono, enlazar el sitio.

## Esquema de URLs propuesto (slugs en español)

```
/                         Home
/productos                Productos (listado + categorías)
/productos/:categoria     Categoría (sanitarios, griferia, …)
/quienes-somos
/inspirate
/inspirate/:ambiente
/instalaciones            Tiendas
/area-profesional
/financiacion
/pide-cita
/presupuesto
/hazte-cliente
/canal-denuncias
/aviso-legal  /politica-privacidad  /politica-cookies  /condiciones-venta
/admin                    (noindex)
```

Slugs en español ayudan al SEO local (palabras clave en la URL). `/admin` debe llevar `noindex`.

## Esfuerzo y riesgo

- Total estimado **~3-4 días** enfocados (Fase 1 ~1-2, Fase 2 ~1, Fase 3 ~1).
- Riesgo bajo y mecánico: la Fase 1 toca `App.jsx` y los ~15-20 puntos que llaman a `setCurrentView`; la capa de datos (shim/PHP) no cambia. Los componentes lazy (admin, instalaciones) siguen igual.
- Sin deuda de redirecciones por hacerlo antes de publicar.

## Cuándo

Después de que el cliente pruebe la web (una vez el DNS publique y haya SSL) y **antes** de la salida pública a producción.
