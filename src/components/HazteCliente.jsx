import { useState } from 'react';
import './SimplePage.css';

export default function HazteCliente() {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    cif: '',
    localidad: '',
    telefono: '',
    email: '',
    actividad: '',
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
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cliente-request`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          empresa: formData.empresa.trim(),
          cif: formData.cif.trim(),
          localidad: formData.localidad.trim(),
          telefono: formData.telefono.trim(),
          email: formData.email.trim(),
          actividad: formData.actividad.trim(),
          mensaje: formData.mensaje.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');

      setStatus({ type: 'success', text: 'Tu solicitud se ha enviado correctamente.' });
      setFormData({
        nombre: '',
        empresa: '',
        cif: '',
        localidad: '',
        telefono: '',
        email: '',
        actividad: '',
        mensaje: '',
      });
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
        <h1 className="simple-page-hero-title">hazte cliente</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container">
          <div className="presupuesto-grid">
            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">Ventajas para el profesional</h2>
              <span className="presupuesto-divider" />
              <ul className="presupuesto-list">
                <li>Condiciones y precios especiales para profesionales</li>
                <li>Asesoramiento técnico personalizado</li>
                <li>Amplio stock disponible para entrega inmediata</li>
                <li>Servicio de reparto en Asturias</li>
                <li>Atención preferente en nuestras exposiciones</li>
                <li>Gestión ágil de pedidos y presupuestos</li>
              </ul>

            </div>

            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">Solicita tu alta de cliente</h2>
              <span className="presupuesto-divider" />

              <form className="presupuesto-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre y apellidos"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="empresa"
                  placeholder="Empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="cif"
                  placeholder="CIF / NIF"
                  value={formData.cif}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="localidad"
                  placeholder="Localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
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
                  name="actividad"
                  placeholder="Actividad profesional"
                  value={formData.actividad}
                  onChange={handleChange}
                />
                <textarea
                  name="mensaje"
                  placeholder="Mensaje"
                  rows="5"
                  value={formData.mensaje}
                  onChange={handleChange}
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
