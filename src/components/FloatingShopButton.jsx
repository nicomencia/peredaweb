import { useState, useEffect } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
import './FloatingShopButton.css';

const DEFAULT_SHOP = 'https://www.saneamientos-pereda.es/';
const DEFAULT_ECOMMERCE = 'https://ecommerce.saneamientos-pereda.com/ecom/login.php';

export default function FloatingShopButton({ currentView }) {
  const isAreaProfesional = currentView === 'area-profesional';
  const [shopUrl, setShopUrl] = useState(() => cachedSetting('shop_url', DEFAULT_SHOP));
  const [ecommerceUrl, setEcommerceUrl] = useState(() => cachedSetting('ecommerce_url', DEFAULT_ECOMMERCE));

  useEffect(() => {
    async function load() {
      const data = await loadSettings(['shop_url', 'ecommerce_url']);
      data?.forEach((row) => {
        if (row.key === 'shop_url' && row.value) setShopUrl(row.value);
        if (row.key === 'ecommerce_url' && row.value) setEcommerceUrl(row.value);
      });
    }
    load();
  }, []);

  const href = isAreaProfesional ? ecommerceUrl : shopUrl;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`floating-shop-button ${isAreaProfesional ? 'floating-shop-button--red' : ''}`}
      aria-label="Ir a la tienda online"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <span className="floating-shop-text">{isAreaProfesional ? 'Acceso ecommerce' : 'Tienda'}</span>
    </a>
  );
}
