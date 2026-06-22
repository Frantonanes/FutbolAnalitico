const API_URL = import.meta.env.VITE_API_URL
import { getAuthHeaders } from './authService'

type NamedSlugPayload = {
  name: string
  slug: string
}

type MediaPayload = {
  name: string
  url: string
  public_id?: string
  hashtags: string[]
}

type CompetitionPayload = NamedSlugPayload & {
  logo: string
}

type TeamPayload = NamedSlugPayload & {
  logo: string
  competitionId: string
}

/* ==========================
   CATEGORIES
========================== */

export async function getCategories(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/content/categories`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo categorías'
    )
  }

  return response.json()
}

export async function createCategory(
  category: NamedSlugPayload
) {
  const response = await fetch(
    `${API_URL}/content/categories`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(category)
    }
  )

  if (!response.ok) {
    throw new Error('Error creando categoría')
  }

  return response.json()
}

export async function deleteCategory(
  id: string
) {
  const response = await fetch(
    `${API_URL}/content/categories/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error eliminando categoría'
    )
  }
}

/* ==========================
   HASHTAGS
========================== */

export async function getHashtags(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/content/hashtags`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo hashtags'
    )
  }

  return response.json()
}

export async function createHashtag(
  hashtag: NamedSlugPayload
) {
  const response = await fetch(
    `${API_URL}/content/hashtags`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(hashtag)
    }
  )

  if (!response.ok) {
    throw new Error('Error creando hashtag')
  }

  return response.json()
}

export async function deleteHashtag(
  id: string
) {
  const response = await fetch(
    `${API_URL}/content/hashtags/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error eliminando hashtag'
    )
  }
}

/* ==========================
   MEDIA
========================== */

export async function getMedia(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/content/media`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo imágenes'
    )
  }

  return response.json()
}

export async function createMedia(
  media: MediaPayload
) {
  const response = await fetch(
    `${API_URL}/content/media`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(media)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error creando imagen'
    )
  }

  return response.json()
}

export async function searchMedia(
  search: string
) {
  const response = await fetch(
    `${API_URL}/content/media/search?hashtag=${encodeURIComponent(search)}`
  )

  if (!response.ok) {
    throw new Error(
      'Error buscando imágenes'
    )
  }

  return response.json()
}

export async function deleteMedia(
  id: string
) {
  const response = await fetch(
    `${API_URL}/content/media/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error eliminando imagen'
    )
  }
}

/* ==========================
   COMPETITIONS
========================== */

export async function getCompetitions(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/content/competitions`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo competiciones'
    )
  }

  return response.json()
}

export async function createCompetition(
  competition: CompetitionPayload
) {
  const response = await fetch(
    `${API_URL}/content/competitions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(competition)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error creando competición'
    )
  }

  return response.json()
}

export async function deleteCompetition(
  id: string
) {
  const response = await fetch(
    `${API_URL}/content/competitions/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error eliminando competición'
    )
  }
}

/* ==========================
   TEAMS
========================== */

export async function getTeams(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/content/teams`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo equipos'
    )
  }

  return response.json()
}

export async function getTeamsByCompetition(
  competitionId: string,
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/content/teams/competition/${competitionId}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo equipos'
    )
  }

  return response.json()
}

export async function createTeam(
  team: TeamPayload
) {
  const response = await fetch(
    `${API_URL}/content/teams`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(team)
    }
  )

  if (!response.ok) {
    throw new Error('Error creando equipo')
  }

  return response.json()
}

export async function deleteTeam(
  id: string
) {
  const response = await fetch(
    `${API_URL}/content/teams/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error eliminando equipo'
    )
  }
}
