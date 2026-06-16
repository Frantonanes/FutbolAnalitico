import { useEffect, useState } from 'react'
import {
  getMedia,
  createMedia,
  searchMedia,
  deleteMedia
} from '../../../services/contentService'
import { uploadImage } from '../../../services/uploadService'
import './AdminForm.css'

type Media = {
  _id: string
  name: string
  url: string
  public_id?: string
  hashtags: string[]
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])

  const [name, setName] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadMedia()
  }, [])

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

      const uploaded =
        await uploadImage(file)

      await createMedia({
        name: name.trim(),
        url: uploaded.url,
        public_id: uploaded.public_id,
        hashtags: hashtags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      })

      setName('')
      setHashtags('')
      e.target.value = ''

      loadMedia()
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
      const data =
        await searchMedia(search)

      setMedia(data)
    } catch (error) {
      console.error(error)
      alert('Error buscando imágenes')
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      '¿Eliminar imagen?'
    )

    if (!confirmDelete) return

    try {
      await deleteMedia(id)
      loadMedia()
    } catch (error) {
      console.error(error)
      alert('Error eliminando imagen')
    }
  }

  return (
    <div className="admin-form-page">
      <h1>Biblioteca multimedia</h1>

      <div className="admin-form">
        <input
          placeholder="Nombre de la imagen"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Hashtags separados por coma"
          value={hashtags}
          onChange={(e) =>
            setHashtags(e.target.value)
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />

        {uploading && (
          <p>Subiendo imagen...</p>
        )}
      </div>

      <div
        style={{
          marginTop: '2rem'
        }}
      >
        <input
          placeholder="Buscar por nombre o hashtag"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          type="button"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p>Cargando imágenes...</p>
      ) : media.length === 0 ? (
        <p>No hay imágenes cargadas.</p>
      ) : (
        <div className="media-grid">
          {media.map((item) => (
            <div
              key={item._id}
              className="media-card"
            >
              <img
                src={item.url}
                alt={item.name}
                className="media-image"
              />

              <strong>
                {item.name || 'Sin nombre'}
              </strong>

              <div className="media-tags">
                {item.hashtags?.map((tag) => (
                  <span key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDelete(item._id)
                }
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