import { useState, useEffect } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
import CareersModal from './CareersModal';
import './QuienesSomos.css';

const DEFAULT_STATS = [
  { number: '+50', label: 'Años de Experiencia', description: 'Siempre con una constante dedicación para mejorar los servicios al cliente y una continua actualización de productos e instalaciones.' },
  { number: '+40', label: 'Profesionales Especializados', description: 'Nuestro personal está formado por profesionales cualificados que te asesorarán y atenderán personalmente.' },
];

const DEFAULT_SERVICIOS = [
  { name: 'Asesoramiento profesional', text: 'Contamos con un equipo de expertos en interiorismo y decoración que te orientará para encontrar las mejores soluciones según tu espacio, estilo y necesidades.' },
  { name: 'Diseño personalizado', text: 'Te ayudamos a elegir la opción que mejor encaje contigo. Y si buscas algo único, elaboramos propuestas totalmente a medida adaptadas a tu proyecto.' },
  { name: 'Transporte a domicilio', text: 'Olvídate de las preocupaciones logísticas. Nos encargamos de llevar tu compra directamente hasta tu hogar de forma cómoda y segura.' },
  { name: 'Financiación flexible', text: 'Si lo necesitas, ponemos a tu disposición diferentes opciones de financiación para que puedas realizar tu proyecto con mayor comodidad.' },
  { name: 'Recogida rápida', text: 'Compra cómodamente y recoge tu pedido sin esperas y con total facilidad.' },
];

const SERVICIO_ICONS = [
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><path d="M17 4l1.5 1.5L22 2" /></svg>,
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" /><path d="M14 8l4 4" /><path d="M18 6l2 2" /></svg>,
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="13" height="11" rx="1" /><path d="M14 9h4l3 4v4h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="1" /><circle cx="12" cy="12" r="3" /><path d="M6 10v4M18 10v4" /></svg>,
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><path d="M14 2v6h6" /><path d="M9 14l2 2 4-4" /></svg>,
];

const DEFAULT_PORQUE = [
  { text: 'Todo para reformar el baño' },
  { text: 'Te ayudamos a diseñarlo' },
  { text: 'Trato humano y personalizado' },
  { text: 'Más de 50 años de experiencia en el sector' },
  { text: 'Los mejores precios del mercado' },
  { text: 'Garantía Postventa' },
];

const PORQUE_CHECK = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

export default function QuienesSomos() {
  const [showCareersModal, setShowCareersModal] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [texts, setTexts] = useState({
    quienes_subtitle: 'Siempre con dedicación\npara mejorar nuestros servicios',
    quienes_intro_1: 'Saneamientos Pereda es una empresa familiar fundada en Oviedo en el año 1959. Nace como distribuidora de productos de fontanería y sanitarios, pero con el paso de los años, con esfuerzo y dedicación, y gracias a la confianza depositada por los clientes, ha sabido crecer y diversificar su oferta para adaptarse a las necesidades del mercado, convirtiéndose en un referente en su sector.',
    quienes_intro_2: 'La oferta de productos, dirigida tanto al profesional como al particular más exigente, abarca material de fontanería, calefacción, sanitarios, grifería, mobiliario y accesorios para baño, materiales de construcción, electricidad, pintura, jardinería y herramienta.',
    quienes_caption_1: 'Nuestros orígenes',
    quienes_caption_2: 'Nuestras instalaciones',
    quienes_servicios_title: 'Servicios asociados',
    quienes_servicios_subtitle: 'Nuestros especialistas en diseño de interiores te acompañarán en cada paso para ayudarte a crear el baño que siempre has imaginado.',
    quienes_porque_title: '¿Por qué elegir Saneamientos Pereda?',
    quienes_equipo_title: 'Nuestro equipo',
    quienes_equipo_subtitle: 'Las personas que hacen posible Saneamientos Pereda',
    quienes_careers_title: 'Trabaja con nosotros',
    quienes_careers_text: '¿Quieres formar parte de nuestro equipo? Envíanos tu CV.',
    quienes_careers_button: 'Enviar CV',
  });
  const [servicios, setServicios] = useState(DEFAULT_SERVICIOS);
  const [porque, setPorque] = useState(DEFAULT_PORQUE);
  const [images, setImages] = useState(() => ({
    quienes_somos_bg: cachedSetting('quienes_somos_bg', ''),
    quienes_somos_1: cachedSetting('quienes_somos_1', ''),
    quienes_somos_2: cachedSetting('quienes_somos_2', ''),
    quienes_somos_3: cachedSetting('quienes_somos_3', ''),
    quienes_somos_4: cachedSetting('quienes_somos_4', ''),
  }));

  useEffect(() => {
    async function load() {
      const data = await loadSettings([
        'quienes_subtitle', 'quienes_intro_1', 'quienes_intro_2',
        'quienes_somos_bg', 'quienes_somos_1', 'quienes_somos_2', 'quienes_somos_3', 'quienes_somos_4',
        'quienes_stats', 'quienes_servicios', 'quienes_porque',
        'quienes_caption_1', 'quienes_caption_2',
        'quienes_servicios_title', 'quienes_servicios_subtitle',
        'quienes_porque_title', 'quienes_equipo_title', 'quienes_equipo_subtitle',
        'quienes_careers_title', 'quienes_careers_text', 'quienes_careers_button',
      ]);
      if (data) {
        const loadedTexts = { ...texts };
        const loadedImages = { ...images };
        data.forEach((row) => {
          if (row.key === 'quienes_stats' || row.key === 'quienes_servicios' || row.key === 'quienes_porque') {
            try {
              const items = JSON.parse(row.value || '[]');
              if (Array.isArray(items) && items.length) {
                if (row.key === 'quienes_stats') setStats(items);
                else if (row.key === 'quienes_servicios') setServicios(items);
                else setPorque(items);
              }
            } catch { /* ignore malformed */ }
          }
          else if (row.key in loadedImages) { if (row.value) loadedImages[row.key] = row.value; }
          else loadedTexts[row.key] = row.value;
        });
        setTexts(loadedTexts);
        setImages(loadedImages);
      }
    }
    load();
  }, []);

  return (
    <section id="sobre-mi" className="about">
      <div className="about-hero" style={{ backgroundImage: images.quienes_somos_bg ? `url('${images.quienes_somos_bg}')` : undefined }}>
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="eyebrow eyebrow--light">Saneamientos Pereda · Oviedo</span>
          <h1>¿Quiénes somos?</h1>
          <p className="about-hero-subtitle">
            {texts.quienes_subtitle}
          </p>
        </div>
      </div>

      <div className="about-photos-top">
        <div className="about-photo-full">
          <img src={images.quienes_somos_1 || undefined} alt="Foto histórica de Saneamientos Pereda" />
          <div className="about-photo-caption">{texts.quienes_caption_1}</div>
        </div>
        <div className="about-photo-full">
          <img src={images.quienes_somos_2 || undefined} alt="Edificio principal de Saneamientos Pereda" />
          <div className="about-photo-caption">{texts.quienes_caption_2}</div>
        </div>
      </div>

      <div className="container">
        <div className="about-intro">
          <p>{texts.quienes_intro_1}</p>
          <p>{texts.quienes_intro_2}</p>
        </div>

      </div>

      <div className="servicios-section">
        <div className="container">
          <span className="eyebrow reveal">Servicios</span>
          <h3 className="servicios-title reveal">{texts.quienes_servicios_title}</h3>
          <p className="servicios-subtitle reveal">
            {texts.quienes_servicios_subtitle}
          </p>

          <div className="servicios-grid reveal">
            {servicios.map((s, i) => (
              <div className="servicio-card" key={i}>
                <div className="servicio-icon">{SERVICIO_ICONS[i] || SERVICIO_ICONS[0]}</div>
                <h4 className="servicio-name">{s.name}</h4>
                <p className="servicio-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="about-porqué">
        <div className="container">
          <span className="eyebrow reveal">Por qué nosotros</span>
          <h3 className="reveal">{texts.quienes_porque_title}</h3>
          <div className="porqué-grid reveal">
            {porque.map((item, i) => (
              <div className="porqué-item" key={i}>
                <span className="porqué-check">{PORQUE_CHECK}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="about-team-section">
        <div className="container">
          <span className="eyebrow reveal">El equipo</span>
          <h3 className="reveal">{texts.quienes_equipo_title}</h3>
          <p className="about-team-subtitle reveal">{texts.quienes_equipo_subtitle}</p>
        </div>
        <div className="about-team-stats reveal">
          {stats.map((stat, i) => (
            <div className="stat-card" key={i}>
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
              <p className="stat-description">{stat.description}</p>
            </div>
          ))}
        </div>
        <div className="about-team-photos">
          <div className="about-photo-half">
            <img src={images.quienes_somos_3 || undefined} alt="Equipo de trabajo de Saneamientos Pereda" />
          </div>
          <div className="about-photo-half">
            <img src={images.quienes_somos_4 || undefined} alt="Profesionales de Saneamientos Pereda" />
          </div>
        </div>
      </div>

      <div className="careers-banner">
        <div className="careers-banner-bg" />
        <div className="careers-banner-content">
          <div className="careers-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
          </div>
          <h3>{texts.quienes_careers_title}</h3>
          <p className="careers-text">
            {texts.quienes_careers_text}
          </p>
          <button className="careers-cta" onClick={() => setShowCareersModal(true)}>
            {texts.quienes_careers_button}
          </button>
        </div>
      </div>

      <CareersModal isOpen={showCareersModal} onClose={() => setShowCareersModal(false)} />
    </section>
  );
}
