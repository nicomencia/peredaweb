import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import './SimplePage.css';

const defaultDescription = 'Condiciones y precios especiales para profesionales. Asesoramiento técnico personalizado. Amplio stock disponible para entrega inmediata. Servicio de reparto en Asturias. Atención preferente en nuestras exposiciones.';

export default function HazteCliente() {
  const [description, setDescription] = useState(defaultDescription);
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

  useEffect(() => {
    async function load() {
      const { data } = await api
        .from('site_settings')
        .select('value')
        .eq('key', 'cta_4_description')
        .maybeSingle();
      if (data?.value) setDescription(data.value);
    }
    load();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) return;
    setSubmitting(true);
    setStatus(null);

    try {
      const apiUrl = '/api/forms.php?form=cliente';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        <span className="eyebrow eyebrow--light">Profesionales</span>
        <h1 className="simple-page-hero-title">hazte cliente</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container">
          <div className="presupuesto-grid">
            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">Ventajas para el profesional</h2>
              <span className="presupuesto-divider" />
              <p className="simple-page-text">{description}</p>

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

                <div className="consent-clause">
                  <p className="consent-clause-title">
                    Consentimiento para el tratamiento de datos personales
                  </p>
                  <div className="consent-clause-body">
                    <p>
                      <strong>SANEAMIENTOS PEREDA SA</strong> es el Responsable del tratamiento de
                      los datos personales del Usuario y le informa de que estos datos se tratarán
                      de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de
                      abril (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), por lo
                      que se le facilita la siguiente información del tratamiento:
                    </p>
                    <p>
                      <strong>Fines y legitimación del tratamiento:</strong> mantener una relación
                      comercial (por interés legítimo del responsable, art. 6.1.f RGPD) y envío de
                      comunicaciones de productos o servicios (con el consentimiento del
                      interesado, art. 6.1.a RGPD).
                    </p>
                    <p>
                      <strong>Criterios de conservación de los datos:</strong> se conservarán
                      durante no más tiempo del necesario para mantener el fin del tratamiento o
                      existan prescripciones legales que dictaminen su custodia y cuando ya no sea
                      necesario para ello, se suprimirán con medidas de seguridad adecuadas para
                      garantizar la anonimización de los datos o la destrucción total de los
                      mismos.
                    </p>
                    <p>
                      <strong>Comunicación de los datos:</strong> no se comunicarán los datos a
                      terceros, salvo obligación legal.
                    </p>
                    <p>
                      <strong>Derechos que asisten al Usuario:</strong> derecho a retirar el
                      consentimiento en cualquier momento; derecho de acceso, rectificación,
                      portabilidad y supresión de sus datos, y de limitación u oposición a su
                      tratamiento; derecho a presentar una reclamación ante la Autoridad de
                      control (www.aepd.es) si considera que el tratamiento no se ajusta a la
                      normativa vigente.
                    </p>
                    <p>
                      <strong>Datos de contacto para ejercer sus derechos:</strong> SANEAMIENTOS
                      PEREDA SA. CALLE INDEPENDENCIA, 43 BAJO - 33004 OVIEDO (Asturias). E-mail:
                      alberto@saneamientos-pereda.com
                    </p>
                  </div>
                </div>

                <label className="presupuesto-check">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <span>
                    <strong>ACEPTAR</strong> — He leído y estoy conforme con la cláusula anterior
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
