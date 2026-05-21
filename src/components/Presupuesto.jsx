import { useState } from 'react';
import './SimplePage.css';

export default function Presupuesto() {
  const [formData, setFormData] = useState({
    nombre: '',
    localidad: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) return;
    setSubmitting(true);
    setStatus(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/presupuesto-request`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          localidad: formData.localidad.trim(),
          email: formData.email.trim(),
          asunto: formData.asunto.trim(),
          mensaje: formData.mensaje.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');

      setStatus({ type: 'success', text: 'Tu solicitud se ha enviado correctamente.' });
      setFormData({ nombre: '', localidad: '', email: '', asunto: '', mensaje: '' });
      setAccepted(false);
    } catch (err) {
      setStatus({ type: 'error', text: 'Error al enviar la solicitud. Inténtalo de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <h1 className="simple-page-hero-title">solicita presupuesto</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container">
          <div className="presupuesto-grid">
            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">Contacta con nosotros</h2>
              <span className="presupuesto-divider" />
              <ul className="presupuesto-list">
                <li>Más de 50 años de experiencia</li>
                <li>Más de 40 profesionales especializados en diferentes áreas del sector</li>
                <li>Locales de exposición y autoservicio</li>
                <li>Venta a profesionales del gremio y a particulares</li>
                <li>Líderes del mercado Asturiano</li>
              </ul>

              <div className="presupuesto-locations">
                <div className="presupuesto-location">
                  <p className="presupuesto-location-name">Pruvia</p>
                  <p className="presupuesto-location-line">
                    Ctra. AS-266, km 4,5 · 33192 Pruvia · Tlfn. 984 497 255
                  </p>
                </div>
                <div className="presupuesto-location">
                  <p className="presupuesto-location-name">Oviedo</p>
                  <p className="presupuesto-location-line">
                    Independencia, 43 · 33004 Oviedo · Tlfn. 985 271 026
                  </p>
                </div>
                <div className="presupuesto-location">
                  <p className="presupuesto-location-name">Oviedo</p>
                  <p className="presupuesto-location-line">
                    La Lila, 26 · 33002 Oviedo · Tlfn. 985 223 489
                  </p>
                </div>
                <div className="presupuesto-location">
                  <p className="presupuesto-location-name">Gijón</p>
                  <p className="presupuesto-location-line">
                    Juan Alvargonzález, 72 · 33209 Gijón · Tlfn. 984 392 248
                  </p>
                </div>
              </div>
            </div>

            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">¿Cómo podemos ayudarte?</h2>
              <span className="presupuesto-divider" />

              <form className="presupuesto-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="localidad"
                  placeholder="Localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="asunto"
                  placeholder="Asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                />
                <textarea
                  name="mensaje"
                  placeholder="Mensaje"
                  rows="6"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                />

                <label className="presupuesto-check">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <span>
                    He leído y acepto la <strong>política de privacidad</strong>
                  </span>
                </label>

                <button
                  type="submit"
                  className="presupuesto-submit"
                  disabled={submitting || !accepted}
                >
                  {submitting ? 'ENVIANDO...' : 'ENVIAR'}
                </button>

                {status && (
                  <p className={`presupuesto-status ${status.type}`}>{status.text}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
