import { useState } from 'react';
import { api } from '../../lib/api';
import './AdminHomepage.css';
import './AdminDenuncias.css';

const MIN_LENGTH = 12;

// Change the signed-in admin's own password. Each person has their own account,
// so this never affects anyone else's login.
export default function AdminCuenta() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setDone(false);
    if (next.length < MIN_LENGTH) {
      setError(`La nueva contraseña debe tener al menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (next !== repeat) {
      setError('Las dos contraseñas nuevas no coinciden.');
      return;
    }
    setSaving(true);
    const { error: err } = await api.auth.changePassword(current, next);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setCurrent('');
    setNext('');
    setRepeat('');
    setDone(true);
  }

  return (
    <div className="admin-homepage">
      <h2>Mi cuenta</h2>
      <p className="admin-homepage-desc">
        Cambia la contraseña con la que entras al panel. Usa una de al menos {MIN_LENGTH} caracteres
        que no utilices en ningún otro sitio.
      </p>

      <form className="admin-denuncia-edit admin-cuenta-form" onSubmit={handleSubmit}>
        <label>
          Contraseña actual
          <input type="password" autoComplete="current-password" value={current}
            onChange={(e) => setCurrent(e.target.value)} required />
        </label>
        <label>
          Nueva contraseña
          <input type="password" autoComplete="new-password" value={next}
            onChange={(e) => setNext(e.target.value)} required />
        </label>
        <label>
          Repite la nueva contraseña
          <input type="password" autoComplete="new-password" value={repeat}
            onChange={(e) => setRepeat(e.target.value)} required />
        </label>
        {error && <p className="admin-denuncias-error">{error}</p>}
        {done && <p className="admin-cuenta-ok">Contraseña cambiada.</p>}
        <button type="submit" className="admin-homepage-save" disabled={saving}>
          {saving ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  );
}
