import './SimplePage.css';

const locations = [
  {
    name: 'Pruvia',
    phone: '984 497 255',
    email: 'pedidos@saneamientos-pereda.com',
  },
  {
    name: 'Oviedo (c/Independencia)',
    phone: '984 392 779',
    email: 'expoind@saneamientos-pereda.com',
  },
  {
    name: 'Oviedo (c/La Lila)',
    phone: '984 491 168',
    email: 'expolila@saneamientos-pereda.com',
  },
  {
    name: 'Gijón',
    phone: '984 392 248',
    email: 'expogijon@saneamientos-pereda.com',
  },
];

export default function PideCita() {
  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <h1 className="simple-page-hero-title">cita previa</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container">
          <h2 className="simple-page-heading">CITA PREVIA</h2>
          <p className="simple-page-text">
            Te ofrecemos la posibilidad de solicitar cita previa antes de acudir a nuestro establecimiento,
            podrás beneficiarte de una atención personalizada en tus proyectos de reformas y además evitar
            tiempos de espera.
          </p>
          <p className="simple-page-text">
            Solicita ahora tu cita previa a través de los siguientes medios:
          </p>

          <div className="simple-page-locations">
            {locations.map((loc) => (
              <div key={loc.name} className="simple-page-location">
                <p className="simple-page-location-name">{loc.name}</p>
                <p className="simple-page-location-line">
                  <strong>tfno:</strong> {loc.phone}
                </p>
                <p className="simple-page-location-line">
                  <strong>correo:</strong>{' '}
                  <a href={`mailto:${loc.email}`}>{loc.email}</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
