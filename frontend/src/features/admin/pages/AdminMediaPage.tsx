import { useEffect, useState } from 'react'

import {
  getMedia,
  createMedia,
  searchMedia,
  deleteMedia,
  getHashtags
} from '../../../services/contentService'

import { uploadImage } from '../../../services/uploadService'
import HashtagSelector from '../components/HashtagSelector'

import './AdminForm.css'

type Media = {
  _id: string
  name: string
  url: string
  public_id?: string
  hashtags: string[]
}

type Hashtag = {
  _id: string
  name: string
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [hashtagOptions, setHashtagOptions] = useState<Hashtag[]>([])

  const [name, setName] = useState('')
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  async function loadMedia() {
    try {
      setLoading(true)

      const data = await getMedia()

      setMedia(data)
    } catch (error) {
      console.error(error)
      alert('Error cargando imágenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  let ignore = false

  async function loadInitialData() {
    try {
      const [mediaData, hashtagsData] = await Promise.all([
        getMedia(),
        getHashtags()
      ])

      if (ignore) return

      setMedia(mediaData)
      setHashtagOptions(hashtagsData)
    } catch (error) {
      if (ignore) return

      console.error(error)
      alert('Error cargando biblioteca multimedia')
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadInitialData()

  return () => {
    ignore = true
  }
}, [])

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    if (!name.trim()) {
      alert('Ingresá un nombre para la imagen')
      e.target.value = ''
      return
    }

    try {
      setUploading(true)

      const uploaded = await uploadImage(file)

      await createMedia({
        name: name.trim(),
        url: uploaded.url,
        public_id: uploaded.public_id,
        hashtags: selectedHashtags
      })

      setName('')
      setSelectedHashtags([])
      e.target.value = ''

      await loadMedia()
    } catch (error) {
      console.error(error)
      alert('Error subiendo imagen')
    } finally {
      setUploading(false)
    }
  }

  async function handleSearch() {
    if (!search.trim()) {
      loadMedia()
      return
    }

    try {
      const data = await searchMedia(search.trim())

      setMedia(data)
    } catch (error) {
      console.error(error)
      alert('Error buscando imágenes')
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm('¿Eliminar imagen?')

    if (!confirmDelete) return

    try {
      await deleteMedia(id)
      await loadMedia()
    } catch (error) {
      console.error(error)
      alert('Error eliminando imagen')
    }
  }

  return (
    <div className="admin-form-page admin-form-page--wide">
      <h1>Biblioteca multimedia</h1>

      <div className="admin-form admin-form--wide">
        <section className="admin-form__section">
          <h2>Subir imagen</h2>

          <input
            placeholder="Nombre de la imagen"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <HashtagSelector
            options={hashtagOptions}
            selected={selectedHashtags}
            onChange={setSelectedHashtags}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />

          {uploading && <p>Subiendo imagen...</p>}
        </section>

        <section className="admin-form__section">
          <h2>Buscar imágenes</h2>

          <input
            placeholder="Buscar por nombre o hashtag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="button" onClick={handleSearch}>
            Buscar
          </button>
        </section>
      </div>

      {loading ? (
        <p>Cargando imágenes...</p>
      ) : media.length === 0 ? (
        <p>No hay imágenes cargadas.</p>
      ) : (
        <div className="media-grid">
          {media.map((item) => (
            <div key={item._id} className="media-card">
              <img
                src={item.url}
                alt={item.name}
                className="media-image"
              />

              <strong>{item.name || 'Sin nombre'}</strong>

              <div className="media-tags">
                {item.hashtags?.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item._id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}