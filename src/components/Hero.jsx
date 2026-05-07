import './Hero.css';

export default function Hero({ setCurrentView }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <img src="/logo_letras.png" alt="Saneamientos Pereda" className="hero-logo" />
      </div>
    </section>
  );
}
