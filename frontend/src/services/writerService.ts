const API_URL = import.meta.env.VITE_API_URL

export type Writer = {
  _id: string
  name: string
  slug: string
  image: string
  role: string
  bio: string
  twitter: string
  instagram: string
}

export type WriterPayload = Omit<Writer, '_id'>

async function handleResponse(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Error procesando escritor'
    )
  }

  return data
}

export async function getWriters(): Promise<Writer[]> {
  const response = await fetch(`${API_URL}/writers`)
  return handleResponse(response)
}

export async function createWriter(
  writer: WriterPayload
): Promise<Writer> {
  const response = await fetch(`${API_URL}/writers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(writer)
  })

  return handleResponse(response)
}

export async function updateWriter(
  id: string,
  writer: WriterPayload
): Promise<Writer> {
  const response = await fetch(
    `${API_URL}/writers/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(writer)
    }
  )

  return handleResponse(response)
}

export async function deleteWriter(id: string) {
  const response = await fetch(
    `${API_URL}/writers/${id}`,
    {
      method: 'DELETE'
    }
  )

  return handleResponse(response)
}