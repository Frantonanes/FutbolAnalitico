import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import NewsCard from '../../home/Featured/NewsCard'
import PredictionCard from '../../home/Prediction/PredictionCard'

import { getNews } from '../../../services/newsService'
import { getPredictions } from '../../../services/predictionService'

import type { News } from '../../../shared/types/News'
import type { Prediction } from '../../../shared/types/Prediction'

import './SearchPage.css'

function normalizeText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function newsMatches(item: News, search: string) {
  const searchableText = [
    item.title,
    item.subtitle,
    item.category,
    item.slug,
    item.competition,
    ...(item.hashtags || []),
    ...(item.teams || []),
    ...(item.sections || []).map((section) => section.content)
  ]
    .map(normalizeText)
    .join(' ')

  return searchableText.includes(search)
}

function predictionMatches(item: Prediction, search: string) {
  const searchableText = [
    item.homeTeam,
    item.awayTeam,
    item.competition,
    item.slug,
    item.date,
    ...(item.blocks || []).flatMap((block) => [
      block.title,
      ...(block.items || []).flatMap((blockItem) => [
        blockItem.label,
        blockItem.value
      ])
    ])
  ]
    .map(normalizeText)
    .join(' ')

  return searchableText.includes(search)
}

export default function SearchPage() {
  const [params] = useSearchParams()

  const query = params.get('q') || ''
  const normalizedQuery = useMemo(
    () => normalizeText(query),
    [query]
  )

  const [news, setNews] = useState<News[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadResults() {
      if (!normalizedQuery) {
        setNews([])
        setPredictions([])
        setLoading(false)
        setError('')
        return
      }

      try {
        setLoading(true)
        setError('')

        const [newsData, predictionsData] = await Promise.all([
          getNews(controller.signal),
          getPredictions(controller.signal)
        ])

        if (controller.signal.aborted) return

        setNews(
          newsData.filter((item: News) =>
            newsMatches(item, normalizedQuery)
          )
        )

        setPredictions(
          predictionsData.filter((item: Prediction) =>
            predictionMatches(item, normalizedQuery)
          )
        )
      } catch (err) {
        if (controller.signal.aborted) return

        console.error(err)
        setError('No pudimos cargar los resultados. Intentá nuevamente.')
        setNews([])
        setPredictions([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadResults()

    return () => controller.abort()
  }, [normalizedQuery])

  const totalResults = news.length + predictions.length
  const hasQuery = normalizedQuery.length > 0
  const hasResults = totalResults > 0

  return (
    <main className="search-page">
      <section className="search-page__hero">
        <span>Resultados</span>

        <h1>
          {hasQuery
            ? `Búsqueda: ${query}`
            : 'Buscar en Fútbol Analítico'}
        </h1>

        <p>
          Encontrá noticias, predicciones, equipos, competiciones y jugadores.
        </p>

        {hasQuery && !loading && !error && (
          <strong>
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
          </strong>
        )}
      </section>

      {loading && (
        <div className="search-page__empty">
          Buscando resultados...
        </div>
      )}

      {!loading && error && (
        <div className="search-page__empty search-page__empty--error">
          {error}
        </div>
      )}

      {!loading && !error && !hasQuery && (
        <div className="search-page__empty">
          Escribí una búsqueda desde el navegador superior.
        </div>
      )}

      {!loading && !error && hasQuery && !hasResults && (
        <div className="search-page__empty">
          No se encontraron resultados para "{query}".
        </div>
      )}

      {!loading && !error && news.length > 0 && (
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

      {!loading && !error && predictions.length > 0 && (
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