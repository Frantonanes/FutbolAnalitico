import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import NewsCard from '../../home/Featured/NewsCard'
import { getNews } from '../../../services/newsService'
import type { News } from '../../../shared/types/News'

import './NewsPage.css'

export default function NewsPage() {
  const [news, setNews] =
    useState<News[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    try {
      setLoading(true)

      const data = await getNews()

      setNews(data)
    } catch (error) {
      console.error(error)
      setError(
        'No se pudieron cargar las noticias.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>
            Noticias | Futbol Analítico
          </title>

          <meta
            name="description"
            content="Últimas noticias de fútbol, análisis, historias y actualidad deportiva."
          />
        </Helmet>

        <main className="news-page">
          <div className="news-page__empty">
            Cargando noticias...
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          Noticias | Futbol Analítico
        </title>

        <meta
          name="description"
          content="Últimas noticias de fútbol, análisis, historias y actualidad deportiva en Futbol Analítico."
        />

        <link
          rel="canonical"
          href="https://futbolanalitico.com/noticias"
        />
      </Helmet>

      <main className="news-page">
        <section className="news-page__hero">
          <span>Futbol Analítico</span>

          <h1>Noticias</h1>

          <p>
            Últimas novedades, historias y análisis del fútbol mundial.
          </p>

          <strong>
            {news.length} noticias publicadas
          </strong>
        </section>

        {error ? (
          <div className="news-page__empty">
            {error}
          </div>
        ) : news.length > 0 ? (
          <section className="news-page__grid">
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
          </section>
        ) : (
          <div className="news-page__empty">
            Todavía no hay noticias publicadas.
          </div>
        )}
      </main>
    </>
  )
}