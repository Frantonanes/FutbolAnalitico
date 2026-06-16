import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { News } from '../../../shared/types/News'
import { Helmet } from 'react-helmet-async'
import { getNewsBySlug } from '../../../services/newsService'

import './NewsDetailPage.css'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    getNewsBySlug(slug)
      .then((data) => {
        setNews(data)
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <h1 className="news-detail__status">Cargando...</h1>
  }

  if (!news) {
    return <h1 className="news-detail__status">Noticia no encontrada</h1>
  }

  const publishedDate = news.createdAt
    ? new Date(news.createdAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : null

  const publishedTime = news.createdAt
    ? new Date(news.createdAt).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null

  return (
    <>
      <Helmet>
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.subtitle} />
        <meta property="og:image" content={news.image} />
        <meta property="og:type" content="article" />

        <link
          rel="canonical"
          href={`https://futbolanalitico.com/noticias/${news.slug}`}
        />

        <title>{news.title} | Futbol Analítico</title>

        <meta
          name="description"
          content={news.subtitle}
        />
      </Helmet>

      <article className="news-detail">
        <button
          type="button"
          className="news-detail__back"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {news.image && (
          <div className="news-detail__hero-wrap">
            <img
              className="news-detail__hero"
              src={news.image}
              alt={news.title}
            />

            <div className="news-detail__hero-overlay" />
          </div>
        )}

        <header className="news-detail__header">
          <span className="news-detail__category">
            {news.category}
          </span>

          <h1 className="news-detail__title">
            {news.title}
          </h1>

          <p className="news-detail__subtitle">
            {news.subtitle}
          </p>

          {publishedDate && publishedTime && (
            <p className="news-detail__date">
              Publicado el {publishedDate} · {publishedTime} hs
            </p>
          )}
        </header>

        <div className="news-detail__content">
          {(news.sections || []).map((section, index) => {
            switch (section.type) {
              case 'text':
                return (
                  <p
                    key={index}
                    className="news-detail__text"
                  >
                    {section.content}
                  </p>
                )

              case 'image-right':
                return (
                  <section
                    key={index}
                    className="news-detail__section"
                  >
                    <p>{section.content}</p>

                    {section.image && (
                      <img
                        src={section.image}
                        alt=""
                      />
                    )}
                  </section>
                )

              case 'image-left':
                return (
                  <section
                    key={index}
                    className="news-detail__section news-detail__section--reverse"
                  >
                    {section.image && (
                      <img
                        src={section.image}
                        alt=""
                      />
                    )}

                    <p>{section.content}</p>
                  </section>
                )

              case 'image-full':
                return section.image ? (
                  <img
                    key={index}
                    className="news-detail__image-full"
                    src={section.image}
                    alt=""
                  />
                ) : null

              default:
                return null
            }
          })}
        </div>

        {news.hashtags?.length > 0 && (
          <div className="news-detail__hashtags">
            {news.hashtags.map((tag: string) => (
              <span key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </>
  )
}