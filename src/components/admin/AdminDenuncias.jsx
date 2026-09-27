import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import './AdminHomepage.css';
import './AdminDenuncias.css';

// Canal de denuncias: the reports sent from /canal-denuncias. The company reads
// them here, moves them through the states and writes the reply the reporter
// sees when they check their PIN. The PIN itself is never shown: it is the
// reporter's private key to their report, not something the company needs.
const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente de revisión' },
  { value: 'en_revision', label: 'En revisión' },
  { value: 'resuelta', label: 'Resuelta' },
];

const DETAIL_FIELDS = [
  ['hechos', 'Exposición de los hechos'],
  ['seccion_lugar', 'Sección / lugar'],
  ['vinculacion', 'Vinculación con la empresa'],
  ['personas_involucradas', 'Personas involucradas'],
  ['momento', 'Momento de los hechos'],
  ['documentos_info', 'Documentación / pruebas'],
];

const formatDate = (value) =>
  value
    ? new Date(value.replace(' ', 'T')).toLocaleString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '';

const estadoLabel = (value) => ESTADOS.find((e) => e.value === value)?.label || value;

export default function AdminDenuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState({ estado: '', respuesta: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.list('denuncias').then(({ data, error: err }) => {
      if (err) setError('No se pudieron cargar las denuncias: ' + err.message);
      else setDenuncias(data || []);
      setLoading(false);
    });
  }, []);

  function toggle(d) {
    if (openId === d.id) {
      setOpenId(null);
      return;
    }
    setOpenId(d.id);
    setDraft({ estado: d.estado || 'pendiente', respuesta: d.respuesta || '' });
  }

  async function save(id) {
    setSaving(true);
    const { data, error: err } = await api.from('denuncias').update(draft).eq('id', id);
    setSaving(false);
    if (err) {
      setMessage('Error al guardar: ' + err.message);
    } else {
      setDenuncias((list) => list.map((d) => (d.id === id ? data : d)));
      setMessage('Denuncia actualizada.');
    }
    setTimeout(() => setMessage(''), 3000);
  }

  const pending = denuncias.filter((d) => d.estado === 'pendiente').length;

  return (
    <div className="admin-homepage">
      <h2>Canal de denuncias</h2>
      <p className="admin-homepage-desc">
        Denuncias recibidas desde la web. Confidencial: el contenido solo es visible aquí.
        El estado y la respuesta los ve el denunciante al consultar su denuncia con su PIN.
        Recuerda que la ley exige acusar recibo en un máximo de 7 días y responder en un máximo
        de 3 meses.
      </p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      {loading && <p>Cargando…</p>}
      {error && <p className="admin-denuncias-error">{error}</p>}
      {!loading && !error && denuncias.length === 0 && (
        <p className="admin-denuncias-empty">No se ha recibido ninguna denuncia.</p>
      )}
      {!loading && pending > 0 && (
        <p className="admin-denuncias-summary">
          {pending === 1 ? '1 denuncia pendiente de revisión.' : `${pending} denuncias pendientes de revisión.`}
        </p>
      )}

      <ul className="admin-denuncias-list">
        {denuncias.map((d) => (
          <li key={d.id} className={`admin-denuncia ${openId === d.id ? 'is-open' : ''}`}>
            <button type="button" className="admin-denuncia-head" onClick={() => toggle(d)}>
              <span className="admin-denuncia-date">{formatDate(d.created_at)}</span>
              <span className="admin-denuncia-excerpt">{d.hechos}</span>
              <span className={`admin-denuncia-badge estado-${d.estado}`}>{estadoLabel(d.estado)}</span>
            </button>

            {openId === d.id && (
              <div className="admin-denuncia-body">
                <dl>
                  {DETAIL_FIELDS.map(([key, label]) => (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>{d[key] || '—'}</dd>
                    </div>
                  ))}
                  <div>
                    <dt>Última actualización</dt>
                    <dd>{formatDate(d.updated_at)}</dd>
                  </div>
                </dl>

                <div className="admin-denuncia-edit">
                  <label>
                    Estado
                    <select
                      value={draft.estado}
                      onChange={(e) => setDraft({ ...draft, estado: e.target.value })}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Respuesta al denunciante (la verá al consultar con su PIN)
                    <textarea
                      rows={5}
                      value={draft.respuesta}
                      onChange={(e) => setDraft({ ...draft, respuesta: e.target.value })}
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-homepage-save"
                    disabled={saving}
                    onClick={() => save(d.id)}
                  >
                    {saving ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
