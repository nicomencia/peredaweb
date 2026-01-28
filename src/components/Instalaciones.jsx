import './Instalaciones.css';

const stores = [
  {
    name: 'Oviedo',
    address: 'C/Independencia, 43',
    postalCode: '33004 Oviedo',
    phone: '985 271 026',
    hours: {
      tienda: '09:30 – 13:30 y 16:00 – 20:00',
      fontaneria: '08:30 – 13:30 y 15:00 – 19:00',
      sabados: '10:00 – 13:30 (abierto sólo Tienda Exposición)',
      verano: '(sábados de julio y agosto cerrado)'
    },
    emails: [
      'expoind@saneamientos-pereda.com',
      'independenciaalmacen@saneamientos-pereda.com'
    ],
    mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C/Independencia,43,33004+Oviedo,España&zoom=15'
  },
  {
    name: 'Oviedo',
    address: 'C/La Lila, 26 – Avellanos 4',
    postalCode: '33002 Oviedo',
    phone: '985 223 489',
    hours: {
      tienda: '10:00 – 13:30 y 16:00 – 20:00',
      fontaneria: '08:30 – 13:30 y 15:00 – 19:00',
      sabados: '10:00 – 13:30',
      verano: '(sábados de julio y agosto cerrado)'
    },
    emails: [
      'expolila@saneamientos-pereda.com',
      'lilaalmacen@saneamientos-pereda.com'
    ],
    mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C/La+Lila,26,33002+Oviedo,España&zoom=15'
  },
  {
    name: 'Pruvia',
    address: 'Ctra. AS-266 km 6,5',
    postalCode: '33192 Pruvia',
    phone: '985 260 124',
    hours: {
      tienda: '10:00 – 13:30 y 16:00 – 20:00',
      fontaneria: '08.00 – 20:00',
      sabados: '10:00 – 14:00',
      verano: '(sábados de julio y agosto cerrado)'
    },
    emails: [
      'expopruvia@saneamientos-pereda.com',
      'pruviacash@saneamientos-pereda.com',
      'pruviacons@saneamientos-pereda.com',
      'logistica@saneamientos-pereda.com'
    ],
    mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Ctra.AS-266+km+6.5,33192+Pruvia,España&zoom=15'
  },
  {
    name: 'Gijón',
    address: 'C/Infiesto, 12/14 – Avilés 17',
    postalCode: '33207 Gijón',
    phone: '985 351 747',
    hours: {
      tienda: '10:00 – 13:30 y 16:00 – 20:00',
      fontaneria: '08:00 – 13:30 y 15:00 – 19:00',
      sabados: '10:00 – 13:30',
      verano: '(sábados de julio y agosto cerrado)'
    },
    emails: [
      'expogijon@saneamientos-pereda.com',
      'gijonalmacen@saneamientos-pereda.com'
    ],
    mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C/Infiesto,12,33207+Gijón,España&zoom=15'
  }
];

export default function Instalaciones() {
  return (
    <section id="instalaciones" className="instalaciones">
      <div className="container">
        <h2>Nuestras Tiendas</h2>
        <div className="stores-list">
          {stores.map((store, index) => (
            <div key={index} className={`store-row ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="store-info">
                <h3>{store.name}</h3>
                <div className="store-details">
                  <div className="detail-section">
                    <p className="address">
                      <strong>{store.address}</strong><br />
                      {store.postalCode}<br />
                      Telf. {store.phone}
                    </p>
                  </div>

                  <div className="detail-section">
                    <p><strong>Tienda Exposición:</strong> {store.hours.tienda}</p>
                    <p><strong>Fontanería y Construcción:</strong> {store.hours.fontaneria}</p>
                    <p><strong>Sábados:</strong> {store.hours.sabados}</p>
                    <p className="verano">{store.hours.verano}</p>
                  </div>

                  <div className="detail-section emails">
                    {store.emails.map((email, i) => (
                      <a key={i} href={`mailto:${email}`}>{email}</a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="store-map">
                <iframe
                  src={store.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${store.name}`}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
