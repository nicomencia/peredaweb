import './SimplePage.css';
import './Financiacion.css';

export default function Financiacion() {
  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <h1 className="simple-page-hero-title">financiación</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container">
          <div className="financiacion-intro">
            <h2 className="financiacion-title">
              En Saneamientos Pereda financiamos al 0% de interés
            </h2>
            <span className="presupuesto-divider" />
            <p className="financiacion-lead">
              Saneamientos Pereda pone a tu disposición una línea de financiación con
              unas condiciones inmejorables: todas tus compras al <strong>0% DE INTERÉS</strong>{' '}
              en cuotas de hasta 24 meses.
            </p>
          </div>

          <div className="financiacion-section">
            <h3 className="financiacion-subtitle">Una financiación que es todo ventajas para ti</h3>
            <div className="financiacion-benefits">
              <div className="financiacion-benefit">
                <p className="financiacion-benefit-title">ACCEDES A UN MEJOR PRODUCTO</p>
                <p className="financiacion-benefit-text">
                  Fracciona los pagos en la modalidad que más se ajuste a tus necesidades:
                  de 3 a 24 meses, más una pequeña cuota en concepto de gastos de gestión.
                  Eso significa que en vez de hacer frente al coste de tu obra de una vez,
                  la carga es menor y a lo mejor puedes permitirte algo mejor sin que tu
                  gasto mensual se vea comprometido.
                </p>
              </div>
              <div className="financiacion-benefit">
                <p className="financiacion-benefit-title">SIN DESEMBOLSOS</p>
                <p className="financiacion-benefit-text">
                  No adelantas pagos, solo la cuota establecida.
                </p>
              </div>
              <div className="financiacion-benefit">
                <p className="financiacion-benefit-title">ES CÓMODO Y MUY SENCILLO</p>
                <p className="financiacion-benefit-text">
                  Porque financiarte es cosa de dos pasos.
                </p>
              </div>
            </div>
          </div>

          <div className="financiacion-section">
            <h3 className="financiacion-subtitle">¿Cómo hacerlo?</h3>
            <div className="financiacion-steps">
              <div className="financiacion-step">
                <div className="financiacion-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <rect x="7" y="6" width="10" height="3" />
                    <circle cx="8.5" cy="13" r="0.8" fill="currentColor" />
                    <circle cx="12" cy="13" r="0.8" fill="currentColor" />
                    <circle cx="15.5" cy="13" r="0.8" fill="currentColor" />
                    <circle cx="8.5" cy="16.5" r="0.8" fill="currentColor" />
                    <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
                    <circle cx="15.5" cy="16.5" r="0.8" fill="currentColor" />
                  </svg>
                </div>
                <div className="financiacion-step-body">
                  <h4 className="financiacion-step-title">Calcula la cuota</h4>
                  <p className="financiacion-step-text">
                    Forma de pago, de 3 a 24 meses sin intereses.
                  </p>
                  <p className="financiacion-step-text">
                    Comisión de apertura 2% (mínimo 30 €) en financiaciones de 3 a 12 meses.
                  </p>
                  <p className="financiacion-step-text">
                    Comisión de apertura 4% (mínimo 30 €) en financiaciones de 13 a 24 meses.
                  </p>
                </div>
              </div>

              <div className="financiacion-step">
                <div className="financiacion-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 3h7l4 4v14H7z" />
                    <path d="M14 3v4h4" />
                    <path d="M9 13h6M9 16h6M9 10h3" />
                  </svg>
                </div>
                <div className="financiacion-step-body">
                  <h4 className="financiacion-step-title">
                    Presenta la siguiente documentación en cualquiera de nuestras tiendas
                  </h4>
                  <ol className="financiacion-list">
                    <li>Copia del NIF (en vigor).</li>
                    <li>Justificante de domiciliación bancaria.</li>
                    <li>
                      Justificante de ingresos:
                      <ul className="financiacion-sublist">
                        <li><em>Asalariados:</em> última nómina.</li>
                        <li><em>Pensionistas:</em> justificante de pensión.</li>
                        <li><em>Autónomos:</em> declaración de la renta (modelo 100).</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="financiacion-step">
                <div className="financiacion-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 5h12v14H4z" />
                    <path d="M16 9l4-2v10l-4-2" />
                    <path d="M7 9h6M7 12h6M7 15h4" />
                  </svg>
                </div>
                <div className="financiacion-step-body">
                  <h4 className="financiacion-step-title">Firma el contrato</h4>
                  <p className="financiacion-step-text">
                    Lee atentamente el contrato que te presentaremos, comprueba que la
                    modalidad y los conceptos sean los correctos y ya solo restará tu rúbrica.
                  </p>
                </div>
              </div>

              <div className="financiacion-step">
                <div className="financiacion-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 4c0 9 6 15 15 15l1-4-5-2-2 2c-2-1-4-3-5-5l2-2-2-5z" />
                  </svg>
                </div>
                <div className="financiacion-step-body">
                  <h4 className="financiacion-step-title">Te atenderemos en todo momento</h4>
                  <p className="financiacion-step-text">
                    Teléfono postventa: <a href="tel:984751799">984 75 17 99</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
