const API_URL = import.meta.env.VITE_API_URL
import { getAuthHeaders } from './authService'

export async function getNews() {
  const response = await fetch(
    `${API_URL}/news`
  )

  if (!response.ok) {
    throw new Error('Error obteniendo noticias')
  }

  return response.json()
}

export async function getNewsBySlug(
  slug: string
) {
  const response = await fetch(
    `${API_URL}/news/${slug}`
  )

  if (!response.ok) {
    throw new Error('Noticia no encontrada')
  }

  return response.json()
}

export async function createNews(
  news: any
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
  news: any
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

export async function getNewsById(id: string) {
  const response = await fetch(
    `${API_URL}/news/id/${id}`
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
