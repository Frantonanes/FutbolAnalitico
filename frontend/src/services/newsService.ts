const API_URL = import.meta.env.VITE_API_URL
import { getAuthHeaders } from './authService'
import type { News } from '../shared/types/News'

type NewsPayload = Omit<
  News,
  '_id' | 'id' | 'createdAt'
>

export async function getNews(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/news`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Error obteniendo noticias')
  }

  return response.json()
}

export async function getNewsBySlug(
  slug: string,
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/news/${slug}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Noticia no encontrada')
  }

  return response.json()
}

export async function createNews(
  news: NewsPayload
) {
  const response = await fetch(
    `${API_URL}/news`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(news)
    }
  )

  if (!response.ok) {
    throw new Error('Error creando noticia')
  }

  return response.json()
}

export async function updateNews(
  id: string,
  news: NewsPayload
) {
  const response = await fetch(
    `${API_URL}/news/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(news)
    }
  )

  if (!response.ok) {
    throw new Error('Error actualizando noticia')
  }

  return response.json()
}

export async function getNewsById(
  id: string,
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/news/id/${id}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Noticia no encontrada')
  }

  return response.json()
}

export async function deleteNews(
  id: string
) {
  const response = await fetch(
    `${API_URL}/news/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error('Error eliminando noticia')
  }
}
