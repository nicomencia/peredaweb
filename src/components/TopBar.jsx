import './TopBar.css';

export default function TopBar({ setCurrentView }) {
  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar-right">
          <button
            className="top-bar-button"
            onClick={() => setCurrentView('area-profesional')}
          >
            Área Profesional
          </button>
        </div>
      </div>
    </div>
  );
}
