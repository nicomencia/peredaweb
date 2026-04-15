import { useState, useEffect } from 'react';
import './CareersModal.css';

export default function CareersModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/candidatura`;
      const body = new FormData();
      body.append('nombre', formData.nombre);
      body.append('email', formData.email);
      body.append('telefono', formData.telefono);
      body.append('mensaje', formData.mensaje);
      if (cvFile) body.append('cv', cvFile);
      const res = await fetch(apiUrl, {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al enviar la candidatura');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Error de conexion. Intentelo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
    setCvFile(null);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="careers-modal-overlay" onClick={handleClose}>
      <div className="careers-modal" onClick={(e) => e.stopPropagation()}>
        <button className="careers-modal-close" onClick={handleClose} aria-label="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="careers-modal-header">
              <div className="careers-modal-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
              </div>
              <h2>Trabaja con nosotros</h2>
              <p>Completa el formulario y nos pondremos en contacto contigo.</p>
            </div>

            <form onSubmit={handleSubmit} className="careers-modal-form">
              <div className="careers-field">
                <label htmlFor="careers-nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="careers-nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre y apellidos"
                />
              </div>

              <div className="careers-field">
                <label htmlFor="careers-email">Email *</label>
                <input
                  type="email"
                  id="careers-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="careers-field">
                <label htmlFor="careers-telefono">Telefono</label>
                <input
                  type="tel"
                  id="careers-telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 600 000 000"
                />
              </div>

              <div className="careers-field">
                <label htmlFor="careers-mensaje">Mensaje</label>
                <textarea
                  id="careers-mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cuentanos sobre ti y por que te gustaria unirte al equipo..."
                />
              </div>

              <div className="careers-field">
                <label>CV (PDF, max 5 MB)</label>
                <label className="careers-file-upload" htmlFor="careers-cv">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>{cvFile ? cvFile.name : 'Seleccionar archivo PDF'}</span>
                  {cvFile && (
                    <button
                      type="button"
                      className="careers-file-remove"
                      onClick={(e) => { e.preventDefault(); setCvFile(null); }}
                      aria-label="Eliminar archivo"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </label>
                <input
                  type="file"
                  id="careers-cv"
                  accept="application/pdf"
                  onChange={(e) => setCvFile(e.target.files[0] || null)}
                  style={{ display: 'none' }}
                />
              </div>

              {error && <div className="careers-form-error">{error}</div>}

              <button type="submit" className="careers-submit-btn" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar CV'}
              </button>
            </form>
          </>
        ) : (
          <div className="careers-modal-success">
            <div className="careers-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2>CV enviada</h2>
            <p>Hemos recibido tu solicitud. Revisaremos tu perfil y te contactaremos si encajas en alguna de nuestras vacantes.</p>
            <button className="careers-done-btn" onClick={handleClose}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}
