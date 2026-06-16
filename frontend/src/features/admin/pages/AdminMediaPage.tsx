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
  url: string
  public_id?: string
  hashtags: string[]
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [hashtags, setHashtags] =
    useState('')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] =
    useState(false)

  async function loadMedia() {
    try {
      const data = await getMedia()
      setMedia(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    try {
      setUploading(true)

      const uploaded =
        await uploadImage(file)

      await createMedia({
        url: uploaded.url,
        public_id:
          uploaded.public_id,

        hashtags: hashtags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      })

      setHashtags('')

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
    }
  }
  async function handleDelete(id: string) {
  const confirmDelete = confirm('¿Eliminar imagen?')

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
          placeholder="Buscar por hashtag"
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
          
      <div className="media-grid">
  {media.map((item) => (
    <div
      key={item._id}
      className="media-card"
    >
      <img
        src={item.url}
        alt=""
        className="media-image"
      />

      <div className="media-tags">
        {item.hashtags?.map((tag) => (
          <span key={tag}>
            #{tag}
          </span>
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
    </div>
  )
}