import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import ImageCarousel from './ImageCarousel';
import './Instalaciones.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Renders an hours value with each time range on its own line (split on " y "),
// and each range kept on a single line so it never breaks mid-way.
function HoursValue({ value }) {
  return value.split(/\s+y\s+/).map((part, i) => (
    <span className="hours-range" key={i}>
      {i > 0 && <br />}
      {part}
    </span>
  ));
}

export default function Instalaciones({ setCurrentView }) {
  const [bannerTitle, setBannerTitle] = useState('Pide cita para tus proyectos de reformas');
  const [bannerButton, setBannerButton] = useState('PIDE CITA');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [settingsRes, tiendasRes, photosRes] = await Promise.all([
        api
          .from('site_settings')
          .select('key, value')
          .in('key', ['tiendas_banner_title', 'tiendas_banner_button']),
        api
          .from('tiendas')
          .select('*')
          .order('display_order', { ascending: true }),
        api.from('tienda_photos').select('*'),
      ]);

      if (settingsRes.data) {
        settingsRes.data.forEach((row) => {
          if (row.key === 'tiendas_banner_title') setBannerTitle(row.value);
          if (row.key === 'tiendas_banner_button') setBannerButton(row.value);
        });
      }

      if (tiendasRes.data) {
        const byTienda = {};
        (photosRes.data || []).forEach((p) => {
          if (!byTienda[p.tienda_id]) byTienda[p.tienda_id] = [];
          byTienda[p.tienda_id].push(p);
        });
        setStores(tiendasRes.data.map((t) => ({ ...t, tienda_photos: byTienda[t.id] || [] })));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section id="instalaciones" className="instalaciones">
      <div className="instalaciones-cita-banner">
        <div className="instalaciones-cita-inner">
          <h3 className="instalaciones-cita-title">{bannerTitle}</h3>
          <button
            className="instalaciones-cita-button"
            onClick={() => setCurrentView && setCurrentView('pide-cita')}
          >
            {bannerButton}
          </button>
        </div>
      </div>
      <div className="container">
        <span className="eyebrow reveal">Dónde estamos</span>
        <h1 className="reveal">Nuestras Tiendas</h1>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem 0' }}>Cargando tiendas...</p>
        ) : (
          <div className="stores-list">
            {stores.map((store, index) => (
              <div key={store.id} className={`store-row reveal ${index % 2 === 1 ? 'reverse' : ''}`}>
                <div className="store-image">
                  <ImageCarousel
                    images={[
                      store.cover_image_url,
                      ...(store.tienda_photos || [])
                        .slice()
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((p) => p.image_url),
                    ]}
                    altPrefix={`Tienda ${store.name}`}
                  />
                </div>
                <div className="store-right-col">
                  <div className="store-info">
                    <h3>{store.name}</h3>
                    <div className="store-details">
                      <div className="detail-section">
                        <p className="address">
                          <strong>{store.address}</strong><br />
                          {store.postal_code}<br />
                          Telf. {store.phone}
                        </p>
                      </div>

                      <div className="detail-section">
                        {store.hours_tienda && <p className="hours-line"><strong>Tienda Exposición:</strong> <HoursValue value={store.hours_tienda} /></p>}
                        {store.hours_fontaneria && <p className="hours-line"><strong>Fontanería y Construcción:</strong> <HoursValue value={store.hours_fontaneria} /></p>}
                        {store.hours_sabados && <p className="hours-line"><strong>Sábados:</strong> <HoursValue value={store.hours_sabados} /></p>}
                        {store.hours_verano && <p className="verano">{store.hours_verano}</p>}
                      </div>

                      <div className="detail-section emails">
                        {(store.emails || []).map((email, i) => {
                          const at = email.indexOf('@');
                          const local = at === -1 ? email : email.slice(0, at + 1);
                          const domain = at === -1 ? '' : email.slice(at + 1);
                          return (
                            <a key={i} href={`mailto:${email}`}>
                              {local}<wbr />
                              {domain && <span className="email-domain">{domain}</span>}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="store-map">
                    <MapContainer
                      center={[store.lat, store.lon]}
                      zoom={15}
                      style={{ width: '100%', height: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[store.lat, store.lon]}>
                        <Popup>
                          <strong>{store.name}</strong><br />
                          {store.address}<br />
                          {store.postal_code}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
