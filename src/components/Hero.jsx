import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Hero.css';

export default function Hero({ setCurrentView }) {
  const [logoUrl, setLogoUrl] = useState('/logo_letras.png');
  const [bgUrl, setBgUrl] = useState('/fondo.jpg');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['hero_logo', 'hero_background']);

      if (data) {
        data.forEach((row) => {
          if (row.key === 'hero_logo' && row.value) setLogoUrl(row.value);
          if (row.key === 'hero_background' && row.value) setBgUrl(row.value);
        });
      }
    }
    loadSettings();
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `linear-gradient(rgba(0, 82, 204, 0.1), rgba(0, 82, 204, 0.05)), url('${bgUrl}')` }}
    >
      <div className="hero-content">
        <img src={logoUrl} alt="Saneamientos Pereda" className="hero-logo" />
      </div>
    </section>
  );
}
