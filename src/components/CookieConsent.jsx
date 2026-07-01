import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent, initAnalytics, trackPageview } from '../lib/analytics';
import './CookieConsent.css';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !getConsent());

  if (!visible) return null;

  function accept() {
    setConsent('accepted');
    initAnalytics();
    trackPageview(window.location.pathname);
    setVisible(false);
  }

  function reject() {
    setConsent('rejected');
    setVisible(false);
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-consent-inner">
        <p className="cookie-consent-text">
          Usamos cookies propias y de terceros con fines analíticos. Más información en nuestra{' '}
          <Link to="/politica-cookies" className="cookie-consent-link">política de cookies</Link>.
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="cookie-consent-btn cookie-consent-btn--ghost" onClick={reject}>
            Rechazar
          </button>
          <button type="button" className="cookie-consent-btn cookie-consent-btn--primary" onClick={accept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
