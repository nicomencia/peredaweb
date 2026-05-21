import { useState } from 'react';
import './CanalDenuncias.css';

const CONDITIONS_TEXT = {
  intro: 'Puedes enviar una denuncia de forma totalmente anónima y segura.',
  objetivo: 'El objetivo del CANAL DE DENUNCIAS es la recepción, retención y tratamiento de las denuncias sobre irregularidades o incumplimientos de la normativa, cometidos por empleados o sociedades.',
  procedimiento: 'Se trata de un canal de comunicación confidencial entre clientes, proveedores, accionistas, trabajadores, etc., vinculados a SANEAMIENTOS PEREDA, S.L.',
  regulacion: 'El procedimiento trata de regular la recepción, tratamiento, investigación y resolución de las denuncias sobre presuntas irregularidades o incumplimientos cometidos por empleados, agentes comerciales, directivos o socios de negocios, que puedan surgir en el ejercicio de la actividad empresarial de SANEAMIENTOS PEREDA, S.L., situaciones de riesgos por exposiciones derivadas de las interconexiones con la Administración Pública y otros organismos públicos. Debiendo seguirse actualmente la Directiva (UE) 2019/1937 del Parlamento Europeo y del Consejo, de 23 de octubre de 2019, relativa a la protección de las personas que informen sobre infracciones del Derecho de la Unión, así como la reciente Ley 2/2023, de 20 de febrero, reguladora de la protección de las personas que informen sobre infracciones normativas y de lucha contra la corrupción, publicada en el BOE del 21/02/2023, con entrada en vigor el 13/03/2023.',
  ambito: 'Se podrá comunicar cualquier posible irregularidad o incumplimiento relacionado con malas prácticas financieras, contables, comerciales o de cumplimiento normativo cometidas por empleados o sociedades de SANEAMIENTOS PEREDA, S.L.',
  requisitos: [
    'Exposición clara y detallada de los hechos.',
    'Identificación de la sección y lugar en la que hayan tenido lugar.',
    'Vinculación del denunciante con SANEAMIENTOS PEREDA, S.L. para facilitar el análisis y seguimiento de la denuncia.',
    'Identificación de las personas involucradas con el comportamiento denunciado o con conocimiento del mismo.',
    'Momento en el que ocurrió o ha estado ocurriendo el hecho.',
    'Aportar, si se considera necesario, documentos, archivos u otra información que se estime relevante para la evaluación y resolución de la denuncia.',
  ],
};

export default function CanalDenuncias() {
  const [step, setStep] = useState('conditions');
  const [formData, setFormData] = useState({
    hechos: '',
    seccion_lugar: '',
    vinculacion: '',
    personas_involucradas: '',
    momento: '',
    documentos_info: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [pin, setPin] = useState(null);
  const [error, setError] = useState(null);

  const [consultPin, setConsultPin] = useState('');
  const [consultResult, setConsultResult] = useState(null);
  const [consultError, setConsultError] = useState(null);
  const [consulting, setConsulting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/denuncias/submit`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al enviar la denuncia');
      } else {
        setPin(data.pin);
        setStep('success');
      }
    } catch {
      setError('Error de conexión. Inténtelo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsult = async (e) => {
    e.preventDefault();
    setConsulting(true);
    setConsultError(null);
    setConsultResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/denuncias/consultar`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: consultPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setConsultError(data.error || 'No se encontró la denuncia');
      } else {
        setConsultResult(data.denuncia);
      }
    } catch {
      setConsultError('Error de conexión. Inténtelo de nuevo.');
    } finally {
      setConsulting(false);
    }
  };

  const estadoLabel = (estado) => {
    const labels = {
      pendiente: 'Pendiente de revisión',
      en_revision: 'En revisión',
      resuelta: 'Resuelta',
    };
    return labels[estado] || estado;
  };

  const estadoClass = (estado) => {
    const classes = {
      pendiente: 'estado-pendiente',
      en_revision: 'estado-revision',
      resuelta: 'estado-resuelta',
    };
    return classes[estado] || '';
  };

  return (
    <section className="canal-denuncias">
      <div className="container">
        <div className="canal-header">
          <div className="canal-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1>Canal de Denuncias</h1>
          <p className="canal-subtitle">Enviar una denuncia de forma anónima y segura</p>
        </div>

        {step === 'conditions' && (
          <div className="canal-conditions">
            <div className="conditions-card">
              <h2>Condiciones</h2>
              <p className="conditions-intro">{CONDITIONS_TEXT.intro}</p>

              <div className="conditions-section">
                <h3>Objetivo</h3>
                <p>{CONDITIONS_TEXT.objetivo}</p>
                <p>{CONDITIONS_TEXT.procedimiento}</p>
              </div>

              <div className="conditions-section">
                <h3>Marco regulatorio</h3>
                <p>{CONDITIONS_TEXT.regulacion}</p>
              </div>

              <div className="conditions-section">
                <h3>Ámbito de las denuncias</h3>
                <p>{CONDITIONS_TEXT.ambito}</p>
              </div>

              <div className="conditions-section">
                <h3>Contenido de la denuncia</h3>
                <p>Las denuncias recibidas deben contener los datos necesarios para poder llevar a cabo el análisis de los hechos denunciados. Las comunicaciones recibidas deberán cumplir como mínimo los siguientes requisitos:</p>
                <ul>
                  {CONDITIONS_TEXT.requisitos.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="conditions-actions">
                <button className="btn-accept" onClick={() => setStep('form')}>
                  Acepto las condiciones y deseo enviar una denuncia
                </button>
                <button className="btn-consult" onClick={() => setStep('consult')}>
                  Ya tengo un PIN — Consultar mi denuncia
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="canal-form-wrapper">
            <div className="form-card">
              <h2>Formulario de denuncia</h2>
              <p className="form-note">Los campos marcados con * son obligatorios. Su denuncia será tratada de forma confidencial.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="hechos">Exposición de los hechos *</label>
                  <textarea
                    id="hechos"
                    name="hechos"
                    value={formData.hechos}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Describa de forma clara y detallada los hechos que desea denunciar..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="seccion_lugar">Sección y lugar</label>
                  <input
                    type="text"
                    id="seccion_lugar"
                    name="seccion_lugar"
                    value={formData.seccion_lugar}
                    onChange={handleChange}
                    placeholder="Indique la sección y lugar donde ocurrieron los hechos"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vinculacion">Vinculación con la empresa</label>
                  <input
                    type="text"
                    id="vinculacion"
                    name="vinculacion"
                    value={formData.vinculacion}
                    onChange={handleChange}
                    placeholder="Ej: empleado, proveedor, cliente..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="personas_involucradas">Personas involucradas</label>
                  <textarea
                    id="personas_involucradas"
                    name="personas_involucradas"
                    value={formData.personas_involucradas}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Identifique a las personas involucradas o con conocimiento de los hechos"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="momento">Momento de los hechos</label>
                  <input
                    type="text"
                    id="momento"
                    name="momento"
                    value={formData.momento}
                    onChange={handleChange}
                    placeholder="Cuándo ocurrió o ha estado ocurriendo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="documentos_info">Documentación adicional</label>
                  <textarea
                    id="documentos_info"
                    name="documentos_info"
                    value={formData.documentos_info}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Información adicional, referencias a documentos, etc."
                  />
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={() => setStep('conditions')}>
                    Volver
                  </button>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar denuncia'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="canal-success">
            <div className="success-card">
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2>Denuncia enviada correctamente</h2>
              <p>Su denuncia ha sido registrada. Guarde el siguiente PIN para poder consultar el estado de su denuncia en cualquier momento:</p>
              <div className="pin-display">
                <span className="pin-label">Su PIN de seguimiento</span>
                <span className="pin-value">{pin}</span>
              </div>
              <p className="pin-warning">Guarde este PIN en un lugar seguro. Es la única forma de consultar el estado de su denuncia.</p>
              <button className="btn-consult" onClick={() => { setStep('consult'); setConsultPin(pin); }}>
                Consultar estado de mi denuncia
              </button>
            </div>
          </div>
        )}

        {step === 'consult' && (
          <div className="canal-consult">
            <div className="consult-card">
              <h2>Consultar denuncia</h2>
              <p>Introduzca el PIN que recibió al enviar su denuncia para consultar su estado.</p>

              <form onSubmit={handleConsult}>
                <div className="form-group">
                  <label htmlFor="consultPin">PIN de seguimiento</label>
                  <input
                    type="text"
                    id="consultPin"
                    value={consultPin}
                    onChange={(e) => setConsultPin(e.target.value.toUpperCase())}
                    placeholder="Introduzca su PIN"
                    maxLength={8}
                    required
                    className="pin-input"
                  />
                </div>

                {consultError && <div className="form-error">{consultError}</div>}

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={() => { setStep('conditions'); setConsultResult(null); setConsultError(null); }}>
                    Volver
                  </button>
                  <button type="submit" className="btn-submit" disabled={consulting}>
                    {consulting ? 'Consultando...' : 'Consultar'}
                  </button>
                </div>
              </form>

              {consultResult && (
                <div className="consult-result">
                  <div className="result-header">
                    <h3>Estado de su denuncia</h3>
                    <span className={`estado-badge ${estadoClass(consultResult.estado)}`}>
                      {estadoLabel(consultResult.estado)}
                    </span>
                  </div>
                  <div className="result-detail">
                    <span className="result-label">Fecha de envío</span>
                    <span className="result-value">
                      {new Date(consultResult.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="result-detail">
                    <span className="result-label">Descripción enviada</span>
                    <p className="result-text">{consultResult.hechos}</p>
                  </div>
                  {consultResult.respuesta && (
                    <div className="result-detail result-response">
                      <span className="result-label">Respuesta</span>
                      <p className="result-text">{consultResult.respuesta}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
