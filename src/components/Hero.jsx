import { useState, useEffect } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
import './Hero.css';

export default function Hero({ setCurrentView }) {
  const [logoUrl, setLogoUrl] = useState(() => cachedSetting('hero_logo', ''));
  const [bgUrl, setBgUrl] = useState(() => cachedSetting('hero_background', ''));

  useEffect(() => {
    async function load() {
      const data = await loadSettings(['hero_logo', 'hero_background']);
      if (data) {
        data.forEach((row) => {
          if (row.key === 'hero_logo' && row.value) setLogoUrl(row.value);
          if (row.key === 'hero_background' && row.value) setBgUrl(row.value);
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
        <img src={logoUrl || undefined} alt="Saneamientos Pereda" className="hero-logo" />
      </div>
    </section>
  );
}
