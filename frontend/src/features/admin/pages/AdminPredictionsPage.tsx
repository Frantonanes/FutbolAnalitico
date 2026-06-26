import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import './AdminNewsPage.css'

import {
  getPredictions,
  deletePrediction
} from '../../../services/predictionService'

import type {
  Prediction
} from '../../../shared/types/Prediction'

function normalizeText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function getDateValue(value?: string) {
  if (!value) return ''

  return new Date(value)
    .toISOString()
    .slice(0, 10)
}

export default function AdminPredictionsPage() {
  const [predictions, setPredictions] =
    useState<Prediction[]>([])

  const [loading, setLoading] = useState(true)

  const [teamSearch, setTeamSearch] = useState('')
  const [selectedCompetition, setSelectedCompetition] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getPredictions(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setPredictions(data)
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error(error)
        alert('Error cargando predicciones')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  async function loadPredictions() {
    try {
      setLoading(true)

      const data = await getPredictions()

      setPredictions(data)
    } catch (error) {
      console.error(error)
      alert('Error cargando predicciones')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm('¿Eliminar predicción?')

    if (!confirmDelete) return

    try {
      await deletePrediction(id)

      await loadPredictions()
    } catch (error) {
      console.error(error)
      alert('Error eliminando predicción')
    }
  }

  const competitionOptions = useMemo(() => {
    const competitions = predictions
      .map((prediction) => prediction.competition)
      .filter(Boolean)

    return Array.from(new Set(competitions))
      .sort((a, b) => a.localeCompare(b))
  }, [predictions])

  const filteredPredictions = useMemo(() => {
    const normalizedTeamSearch = normalizeText(teamSearch)
    const normalizedCompetition = normalizeText(selectedCompetition)

    return predictions.filter((prediction) => {
      const teamsText = normalizeText(
        `${prediction.homeTeam} ${prediction.awayTeam}`
      )

      const matchesTeam =
        !normalizedTeamSearch ||
        teamsText.includes(normalizedTeamSearch)

      const matchesCompetition =
        !normalizedCompetition ||
        normalizeText(prediction.competition) === normalizedCompetition

      const matchesDate =
        !selectedDate ||
        getDateValue(prediction.date) === selectedDate

      const matchesStatus =
        !selectedStatus ||
        prediction.status === selectedStatus

      return (
        matchesTeam &&
        matchesCompetition &&
        matchesDate &&
        matchesStatus
      )
    })
  }, [
    predictions,
    teamSearch,
    selectedCompetition,
    selectedDate,
    selectedStatus
  ])

  const hasActiveFilters =
    teamSearch.trim() ||
    selectedCompetition ||
    selectedDate ||
    selectedStatus

  function clearFilters() {
    setTeamSearch('')
    setSelectedCompetition('')
    setSelectedDate('')
    setSelectedStatus('')
  }

  return (
    <div className="admin-news">
      <div className="admin-news-header">
        <div>
          <h1>Administrar predicciones</h1>

          <p>
            {filteredPredictions.length} de {predictions.length} predicciones
          </p>
        </div>

        <Link
          to="/admin/predicciones/crear"
          className="admin-news-create"
        >
          Nueva predicción
        </Link>
      </div>

      <section className="admin-news-filters">
        <input
          type="search"
          placeholder="Buscar por equipo"
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
        />

        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
        >
          <option value="">Todas las competiciones</option>

          {competitionOptions.map((competition) => (
            <option key={competition} value={competition}>
              {competition}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="finished">Finalizado</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </section>

      {loading && (
        <p className="admin-news-status">
          Cargando predicciones...
        </p>
      )}

      {!loading && predictions.length === 0 && (
        <p className="admin-news-status">
          No hay predicciones cargadas.
        </p>
      )}

      {!loading &&
        predictions.length > 0 &&
        filteredPredictions.length === 0 && (
          <p className="admin-news-status">
            No hay predicciones que coincidan con los filtros.
          </p>
        )}

      {!loading && filteredPredictions.length > 0 && (
        <div className="admin-news-table-wrap">
          <table className="admin-news-table">
            <thead>
              <tr>
                <th>Partido</th>
                <th>Competición</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredPredictions.map((prediction) => (
                <tr key={prediction._id}>
                  <td>
                    <strong>
                      {prediction.homeTeam} vs {prediction.awayTeam}
                    </strong>
                  </td>

                  <td>{prediction.competition || '-'}</td>

                  <td>
                    {prediction.date
                      ? new Date(prediction.date).toLocaleDateString('es-AR')
                      : '-'}
                  </td>

                  <td>
                    <div className="admin-news-tags">
                      <span>
                        {prediction.status === 'finished'
                          ? 'Finalizado'
                          : 'Pendiente'}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="admin-actions">
                      <Link
                        className="admin-edit"
                        to={`/admin/predicciones/editar/${prediction._id}`}
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="admin-delete"
                        onClick={() => handleDelete(prediction._id!)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}