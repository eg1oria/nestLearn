import './Loader.scss';

export default function Loader() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">Загрузка...</p>
      </div>
    </div>
  );
}
