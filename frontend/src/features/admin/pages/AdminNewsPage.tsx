import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import './AdminNewsPage.css'

import {
  getNews,
  deleteNews
} from '../../../services/newsService'

import type { News } from '../../../shared/types/News'

function normalizeText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/#/g, '')
    .trim()
}

function getDateValue(value?: string) {
  if (!value) return ''

  return new Date(value)
    .toISOString()
    .slice(0, 10)
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  const [titleSearch, setTitleSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHashtag, setSelectedHashtag] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getNews(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setNews(data)
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error(error)
        alert('Error cargando noticias')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  async function loadNews() {
    try {
      setLoading(true)

      const data = await getNews()

      setNews(data)
    } catch (error) {
      console.error(error)
      alert('Error cargando noticias')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm('¿Eliminar noticia?')

    if (!confirmDelete) return

    try {
      await deleteNews(id)

      await loadNews()
    } catch (error) {
      console.error(error)
      alert('Error eliminando noticia')
    }
  }

  const hashtagOptions = useMemo(() => {
    const hashtags = news.flatMap((item) => item.hashtags || [])
    const uniqueHashtags = Array.from(
      new Set(
        hashtags
          .map((tag) => String(tag).replace('#', '').trim())
          .filter(Boolean)
      )
    )

    return uniqueHashtags.sort((a, b) => a.localeCompare(b))
  }, [news])

  const filteredNews = useMemo(() => {
    const normalizedTitleSearch = normalizeText(titleSearch)
    const normalizedHashtag = normalizeText(selectedHashtag)

    return news.filter((item) => {
      const matchesTitle =
        !normalizedTitleSearch ||
        normalizeText(item.title).includes(normalizedTitleSearch)

      const matchesDate =
        !selectedDate ||
        getDateValue(item.createdAt) === selectedDate

      const itemHashtags = (item.hashtags || []).map(normalizeText)

      const matchesHashtag =
        !normalizedHashtag ||
        itemHashtags.includes(normalizedHashtag)

      return matchesTitle && matchesDate && matchesHashtag
    })
  }, [news, titleSearch, selectedDate, selectedHashtag])

  const hasActiveFilters =
    titleSearch.trim() || selectedDate || selectedHashtag

  function clearFilters() {
    setTitleSearch('')
    setSelectedDate('')
    setSelectedHashtag('')
  }

  return (
    <div className="admin-news">
      <div className="admin-news-header">
        <div>
          <h1>Administrar noticias</h1>

          <p>
            {filteredNews.length} de {news.length} noticias
          </p>
        </div>

        <Link
          to="/admin/noticias/crear"
          className="admin-news-create"
        >
          Nueva noticia
        </Link>
      </div>

      <section className="admin-news-filters">
        <input
          type="search"
          placeholder="Buscar por título"
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          value={selectedHashtag}
          onChange={(e) => setSelectedHashtag(e.target.value)}
        >
          <option value="">Todos los hashtags</option>

          {hashtagOptions.map((hashtag) => (
            <option key={hashtag} value={hashtag}>
              #{hashtag}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </section>

      {loading && (
        <p className="admin-news-status">Cargando noticias...</p>
      )}

      {!loading && news.length === 0 && (
        <p className="admin-news-status">
          No hay noticias cargadas.
        </p>
      )}

      {!loading && news.length > 0 && filteredNews.length === 0 && (
        <p className="admin-news-status">
          No hay noticias que coincidan con los filtros.
        </p>
      )}

      {!loading && filteredNews.length > 0 && (
        <div className="admin-news-table-wrap">
          <table className="admin-news-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Hashtags</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredNews.map((item) => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.title}</strong>
                  </td>

                  <td>{item.category || '-'}</td>

                  <td>
                    <div className="admin-news-tags">
                      {(item.hashtags || []).length > 0 ? (
                        item.hashtags?.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>

                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('es-AR')
                      : '-'}
                  </td>

                  <td>
                    <div className="admin-actions">
                      <Link
                        className="admin-edit"
                        to={`/admin/noticias/editar/${item._id}`}
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="admin-delete"
                        onClick={() => handleDelete(item._id!)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}