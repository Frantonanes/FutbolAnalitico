import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './PredictionSection.css'
import PredictionCard from './PredictionCard'

import { getPredictions } from '../../../services/predictionService'
import type { Prediction } from '../../../shared/types/Prediction'

export default function PredictionsSection() {
  const [predictions, setPredictions] =
    useState<Prediction[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPredictions()
  }, [])

  async function loadPredictions() {
    try {
      setLoading(true)

      const data = await getPredictions()

      setPredictions(data.slice(0, 6))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  if (predictions.length === 0) return null

  return (
    <section className="predictions-section">
      <div className="container">
        <div className="predictions-section__header">
          <div>
            <span>Pronósticos</span>

            <h2>
              Predicciones de la jornada
            </h2>
          </div>

          <Link
            to="/predicciones"
            className="predictions-section__link"
          >
            Ver todas
          </Link>
        </div>

        <div className="predictions-grid">
          {predictions.map((prediction) => (
            <PredictionCard
              key={prediction._id || prediction.slug}
              slug={prediction.slug}
              competition={prediction.competition}
              homeLogo={prediction.homeLogo}
              awayLogo={prediction.awayLogo}
              homeTeam={prediction.homeTeam}
              awayTeam={prediction.awayTeam}
              date={prediction.date}
              homeProbability={prediction.homeProbability}
              drawProbability={prediction.drawProbability}
              awayProbability={prediction.awayProbability}
              status={prediction.status}
              finalScore={prediction.finalScore}
            />
          ))}
        </div>
      </div>
    </section>
  )
}