import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent, initAnalytics, trackPageview } from '../lib/analytics';
import './CookieConsent.css';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !getConsent());
  const [configuring, setConfiguring] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(() => getConsent() === 'accepted');

  // «Configuración de cookies» in the footer reopens this banner so the user
  // can change their choice at any time (GDPR requirement).
  useEffect(() => {
    function open() {
      setAnalyticsOn(getConsent() === 'accepted');
      setConfiguring(true);
      setVisible(true);
    }
    window.addEventListener('open-cookie-preferences', open);
    return () => window.removeEventListener('open-cookie-preferences', open);
  }, []);

  if (!visible) return null;

  function close(value) {
    const prev = getConsent();
    setConsent(value);
    setVisible(false);
    setConfiguring(false);
    if (value === 'accepted') {
      initAnalytics();
      trackPageview(window.location.pathname);
    } else if (prev === 'accepted') {
      // Consent withdrawn: reload so Google Analytics is no longer loaded.
      window.location.reload();
    }
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-consent-inner">
        <p className="cookie-consent-text">
          Usamos cookies propias y de terceros con fines analíticos. Puedes aceptarlas, rechazarlas
          o configurarlas. Más información en nuestra{' '}
          <Link to="/politica-cookies" className="cookie-consent-link">política de cookies</Link>.
        </p>

        {configuring && (
          <div className="cookie-consent-prefs">
            <label className="cookie-consent-pref">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Técnicas y funcionales</strong> — necesarias para el funcionamiento de la
                web (siempre activas).
              </span>
            </label>
            <label className="cookie-consent-pref">
              <input
                type="checkbox"
                checked={analyticsOn}
                onChange={(e) => setAnalyticsOn(e.target.checked)}
              />
              <span>
                <strong>Analíticas</strong> — Google Analytics, para medir las visitas de forma
                estadística.
              </span>
            </label>
          </div>
        )}

        <div className="cookie-consent-actions">
          {configuring ? (
            <button
              type="button"
              className="cookie-consent-btn cookie-consent-btn--primary"
              onClick={() => close(analyticsOn ? 'accepted' : 'rejected')}
            >
              Guardar preferencias
            </button>
          ) : (
            <>
              <button
                type="button"
                className="cookie-consent-btn cookie-consent-btn--ghost"
                onClick={() => setConfiguring(true)}
              >
                Configurar
              </button>
              <button
                type="button"
                className="cookie-consent-btn cookie-consent-btn--ghost"
                onClick={() => close('rejected')}
              >
                Rechazar
              </button>
              <button
                type="button"
                className="cookie-consent-btn cookie-consent-btn--primary"
                onClick={() => close('accepted')}
              >
                Aceptar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
