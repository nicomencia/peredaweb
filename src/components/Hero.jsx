import { useState, useEffect } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
import './Hero.css';

function parseButtons(value) {
  try {
    const arr = JSON.parse(value || '[]');
    return Array.isArray(arr) ? arr.filter((b) => b && b.label && b.url) : [];
  } catch {
    return [];
  }
}

export default function Hero({ setCurrentView }) {
  const [logoUrl, setLogoUrl] = useState(() => cachedSetting('hero_logo', '/base/hero-logo.webp'));
  const [bgUrl, setBgUrl] = useState(() => cachedSetting('hero_background', '/base/hero-bg.webp'));
  const [buttons, setButtons] = useState(() => parseButtons(cachedSetting('hero_buttons', '[]')));

  useEffect(() => {
    async function load() {
      const data = await loadSettings(['hero_logo', 'hero_background', 'hero_buttons']);
      if (data) {
        data.forEach((row) => {
          if (row.key === 'hero_logo' && row.value) setLogoUrl(row.value);
          if (row.key === 'hero_background' && row.value) setBgUrl(row.value);
          if (row.key === 'hero_buttons') setButtons(parseButtons(row.value));
        });
      }
    }
    load();
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `linear-gradient(rgba(0, 82, 204, 0.1), rgba(0, 82, 204, 0.05))${bgUrl ? `, url('${bgUrl}')` : ''}` }}
    >
      <div className="hero-content">
        <h1 className="sr-only">Saneamientos Pereda — Baño, fontanería y materiales de construcción en Oviedo</h1>
        <img src={logoUrl || undefined} alt="Saneamientos Pereda" className="hero-logo" />
        {buttons.length > 0 && (
          <div className="hero-buttons">
            {buttons.map((b, i) => (
              <a
                key={i}
                className="hero-button"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {b.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
