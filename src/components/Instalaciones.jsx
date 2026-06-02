import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

export default function Instalaciones({ setCurrentView }) {
  const [bannerTitle, setBannerTitle] = useState('Pide cita para tus proyectos de reformas');
  const [bannerButton, setBannerButton] = useState('PIDE CITA');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [settingsRes, tiendasRes] = await Promise.all([
        supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['tiendas_banner_title', 'tiendas_banner_button']),
        supabase
          .from('tiendas')
          .select('*, tienda_photos(id, image_url, display_order)')
          .order('display_order', { ascending: true }),
      ]);

      if (settingsRes.data) {
        settingsRes.data.forEach((row) => {
          if (row.key === 'tiendas_banner_title') setBannerTitle(row.value);
          if (row.key === 'tiendas_banner_button') setBannerButton(row.value);
        });
      }

      if (tiendasRes.data) {
        setStores(tiendasRes.data);
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
        <h2>Nuestras Tiendas</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem 0' }}>Cargando tiendas...</p>
        ) : (
          <div className="stores-list">
            {stores.map((store, index) => (
              <div key={store.id} className={`store-row ${index % 2 === 1 ? 'reverse' : ''}`}>
                <div className="store-image">
                  <img
                    src={store.cover_image_url || '/tienda.jpg'}
                    alt={`Tienda ${store.name} - ${store.address}`}
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
                        {store.hours_tienda && <p><strong>Tienda Exposición:</strong> {store.hours_tienda}</p>}
                        {store.hours_fontaneria && <p><strong>Fontanería y Construcción:</strong> {store.hours_fontaneria}</p>}
                        {store.hours_sabados && <p><strong>Sábados:</strong> {store.hours_sabados}</p>}
                        {store.hours_verano && <p className="verano">{store.hours_verano}</p>}
                      </div>

                      <div className="detail-section emails">
                        {(store.emails || []).map((email, i) => (
                          <a key={i} href={`mailto:${email}`}>{email}</a>
                        ))}
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
