import { useEffect, useState } from 'react'
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

export default function CreatePredictionPage() {
  const [competitions, setCompetitions] =
    useState<Competition[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  const [competitionId, setCompetitionId] = useState('')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [date, setDate] = useState('')

  const [homeProbability, setHomeProbability] =
    useState(50)
  const [drawProbability, setDrawProbability] =
    useState(25)
  const [awayProbability, setAwayProbability] =
    useState(25)

  const [blocks, setBlocks] =
    useState<PredictionBlock[]>([])

  const [blockTitle, setBlockTitle] = useState('')
  const [blockText, setBlockText] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [homeTeamSearch, setHomeTeamSearch] = useState('')
  const [awayTeamSearch, setAwayTeamSearch] = useState('')

  const homeTeam = teams.find(
    (team) => team._id === homeTeamId
  )

  const awayTeam = teams.find(
    (team) => team._id === awayTeamId
  )

  const filteredHomeTeams = teams.filter((team) =>
  team.name
    .toLowerCase()
    .includes(homeTeamSearch.toLowerCase())
)

const filteredAwayTeams = teams.filter((team) =>
  team.name
    .toLowerCase()
    .includes(awayTeamSearch.toLowerCase())
)

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

        if (separatorIndex === -1) {
          return null
        }

        const label = line
          .slice(0, separatorIndex)
          .trim()

        const value = line
          .slice(separatorIndex + 1)
          .trim()

        if (!label || !value) {
          return null
        }

        return {
          label,
          value
        }
      })
      .filter((item) => item !== null)
  }

  function addBlock() {
    if (!blockTitle.trim()) {
      alert('Completá el título del bloque')
      return
    }

    const parsedItems = parseBlockText(blockText)

    if (parsedItems.length === 0) {
      alert(
        'Pegá datos con el formato: Goles: 2.8'
      )
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

    const total =
      homeProbability +
      drawProbability +
      awayProbability

    if (!competitionId) {
      alert('Seleccioná una competición')
      return
    }

    if (!homeTeamId || !awayTeamId) {
      alert('Seleccioná los dos equipos')
      return
    }

    if (homeTeamId === awayTeamId) {
      alert(
        'El equipo local y visitante no pueden ser el mismo'
      )
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
      alert(
        'Las probabilidades deben estar entre 0 y 100'
      )
      return
    }

    if (total !== 100) {
      alert('Las probabilidades deben sumar 100%')
      return
    }

    const competition = competitions.find(
      (item) => item._id === competitionId
    )

    const home = teams.find(
      (team) => team._id === homeTeamId
    )

    const away = teams.find(
      (team) => team._id === awayTeamId
    )

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
      <div className="admin-form-page">
        <h1>Crear predicción</h1>
        <p>Cargando formulario...</p>
      </div>
    )
  }

  return (
    <div className="admin-form-page">
      <h1>Crear predicción</h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <label>
          Competición
          <select
            value={competitionId}
            onChange={(e) =>
              handleCompetitionChange(e.target.value)
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
        </label>

        <label>
          Fecha
          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />
        </label>

        <label>
  Buscar equipo local
  <input
    placeholder="Ej: Argentina"
    value={homeTeamSearch}
    onChange={(e) =>
      setHomeTeamSearch(e.target.value)
    }
    disabled={!competitionId}
  />
</label>

<label>
  Equipo local
  <select
    value={homeTeamId}
    onChange={(e) =>
      setHomeTeamId(e.target.value)
    }
    disabled={!competitionId}
  >
    <option value="">
      Seleccionar equipo
    </option>

    {filteredHomeTeams.map((team) => (
      <option
        key={team._id}
        value={team._id}
      >
        {team.name}
      </option>
    ))}
  </select>
</label>

        {homeTeam?.logo && (
          <img
            src={homeTeam.logo}
            alt={homeTeam.name}
            className="competition-logo-preview"
          />
        )}

<label>
  Buscar equipo visitante
  <input
    placeholder="Ej: Brasil"
    value={awayTeamSearch}
    onChange={(e) =>
      setAwayTeamSearch(e.target.value)
    }
    disabled={!competitionId}
  />
</label>

<label>
  Equipo visitante
  <select
    value={awayTeamId}
    onChange={(e) =>
      setAwayTeamId(e.target.value)
    }
    disabled={!competitionId}
  >
    <option value="">
      Seleccionar equipo
    </option>

    {filteredAwayTeams.map((team) => (
      <option
        key={team._id}
        value={team._id}
      >
        {team.name}
      </option>
    ))}
  </select>
</label>

        {awayTeam?.logo && (
          <img
            src={awayTeam.logo}
            alt={awayTeam.name}
            className="competition-logo-preview"
          />
        )}

        <h2>Probabilidades</h2>

        <input
          type="number"
          min="0"
          max="100"
          value={homeProbability}
          onChange={(e) =>
            setHomeProbability(
              Number(e.target.value)
            )
          }
          placeholder="Probabilidad local"
        />

        <input
          type="number"
          min="0"
          max="100"
          value={drawProbability}
          onChange={(e) =>
            setDrawProbability(
              Number(e.target.value)
            )
          }
          placeholder="Probabilidad empate"
        />

        <input
          type="number"
          min="0"
          max="100"
          value={awayProbability}
          onChange={(e) =>
            setAwayProbability(
              Number(e.target.value)
            )
          }
          placeholder="Probabilidad visitante"
        />

        <p>
          Total:{' '}
          {homeProbability +
            drawProbability +
            awayProbability}
          %
        </p>

        <h2>Bloques de datos</h2>

        <input
          placeholder="Título del bloque. Ej: Estadísticas esperadas"
          value={blockTitle}
          onChange={(e) =>
            setBlockTitle(e.target.value)
          }
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
          onChange={(e) =>
            setBlockText(e.target.value)
          }
          rows={9}
        />

        <button
          type="button"
          onClick={addBlock}
        >
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
                  blocks.filter(
                    (_, i) => i !== index
                  )
                )
              }
            >
              Eliminar bloque
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Creando...'
            : 'Crear predicción'}
        </button>
      </form>
    </div>
  )
}
