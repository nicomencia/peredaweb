import './AboutIntro.css';

const ctas = [
  {
    title: 'Pide cita para tus proyectos de reformas',
    label: 'PIDE CITA',
    view: 'pide-cita',
  },
  {
    title: 'Financiación sin intereses',
    label: 'CONSULTA NUESTRA FINANCIACIÓN',
    view: 'financiacion',
  },
  {
    title: 'Asesoramiento y servicio post venta',
    label: 'SOLICITA PRESUPUESTO',
    view: 'presupuesto',
  },
  {
    title: 'Conoce las ventajas para el profesional',
    label: 'HAZTE CLIENTE',
    view: 'hazte-cliente',
  },
];

export default function AboutIntro({ setCurrentView }) {
  return (
    <section className="cta-banner">
      <div className="cta-banner-grid">
        {ctas.map((item) => (
          <div className="cta-banner-item" key={item.label}>
            <h3 className="cta-banner-title">{item.title}</h3>
            <button
              className="cta-banner-button"
              onClick={() => setCurrentView && setCurrentView(item.view)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
