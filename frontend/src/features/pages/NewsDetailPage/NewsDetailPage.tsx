import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams
} from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import type { News } from '../../../shared/types/News'
import { getNewsBySlug } from '../../../services/newsService'

import './NewsDetailPage.css'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [news, setNews] =
    useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    getNewsBySlug(slug)
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <h1 className="news-detail__status">
        Cargando...
      </h1>
    )
  }

  if (!news) {
    return (
      <h1 className="news-detail__status">
        Noticia no encontrada
      </h1>
    )
  }

  const publishedDate = news.createdAt
    ? new Date(news.createdAt).toLocaleDateString(
        'es-AR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    : null

  const publishedTime = news.createdAt
    ? new Date(news.createdAt).toLocaleTimeString(
        'es-AR',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    : null

  const description =
    news.subtitle ||
    'Últimas noticias de fútbol en Futbol Analítico.'

  const author =
    news.authorId &&
    typeof news.authorId === 'object'
      ? news.authorId
      : null

  const authorInitials = author?.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <Helmet>
        <title>
          {news.title} | Futbol Analítico
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta
          property="og:title"
          content={news.title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:type"
          content="article"
        />

        {news.image && (
          <meta
            property="og:image"
            content={news.image}
          />
        )}

        {author && (
          <meta
            name="author"
            content={author.name}
          />
        )}

        {news.createdAt && (
          <meta
            property="article:published_time"
            content={news.createdAt}
          />
        )}

        <link
          rel="canonical"
          href={`https://futbolanalitico.com/noticias/${news.slug}`}
        />
      </Helmet>

      <main className="news-detail-page">
        <div className="news-detail-shell">
          <button
            type="button"
            className="news-detail__back"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>

          <article className="news-detail">
            <header className="news-detail__header">
              <div className="news-detail__meta">
                {news.category && (
                  <span className="news-detail__category">
                    {news.category}
                  </span>
                )}

                {news.competition && (
                  <span className="news-detail__competition">
                    {news.competition}
                  </span>
                )}
              </div>

              <h1 className="news-detail__title">
                {news.title}
              </h1>

              {news.subtitle && (
                <p className="news-detail__subtitle">
                  {news.subtitle}
                </p>
              )}

              <div className="news-detail__byline">
                {author ? (
                  <aside className="news-detail__author">
                    {author.image ? (
                      <img
                        className="news-detail__author-image"
                        src={author.image}
                        alt={author.name}
                      />
                    ) : (
                      <div className="news-detail__author-fallback">
                        {authorInitials}
                      </div>
                    )}

                    <div className="news-detail__author-info">
                      <span className="news-detail__author-label">
                        Escrito por
                      </span>

                      <strong className="news-detail__author-name">
                        {author.name}
                      </strong>

                      {author.role && (
                        <span className="news-detail__author-role">
                          {author.role}
                        </span>
                      )}

                      {author.bio && (
                        <p className="news-detail__author-bio">
                          {author.bio}
                        </p>
                      )}

                      {(author.twitter ||
                        author.instagram) && (
                        <div className="news-detail__author-socials">
                          {author.twitter && (
                            <a
                              href={author.twitter}
                              target="_blank"
                              rel="noreferrer"
                            >
                              X / Twitter
                            </a>
                          )}

                          {author.instagram && (
                            <a
                              href={author.instagram}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Instagram
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </aside>
                ) : (
                  <span />
                )}

                {publishedDate && (
                  <div className="news-detail__date">
                    <span>Publicado</span>
                    <strong>{publishedDate}</strong>

                    {publishedTime && (
                      <small>
                        {publishedTime} hs
                      </small>
                    )}
                  </div>
                )}
              </div>

              {news.teams && news.teams.length > 0 && (
                <div className="news-detail__teams">
                  {news.teams.map((team) => (
                    <span key={team}>
                      {team}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {news.image && (
              <div className="news-detail__hero-wrap">
                <img
                  className="news-detail__hero"
                  src={news.image}
                  alt={news.title}
                />
              </div>
            )}

            <div className="news-detail__content">
  {news.content ? (
    <div
      className="news-detail__rich-content"
      dangerouslySetInnerHTML={{
        __html: news.content
      }}
    />
  ) : !news.sections || news.sections.length === 0 ? (
    <p className="news-detail__text">
      Esta noticia todavía no tiene contenido.
    </p>
  ) : (
    news.sections.map((section, index) => {
      switch (section.type) {
        case 'text':
          return (
            <p key={index} className="news-detail__text">
              {section.content}
            </p>
          )

        case 'image-right':
          return (
            <section key={index} className="news-detail__section">
              <p>{section.content}</p>
              <img src={section.image} alt="" />
            </section>
          )

        case 'image-left':
          return (
            <section
              key={index}
              className="news-detail__section news-detail__section--reverse"
            >
              <img src={section.image} alt="" />
              <p>{section.content}</p>
            </section>
          )

        case 'image-full':
          return (
            <img
              key={index}
              className="news-detail__image-full"
              src={section.image}
              alt=""
            />
          )

        default:
          return null
      }
    })
  )}
</div>

            {news.hashtags?.length > 0 && (
              <div className="news-detail__hashtags">
                {news.hashtags.map((tag) => (
                  <span key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </main>
    </>
  )
}