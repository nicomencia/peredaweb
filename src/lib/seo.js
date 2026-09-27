// Page metadata comes from public/index.php, which inlines window.__SEO__: the
// same map it serves to crawlers. Client-side navigation therefore shows exactly
// the titles a crawler sees, and there is one copy to edit, not two.
const SITE = 'Saneamientos Pereda';
const seo = typeof window !== 'undefined' ? window.__SEO__ : undefined;

function normalise(pathname) {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '/';
}

// [title, description] for a path, or null when there is no map (local Vite dev
// without PHP) - callers then leave the head as served.
export function metaFor(pathname) {
  if (!seo) return null;
  const path = normalise(pathname);
  if (seo.routes[path]) return seo.routes[path];
  const category = path.match(/^\/productos\/([^/]+)$/);
  if (category) return seo.categories[category[1]] || seo.notFound;
  // AmbienteDetail refines this with the ambiente's own name once it has loaded.
  if (/^\/inspirate\/[^/]+$/.test(path)) return seo.routes['/inspirate'];
  return seo.notFound;
}

// Keep in step with index.php, which builds the same title server-side.
export const ambienteTitle = (name) => `${name} | Inspírate | ${SITE}`;

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function setPageMeta(title, description) {
  document.title = title;
  upsertMeta('property', 'og:title', title);
  if (description) {
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:description', description);
  }
  upsertMeta('property', 'og:url', window.location.href);
}
