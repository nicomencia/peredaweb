import './FloatingShopButton.css';

export default function FloatingShopButton() {
  return (
    <a
      href="https://www.saneamientos-pereda.es/"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-shop-button"
      aria-label="Ir a la tienda online"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <span className="floating-shop-text">Tienda</span>
    </a>
  );
}
