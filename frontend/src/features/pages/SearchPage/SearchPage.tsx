import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import NewsCard from '../../home/Featured/NewsCard'
import PredictionCard from '../../home/Prediction/PredictionCard'

import { getNews } from '../../../services/newsService'
import { getPredictions } from '../../../services/predictionService'

import type { News } from '../../../shared/types/News'
import type { Prediction } from '../../../shared/types/Prediction'

import './SearchPage.css'

export default function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''

  const [news, setNews] = useState<News[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadResults() {
      if (!query.trim()) {
        await Promise.resolve()

        if (controller.signal.aborted) return

        setNews([])
        setPredictions([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const [newsData, predictionsData] = await Promise.all([
          getNews(controller.signal),
          getPredictions(controller.signal)
        ])

        if (controller.signal.aborted) return

        const search = query.toLowerCase().trim()

        setNews(
          newsData.filter((item: News) =>
            item.title.toLowerCase().includes(search) ||
            (item.subtitle || '').toLowerCase().includes(search) ||
            (item.category || '').toLowerCase().includes(search)
          )
        )

        setPredictions(
          predictionsData.filter((item: Prediction) =>
            item.homeTeam.toLowerCase().includes(search) ||
            item.awayTeam.toLowerCase().includes(search) ||
            item.competition.toLowerCase().includes(search)
          )
        )
      } catch (error) {
        if (controller.signal.aborted) return
        console.error(error)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadResults()

    return () => controller.abort()
  }, [query])

  const hasResults = news.length > 0 || predictions.length > 0

  return (
    <main className="search-page">
      <section className="search-page__hero">
        <span>Resultados</span>

        <h1>
          Búsqueda: {query || 'Sin término'}
        </h1>

        <p>
          Noticias y predicciones relacionadas con tu búsqueda.
        </p>

        <strong>
          {news.length + predictions.length} resultados encontrados
        </strong>
      </section>

      {loading && (
        <div className="search-page__empty">
          Buscando resultados...
        </div>
      )}

      {!loading && !hasResults && (
        <div className="search-page__empty">
          No se encontraron resultados para "{query}".
        </div>
      )}

      {!loading && news.length > 0 && (
        <section className="search-page__section">
          <div className="search-page__section-header">
            <span>Noticias</span>
            <h2>Resultados en noticias</h2>
          </div>

          <div className="search-page__grid">
            {news.map((item) => (
              <NewsCard
                key={item._id || item.slug}
                image={item.image}
                category={item.category}
                title={item.title}
                excerpt={item.subtitle}
                slug={item.slug}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && predictions.length > 0 && (
        <section className="search-page__section">
          <div className="search-page__section-header">
            <span>Predicciones</span>
            <h2>Resultados en predicciones</h2>
          </div>

          <div className="search-page__grid">
            {predictions.map((prediction) => (
              <PredictionCard
                key={prediction._id || prediction.slug}
                slug={prediction.slug}
                competition={prediction.competition}
                homeTeam={prediction.homeTeam}
                awayTeam={prediction.awayTeam}
                homeLogo={prediction.homeLogo}
                awayLogo={prediction.awayLogo}
                date={prediction.date}
                homeProbability={prediction.homeProbability}
                drawProbability={prediction.drawProbability}
                awayProbability={prediction.awayProbability}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
