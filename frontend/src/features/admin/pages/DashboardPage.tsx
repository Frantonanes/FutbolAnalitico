import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getNews } from '../../../services/newsService'
import { getPredictions } from '../../../services/predictionService'

import type { News } from '../../../shared/types/News'
import type { Prediction } from '../../../shared/types/Prediction'

import './DashBoardPage.css'

export default function DashboardPage() {
  const [news, setNews] = useState<News[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        const [newsData, predictionsData] = await Promise.all([
          getNews(controller.signal),
          getPredictions(controller.signal)
        ])

        if (controller.signal.aborted) return

        setNews(newsData)
        setPredictions(predictionsData)
      } catch (error) {
        if (controller.signal.aborted) return

        console.error(error)
        setError('Error cargando el dashboard')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => controller.abort()
  }, [])

  const latestNews = news.slice(0, 4)
  const latestPredictions = predictions.slice(0, 4)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del panel de administración.</p>
        </div>

        <div className="dashboard-header__actions">
          <Link to="/admin/noticias/crear">
            Nueva noticia
          </Link>

          <Link to="/admin/predicciones/crear">
            Nueva predicción
          </Link>
        </div>
      </header>

      {loading && (
        <p className="dashboard-status">
          Cargando dashboard...
        </p>
      )}

      {!loading && error && (
        <p className="dashboard-status dashboard-status--error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <section className="dashboard-stats">
            <article className="dashboard-card">
              <span>Noticias</span>
              <strong>{news.length}</strong>
              <p>Total de noticias publicadas.</p>
            </article>

            <article className="dashboard-card">
              <span>Predicciones</span>
              <strong>{predictions.length}</strong>
              <p>Total de predicciones cargadas.</p>
            </article>

            <article className="dashboard-card">
              <span>Última noticia</span>
              <strong>
                {latestNews[0]?.title || '-'}
              </strong>
              <p>Contenido más reciente.</p>
            </article>

            <article className="dashboard-card">
              <span>Última predicción</span>
              <strong>
                {latestPredictions[0]
                  ? `${latestPredictions[0].homeTeam} vs ${latestPredictions[0].awayTeam}`
                  : '-'}
              </strong>
              <p>Partido más reciente.</p>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-panel">
              <div className="dashboard-panel__header">
                <h2>Últimas noticias</h2>

                <Link to="/admin/noticias">
                  Ver todas
                </Link>
              </div>

              {latestNews.length === 0 ? (
                <p className="dashboard-empty">
                  No hay noticias cargadas.
                </p>
              ) : (
                <div className="dashboard-list">
                  {latestNews.map((item) => (
                    <Link
                      key={item._id}
                      to={`/admin/noticias/editar/${item._id}`}
                      className="dashboard-list__item"
                    >
                      <strong>{item.title}</strong>

                      <span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('es-AR')
                          : 'Sin fecha'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-panel__header">
                <h2>Últimas predicciones</h2>

                <Link to="/admin/predicciones">
                  Ver todas
                </Link>
              </div>

              {latestPredictions.length === 0 ? (
                <p className="dashboard-empty">
                  No hay predicciones cargadas.
                </p>
              ) : (
                <div className="dashboard-list">
                  {latestPredictions.map((item) => (
                    <Link
                      key={item._id}
                      to={`/admin/predicciones/editar/${item._id}`}
                      className="dashboard-list__item"
                    >
                      <strong>
                        {item.homeTeam} vs {item.awayTeam}
                      </strong>

                      <span>
                        {item.date
                          ? new Date(item.date).toLocaleDateString('es-AR')
                          : 'Sin fecha'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </article>
          </section>

          <section className="dashboard-shortcuts">
            <Link to="/admin/noticias/crear">
              Crear noticia
            </Link>

            <Link to="/admin/predicciones/crear">
              Crear predicción
            </Link>

            <Link to="/admin/media">
              Biblioteca multimedia
            </Link>

            <Link to="/admin/escritores">
              Escritores
            </Link>
          </section>
        </>
      )}
    </div>
  )
}