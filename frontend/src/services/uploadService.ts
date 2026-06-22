const API_URL = import.meta.env.VITE_API_URL
import { getAuthHeaders } from './authService'

export async function uploadImage(file: File) {
  const formData = new FormData()

  formData.append('image', file)

  const response = await fetch(
    `${API_URL}/upload`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error('Error subiendo imagen')
  }

  return response.json()
}
