import { supabase } from '../../lib/supabase';
import AdminHomepage from './AdminHomepage';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="admin-dashboard-content">
        <AdminHomepage />
      </div>
    </div>
  );
}
