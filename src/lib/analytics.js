// Consent-gated Google Analytics (GA4) loader.
//
// No tracking runs until the visitor accepts cookies AND an `analytics_id`
// (a GA4 "G-XXXXXXXXXX" measurement id) has been configured in the admin panel
// (Ajustes). Everything here is a no-op until both are true, so the site ships
// analytics-ready without tracking anyone by default.
import { cachedSetting } from './settings';

const CONSENT_KEY = 'cookie_consent'; // 'accepted' | 'rejected'
let loaded = false;

export function getConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}

export function setConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* ignore */ }
}

function measurementId() {
  const id = cachedSetting('analytics_id', '');
  return /^G-[A-Z0-9]+$/i.test(id) ? id : '';
}

// Injects the GA4 script once, if consent is granted and an id is configured.
export function initAnalytics() {
  if (loaded) return;
  if (getConsent() !== 'accepted') return;
  const id = measurementId();
  if (!id) return;

  loaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // SPA: we send page_view manually on route change, so disable the automatic one.
  window.gtag('config', id, { send_page_view: false });
}

// Sends a manual page_view for SPA route changes (once GA is loaded).
export function trackPageview(path) {
  if (!loaded || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href });
}
