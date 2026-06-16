import { useEffect, useState } from 'react'
import {
  getCompetitions,
  createCompetition,
  deleteCompetition
} from '../../../services/contentService'
import { uploadImage } from '../../../services/uploadService'
import { slugify } from '../../../shared/utils/slugify'
import './AdminForm.css'

type Competition = {
  _id: string
  name: string
  slug: string
  logo: string
}

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] =
    useState<Competition[]>([])

  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCompetitions()
  }, [])

  async function loadCompetitions() {
    try {
      setLoading(true)

      const data = await getCompetitions()

      setCompetitions(data)
    } catch (error) {
      console.error(error)
      alert('Error cargando competiciones')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogoUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    try {
      setUploading(true)

      const data = await uploadImage(file)

      setLogo(data.url)
      e.target.value = ''
    } catch (error) {
      console.error(error)
      alert('Error subiendo logo')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!name.trim()) {
      alert('Ingresá un nombre')
      return
    }

    if (!logo) {
      alert('Subí un logo')
      return
    }

    try {
      setSaving(true)

      await createCompetition({
        name: name.trim(),
        slug: slugify(name),
        logo
      })

      setName('')
      setLogo('')

      loadCompetitions()
    } catch (error) {
      console.error(error)
      alert('Error creando competición')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      '¿Eliminar competición?'
    )

    if (!confirmDelete) return

    try {
      await deleteCompetition(id)

      setCompetitions(
        competitions.filter(
          (competition) =>
            competition._id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert('Error eliminando competición')
    }
  }

  return (
    <div className="admin-form-page">
      <h1>Competiciones</h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <input
          placeholder="Nombre de competición"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
        />

        {uploading && (
          <p>Subiendo logo...</p>
        )}

        {logo && (
          <img
            src={logo}
            alt="Logo preview"
            className="competition-logo-preview"
          />
        )}

        <button
          type="submit"
          disabled={saving || uploading}
        >
          {saving
            ? 'Creando...'
            : 'Crear competición'}
        </button>
      </form>

      {loading ? (
        <p>Cargando competiciones...</p>
      ) : competitions.length === 0 ? (
        <p>No hay competiciones cargadas.</p>
      ) : (
        <div className="admin-list">
          {competitions.map((competition) => (
            <div
              key={competition._id}
              className="section-preview"
            >
              {competition.logo && (
                <img
                  src={competition.logo}
                  alt={competition.name}
                  className="competition-logo-preview"
                />
              )}

              <strong>
                {competition.name}
              </strong>

              <p>
                slug: {competition.slug}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    competition._id
                  )
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