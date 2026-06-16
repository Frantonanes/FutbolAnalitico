import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Futbol<span>Analítico</span>
          </Link>

          <p>
            Noticias, estadísticas y predicciones del fútbol mundial con mirada analítica.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/categoria/mundial-2026">Mundial 2026</Link>
          <Link to="/categoria/seleccion-argentina">Selección Argentina</Link>
          <Link to="/noticias">Noticias</Link>
          <Link to="/predicciones">Predicciones</Link>
        </div>

        <div className="footer-highlight">
          <span>⚽</span>
          <strong>Análisis, datos y fútbol en un solo lugar.</strong>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 FutbolAnalítico. Todos los derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  )
}