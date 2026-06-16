import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import PredictionCard from '../../home/Prediction/PredictionCard'
import { getPredictions } from '../../../services/predictionService'
import type { Prediction } from '../../../shared/types/Prediction'

import './PredictionsPage.css'

export default function PredictionsPage() {
  const [predictions, setPredictions] =
    useState<Prediction[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPredictions()
  }, [])

  async function loadPredictions() {
    try {
      setLoading(true)

      const data = await getPredictions()

      setPredictions(data)
    } catch (error) {
      console.error(error)
      setError(
        'No se pudieron cargar las predicciones.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>
            Predicciones | Futbol Analítico
          </title>

          <meta
            name="description"
            content="Predicciones de fútbol, probabilidades y análisis de partidos importantes."
          />
        </Helmet>

        <main className="predictions-page">
          <div className="predictions-page__empty">
            Cargando predicciones...
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          Predicciones | Futbol Analítico
        </title>

        <meta
          name="description"
          content="Predicciones de fútbol, probabilidades, datos clave y análisis previo de los partidos más importantes."
        />

        <link
          rel="canonical"
          href="https://futbolanalitico.com/predicciones"
        />
      </Helmet>

      <main className="predictions-page">
        <section className="predictions-page__hero">
          <span>Futbol Analítico</span>

          <h1>Predicciones</h1>

          <p>
            Análisis, probabilidades y datos clave de los partidos más importantes.
          </p>

          <strong>
            {predictions.length} predicciones disponibles
          </strong>
        </section>

        {error ? (
          <div className="predictions-page__empty">
            {error}
          </div>
        ) : predictions.length > 0 ? (
          <section className="predictions-page__grid">
            {predictions.map((prediction) => (
              <PredictionCard
                key={prediction._id || prediction.slug}
                slug={prediction.slug}
                competition={prediction.competition}
                homeTeam={prediction.homeTeam}
                awayTeam={prediction.awayTeam}
                date={prediction.date}
                homeProbability={prediction.homeProbability}
                drawProbability={prediction.drawProbability}
                awayProbability={prediction.awayProbability}
                homeLogo={prediction.homeLogo}
                awayLogo={prediction.awayLogo}
                status={prediction.status}
                finalScore={prediction.finalScore}
              />
            ))}
          </section>
        ) : (
          <div className="predictions-page__empty">
            Todavía no hay predicciones publicadas.
          </div>
        )}
      </main>
    </>
  )
}