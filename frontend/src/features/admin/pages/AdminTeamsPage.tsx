import { useEffect, useState } from 'react'
import {
  getCompetitions,
  getTeams,
  createTeam,
  deleteTeam
} from '../../../services/contentService'
import { uploadImage } from '../../../services/uploadService'
import { slugify } from '../../../shared/utils/slugify'
import './AdminForm.css'

type Competition = {
  _id: string
  name: string
}

type Team = {
  _id: string
  name: string
  logo: string
  competitionId: string
}

export default function AdminTeamsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  const [competitionId, setCompetitionId] = useState('')

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const [competitionsData, teamsData] =
        await Promise.all([
          getCompetitions(),
          getTeams()
        ])

      setCompetitions(competitionsData)
      setTeams(teamsData)
    } catch (error) {
      console.error(error)
      alert('Error cargando equipos')
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

    if (!competitionId) {
      alert('Seleccioná una competición')
      return
    }

    if (!logo) {
      alert('Subí un logo')
      return
    }

    try {
      setSaving(true)

      await createTeam({
        name: name.trim(),
        slug: slugify(name),
        logo,
        competitionId
      })

      setName('')
      setLogo('')
      setCompetitionId('')

      loadData()
    } catch (error) {
      console.error(error)
      alert('Error creando equipo')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      '¿Eliminar equipo?'
    )

    if (!confirmDelete) return

    try {
      await deleteTeam(id)

      setTeams(
        teams.filter(
          (team) => team._id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert('Error eliminando equipo')
    }
  }

  function getCompetitionName(
    competitionId: string
  ) {
    const competition = competitions.find(
      (item) => item._id === competitionId
    )

    return competition?.name || '-'
  }

  return (
    <div className="admin-form-page">
      <h1>Equipos</h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <input
          placeholder="Nombre del equipo"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <select
          value={competitionId}
          onChange={(e) =>
            setCompetitionId(e.target.value)
          }
        >
          <option value="">
            Seleccionar competición
          </option>

          {competitions.map((competition) => (
            <option
              key={competition._id}
              value={competition._id}
            >
              {competition.name}
            </option>
          ))}
        </select>

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
          {saving ? 'Creando...' : 'Crear equipo'}
        </button>
      </form>

      {loading ? (
        <p>Cargando equipos...</p>
      ) : teams.length === 0 ? (
        <p>No hay equipos cargados.</p>
      ) : (
        <div className="admin-list">
          {teams.map((team) => (
            <div
              key={team._id}
              className="section-preview"
            >
              {team.logo && (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="competition-logo-preview"
                />
              )}

              <strong>{team.name}</strong>

              <p>
                {getCompetitionName(
                  team.competitionId
                )}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleDelete(team._id)
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