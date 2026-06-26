import { useEffect, useMemo, useState } from 'react'

import { createPrediction } from '../../../services/predictionService'
import {
  getCompetitions,
  getTeamsByCompetition
} from '../../../services/contentService'

import type {
  PredictionBlock
} from '../../../shared/types/Prediction'

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

type TeamSelectorProps = {
  label: string
  placeholder: string
  value: string
  search: string
  teams: Team[]
  disabled: boolean
  onSearchChange: (value: string) => void
  onChange: (value: string) => void
}

function TeamSelector({
  label,
  placeholder,
  value,
  search,
  teams,
  disabled,
  onSearchChange,
  onChange
}: TeamSelectorProps) {
  const filteredTeams = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return teams.filter((team) =>
      team.name.toLowerCase().includes(normalizedSearch)
    )
  }, [teams, search])

  const selectedTeam = teams.find((team) => team._id === value)

  return (
    <div className="admin-form__section">
      <h2>{label}</h2>

      <input
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={disabled}
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Seleccionar equipo</option>

        {filteredTeams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>

      {selectedTeam?.logo && (
        <div className="team-selector-preview">
          <img
            src={selectedTeam.logo}
            alt={selectedTeam.name}
          />

          <strong>{selectedTeam.name}</strong>
        </div>
      )}
    </div>
  )
}

function isPredictionBlockItem(
  item: { label: string; value: string } | null
): item is { label: string; value: string } {
  return item !== null
}

export default function CreatePredictionPage() {
  const [competitions, setCompetitions] =
    useState<Competition[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  const [competitionId, setCompetitionId] = useState('')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [date, setDate] = useState('')

  const [homeProbability, setHomeProbability] = useState(50)
  const [drawProbability, setDrawProbability] = useState(25)
  const [awayProbability, setAwayProbability] = useState(25)

  const [blocks, setBlocks] = useState<PredictionBlock[]>([])
  const [blockTitle, setBlockTitle] = useState('')
  const [blockText, setBlockText] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [homeTeamSearch, setHomeTeamSearch] = useState('')
  const [awayTeamSearch, setAwayTeamSearch] = useState('')

  const totalProbability =
    homeProbability + drawProbability + awayProbability

  useEffect(() => {
    const controller = new AbortController()

    getCompetitions(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setCompetitions(data)
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error(error)
        alert('Error cargando competiciones')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  async function handleCompetitionChange(id: string) {
    setCompetitionId(id)
    setHomeTeamId('')
    setAwayTeamId('')
    setHomeTeamSearch('')
    setAwayTeamSearch('')
    setTeams([])

    if (!id) return

    try {
      const data = await getTeamsByCompetition(id)

      setTeams(data)
    } catch (error) {
      console.error(error)
      alert('Error cargando equipos')
    }
  }

  function parseBlockText(text: string) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(':')

        if (separatorIndex === -1) return null

        const label = line.slice(0, separatorIndex).trim()
        const value = line.slice(separatorIndex + 1).trim()

        if (!label || !value) return null

        return {
          label,
          value
        }
      })
      .filter(isPredictionBlockItem)
  }

  function addBlock() {
    if (!blockTitle.trim()) {
      alert('Completá el título del bloque')
      return
    }

    const parsedItems = parseBlockText(blockText)

    if (parsedItems.length === 0) {
      alert('Pegá datos con el formato: Goles: 2.8')
      return
    }

    setBlocks([
      ...blocks,
      {
        title: blockTitle.trim(),
        items: parsedItems
      }
    ])

    setBlockTitle('')
    setBlockText('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!competitionId) {
      alert('Seleccioná una competición')
      return
    }

    if (!homeTeamId || !awayTeamId) {
      alert('Seleccioná los dos equipos')
      return
    }

    if (homeTeamId === awayTeamId) {
      alert('El equipo local y visitante no pueden ser el mismo')
      return
    }

    if (!date) {
      alert('Seleccioná una fecha')
      return
    }

    if (
      homeProbability < 0 ||
      drawProbability < 0 ||
      awayProbability < 0 ||
      homeProbability > 100 ||
      drawProbability > 100 ||
      awayProbability > 100
    ) {
      alert('Las probabilidades deben estar entre 0 y 100')
      return
    }

    if (totalProbability !== 100) {
      alert('Las probabilidades deben sumar 100%')
      return
    }

    const competition = competitions.find(
      (item) => item._id === competitionId
    )

    const home = teams.find((team) => team._id === homeTeamId)
    const away = teams.find((team) => team._id === awayTeamId)

    if (!competition || !home || !away) {
      alert('Completá todos los campos')
      return
    }

    try {
      setSaving(true)

      await createPrediction({
        slug: slugify(`${home.name} vs ${away.name}`),

        competition: competition.name,
        competitionId,

        homeTeam: home.name,
        awayTeam: away.name,

        homeTeamId,
        awayTeamId,

        homeLogo: home.logo,
        awayLogo: away.logo,

        date,

        status: 'pending',
        finalScore: '',

        homeProbability,
        drawProbability,
        awayProbability,

        blocks
      })

      alert('Predicción creada')

      setCompetitionId('')
      setHomeTeamId('')
      setAwayTeamId('')
      setDate('')
      setTeams([])
      setBlocks([])
      setHomeTeamSearch('')
      setAwayTeamSearch('')
      setBlockTitle('')
      setBlockText('')
      setHomeProbability(50)
      setDrawProbability(25)
      setAwayProbability(25)
    } catch (error) {
      console.error(error)
      alert('Error creando predicción')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-form-page admin-form-page--wide">
        <h1>Crear predicción</h1>
        <p>Cargando formulario...</p>
      </div>
    )
  }

  return (
    <div className="admin-form-page admin-form-page--wide">
      <h1>Crear predicción</h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form admin-form--wide"
      >
        <section className="admin-form__section">
          <h2>Datos del partido</h2>

          <label>
            Competición
            <select
              value={competitionId}
              onChange={(e) =>
                handleCompetitionChange(e.target.value)
              }
            >
              <option value="">Seleccionar competición</option>

              {competitions.map((competition) => (
                <option
                  key={competition._id}
                  value={competition._id}
                >
                  {competition.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </section>

        <TeamSelector
          label="Equipo local"
          placeholder="Buscar equipo local. Ej: Argentina"
          value={homeTeamId}
          search={homeTeamSearch}
          teams={teams}
          disabled={!competitionId}
          onSearchChange={setHomeTeamSearch}
          onChange={setHomeTeamId}
        />

        <TeamSelector
          label="Equipo visitante"
          placeholder="Buscar equipo visitante. Ej: Brasil"
          value={awayTeamId}
          search={awayTeamSearch}
          teams={teams}
          disabled={!competitionId}
          onSearchChange={setAwayTeamSearch}
          onChange={setAwayTeamId}
        />

        <section className="admin-form__section">
          <h2>Probabilidades</h2>

          <input
            type="number"
            min="0"
            max="100"
            value={homeProbability}
            onChange={(e) =>
              setHomeProbability(Number(e.target.value))
            }
            placeholder="Probabilidad local"
          />

          <input
            type="number"
            min="0"
            max="100"
            value={drawProbability}
            onChange={(e) =>
              setDrawProbability(Number(e.target.value))
            }
            placeholder="Probabilidad empate"
          />

          <input
            type="number"
            min="0"
            max="100"
            value={awayProbability}
            onChange={(e) =>
              setAwayProbability(Number(e.target.value))
            }
            placeholder="Probabilidad visitante"
          />

          <p
            className={
              totalProbability === 100
                ? 'prediction-total prediction-total--ok'
                : 'prediction-total prediction-total--error'
            }
          >
            Total: {totalProbability}%
          </p>
        </section>

        <section className="admin-form__section">
          <h2>Bloques de datos</h2>

          <input
            placeholder="Título del bloque. Ej: Estadísticas esperadas"
            value={blockTitle}
            onChange={(e) => setBlockTitle(e.target.value)}
          />

          <textarea
            placeholder={`Pegá los datos así:

Goles: 2.8
Tiros totales: 24
Tiros a puerta: 10
Corners: 9
Tarjetas: 4
Penales: 0.25
Faltas: 24`}
            value={blockText}
            onChange={(e) => setBlockText(e.target.value)}
            rows={9}
          />

          <button type="button" onClick={addBlock}>
            Agregar bloque
          </button>

          <p>Bloques creados: {blocks.length}</p>

          {blocks.map((block, index) => (
            <div
              key={`${block.title}-${index}`}
              className="section-preview"
            >
              <h3>{block.title}</h3>

              {block.items.map((item, itemIndex) => (
                <p key={`${item.label}-${itemIndex}`}>
                  {item.label}: {item.value}
                </p>
              ))}

              <button
                type="button"
                onClick={() =>
                  setBlocks(
                    blocks.filter((_, i) => i !== index)
                  )
                }
              >
                Eliminar bloque
              </button>
            </div>
          ))}
        </section>

        <button type="submit" disabled={saving}>
          {saving ? 'Creando...' : 'Crear predicción'}
        </button>
      </form>
    </div>
  )
}