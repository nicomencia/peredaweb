import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { cachedSetting, loadSettings } from '../lib/settings';
import './Footer.css';

export default function Footer({ setCurrentView }) {
  const [description, setDescription] = useState(() => cachedSetting('footer_description', 'Especialistas en equipamiento de baño desde 1959. Empresa familiar con más de 50 años de experiencia ofreciendo productos de alta calidad y servicio profesional.'));
  const [facebookUrl, setFacebookUrl] = useState(() => cachedSetting('footer_facebook_url', 'https://facebook.com/Pereda.Asturias'));
  const [instagramUrl, setInstagramUrl] = useState(() => cachedSetting('footer_instagram_url', 'https://instagram.com/saneamientospereda/'));
  const [logoUrl, setLogoUrl] = useState(() => cachedSetting('footer_logo', '/base/navbar-logo.webp'));
  const [stores, setStores] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await loadSettings(['footer_description', 'footer_facebook_url', 'footer_instagram_url', 'footer_logo']);
      if (data) {
        data.forEach((row) => {
          if (row.key === 'footer_description') setDescription(row.value);
          if (row.key === 'footer_facebook_url') setFacebookUrl(row.value);
          if (row.key === 'footer_instagram_url') setInstagramUrl(row.value);
          if (row.key === 'footer_logo' && row.value) setLogoUrl(row.value);
        });
      }
      const { data: tiendas } = await api
        .from('tiendas')
        .select('*')
        .order('display_order', { ascending: true });
      if (tiendas) setStores(tiendas);
    }
    load();
  }, []);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoUrl || undefined} alt="Saneamientos Pereda" className="footer-logo" />
            <p>{description}</p>
          </div> 

          <div className="footer-links">
            <h4>Navegar</h4>
            <ul>
              <li><button onClick={() => setCurrentView('sobre-mi')}>Quiénes somos</button></li>
              <li><button onClick={() => setCurrentView('inspirate')}>Inspírate</button></li>
              <li><button onClick={() => setCurrentView('instalaciones')}>Nuestras tiendas</button></li>
              <li><button onClick={() => setCurrentView('colecciones')}>Productos</button></li>
              <li><button onClick={() => setCurrentView('area-profesional')}>Área Profesional</button></li>
            </ul>
          </div>

          <div className="footer-stores">
            <h4>Tiendas</h4>
            <div className="footer-stores-grid">
              {stores.map((store) => (
                <div className="footer-store" key={store.id}>
                  <p>{store.address}</p>
                  {store.postal_code && <p>{store.postal_code}</p>}
                  {store.phone && <p>Telf. {store.phone}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="footer-social">
            <h4>Conectar</h4>
            <div className="footer-social-links">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <a
            href="https://www.legalveritas.es"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-veritas"
            aria-label="Certificado de cumplimiento normativo Legal Veritas"
          >
            <img
              src="/base/legalveritas.webp"
              alt="Certificado de cumplimiento GDPR y LSSICE — Legal Veritas"
              loading="lazy"
            />
          </a>
          <div className="footer-legal">
            <button onClick={() => setCurrentView('aviso-legal')}>Aviso Legal</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => setCurrentView('politica-privacidad')}>Política de Privacidad</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => setCurrentView('politica-cookies')}>Política de Cookies</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => setCurrentView('politica-redes-sociales')}>Privacidad en redes sociales</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => setCurrentView('condiciones-venta')}>Condiciones generales de venta</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => setCurrentView('desistimiento')}>Desistir del contrato aquí</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => setCurrentView('canal-denuncias')}>Canal de Denuncias</button>
            <span className="footer-legal-sep">|</span>
            <button onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}>
              Configuración de cookies
            </button>
          </div>
          <p>&copy; {new Date().getFullYear()} Saneamientos Pereda. Todos los derechos reservados.</p>
          <div className="footer-admin">
            <button onClick={() => setCurrentView('admin')}>Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
