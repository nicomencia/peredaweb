import { useState } from 'react';
import './SimplePage.css';

// Online withdrawal function per Directive (EU) 2023/2673 (art. 11 bis of
// Directive 2011/83/UE): permanently accessible declaration form asking only
// for name, contract/order identification and the email for the acknowledgment,
// submitted via a button labelled "Confirmar desistimiento". The backend sends
// the mandatory acknowledgment (acuse de recibo) to the consumer by email.
export default function Desistimiento() {
  const [formData, setFormData] = useState({ nombre: '', pedido: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/forms.php?form=desistimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          pedido: formData.pedido.trim(),
          email: formData.email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setStatus({
        type: 'success',
        text: 'Su declaración de desistimiento se ha enviado correctamente. Recibirá un acuse de recibo en su correo electrónico.',
      });
      setFormData({ nombre: '', pedido: '', email: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: 'Error al enviar la declaración. Inténtelo de nuevo o contacte con nosotros por teléfono o correo.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <span className="eyebrow eyebrow--light">Derecho de desistimiento</span>
        <h1 className="simple-page-hero-title">desistir del contrato</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container">
          <div className="presupuesto-grid">
            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">Su derecho de desistimiento</h2>
              <span className="presupuesto-divider" />
              <p className="simple-page-text">
                Si ha celebrado un contrato o realizado un pedido a distancia con SANEAMIENTOS
                PEREDA SA, tiene derecho a desistir del mismo en un plazo de 14 días naturales sin
                necesidad de justificación, conforme a la legislación de defensa de los
                consumidores y usuarios.
              </p>
              <p className="simple-page-text">
                Puede ejercer este derecho mediante el formulario de esta página. Una vez
                confirmado el desistimiento, recibirá sin demora un acuse de recibo en el correo
                electrónico que nos indique, con el contenido y la fecha y hora de su declaración.
              </p>
              <p className="simple-page-text">
                También puede ejercer este derecho por cualquier otro medio admitido en Derecho,
                contactando con nosotros en el teléfono 985 271 026, por correo postal (CALLE
                INDEPENDENCIA, 43 - BAJO, 33004 OVIEDO, Asturias) o por correo electrónico.
              </p>
            </div>

            <div className="presupuesto-col">
              <h2 className="presupuesto-heading">Desistir del contrato aquí</h2>
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
                  name="pedido"
                  placeholder="Identificación del contrato o pedido (nº de pedido o factura)"
                  value={formData.pedido}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email donde recibir el acuse de recibo"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="presupuesto-submit" disabled={submitting}>
                  {submitting ? 'ENVIANDO...' : 'CONFIRMAR DESISTIMIENTO'}
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
