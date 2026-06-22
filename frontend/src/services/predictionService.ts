const API_URL = import.meta.env.VITE_API_URL
import { getAuthHeaders } from './authService'
import type { Prediction } from '../shared/types/Prediction'

type PredictionPayload = Omit<
  Prediction,
  '_id' | 'id' | 'createdAt'
>

export async function createPrediction(
  prediction: PredictionPayload
) {
  const response = await fetch(
    `${API_URL}/predictions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(prediction)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error creando predicción'
    )
  }

  return response.json()
}

export async function updatePrediction(
  id: string,
  prediction: PredictionPayload
) {
  const response = await fetch(
    `${API_URL}/predictions/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(prediction)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error actualizando predicción'
    )
  }

  return response.json()
}

export async function deletePrediction(
  id: string
) {
  const response = await fetch(
    `${API_URL}/predictions/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error eliminando predicción'
    )
  }
}

export async function getPredictionBySlug(
  slug: string,
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/predictions/${slug}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Predicción no encontrada'
    )
  }

  return response.json()
}
export async function getPredictionById(
  id: string,
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/predictions/id/${id}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Predicción no encontrada')
  }

  return response.json()
}
export async function getPredictions(
  signal?: AbortSignal
) {
  const response = await fetch(
    `${API_URL}/predictions`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      'Error obteniendo predicciones'
    )
  }

  return response.json()
}
