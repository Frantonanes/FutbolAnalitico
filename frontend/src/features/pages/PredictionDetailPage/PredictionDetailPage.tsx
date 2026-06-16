import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Prediction } from '../../../shared/types/Prediction'
import { Helmet } from 'react-helmet-async'
import { getPredictionBySlug } from '../../../services/predictionService'

import './PredictionDetailPage.css'

export default function PredictionDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [prediction, setPrediction] =
    useState<Prediction | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    getPredictionBySlug(slug)
      .then((data) => {
        setPrediction(data)
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <h1 className="prediction-detail__status">
        Cargando...
      </h1>
    )
  }

  if (!prediction) {
    return (
      <h1 className="prediction-detail__status">
        Predicción no encontrada
      </h1>
    )
  }

  const isFinished =
    prediction.status === 'finished'

  const title = isFinished
    ? `${prediction.homeTeam} vs ${prediction.awayTeam}: resultado final`
    : `${prediction.homeTeam} vs ${prediction.awayTeam}: predicción y análisis`

  const description = isFinished
    ? `Resultado final de ${prediction.homeTeam} vs ${prediction.awayTeam}: ${prediction.finalScore}.`
    : `Predicción de ${prediction.homeTeam} vs ${prediction.awayTeam}: probabilidades, datos del partido y análisis previo.`

  return (
    <>
      <Helmet>
        <title>
          {title} | Futbol Analítico
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:type"
          content="article"
        />

        <link
          rel="canonical"
          href={`https://futbolanalitico.com/predicciones/${prediction.slug}`}
        />
      </Helmet>

      <article className="prediction-detail">
        <button
          type="button"
          className="prediction-detail__back"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <header className="prediction-detail__header">
          <div className="prediction-detail__meta">
            <span className="competition">
              {prediction.competition}
            </span>

            {isFinished && (
              <span className="prediction-detail__finished-badge">
                Partido finalizado
              </span>
            )}
          </div>

          <h1 className="prediction-detail__title">
            {prediction.homeTeam} vs {prediction.awayTeam}
          </h1>

          <p className="date">
            {prediction.date}
          </p>

          <div className="prediction-detail__teams">
            <div className="prediction-detail__team">
              {prediction.homeLogo && (
                <img
                  src={prediction.homeLogo}
                  alt={prediction.homeTeam}
                />
              )}

              <span>{prediction.homeTeam}</span>
            </div>

            <strong>vs</strong>

            <div className="prediction-detail__team">
              {prediction.awayLogo && (
                <img
                  src={prediction.awayLogo}
                  alt={prediction.awayTeam}
                />
              )}

              <span>{prediction.awayTeam}</span>
            </div>
          </div>
        </header>

        {isFinished ? (
          <section className="prediction-detail__result">
            <span>Resultado final</span>

            <strong>
              {prediction.finalScore}
            </strong>
          </section>
        ) : (
          <section className="prediction-detail__summary">
            <div className="prediction-detail__probabilities">
              <div>
                <span>Local</span>
                <strong>
                  {prediction.homeProbability}%
                </strong>
              </div>

              <div>
                <span>Empate</span>
                <strong>
                  {prediction.drawProbability}%
                </strong>
              </div>

              <div>
                <span>Visitante</span>
                <strong>
                  {prediction.awayProbability}%
                </strong>
              </div>
            </div>

            <div className="prediction-detail__probability-bar">
              <div
                className="prediction-detail__bar-home"
                style={{
                  width: `${prediction.homeProbability}%`
                }}
              />

              <div
                className="prediction-detail__bar-draw"
                style={{
                  width: `${prediction.drawProbability}%`
                }}
              />

              <div
                className="prediction-detail__bar-away"
                style={{
                  width: `${prediction.awayProbability}%`
                }}
              />
            </div>
          </section>
        )}

        {!isFinished && (
  <section className="prediction-detail__blocks">
    {(prediction.blocks || []).length === 0 ? (
      <p>
        No hay datos analíticos cargados para este partido.
      </p>
    ) : (
      prediction.blocks.map((block, index) => (
        <div
          key={`${block.title}-${index}`}
          className="block"
        >
          <h3>{block.title}</h3>

          <div className="block-data-list">
            {(block.items || []).map(
              (item, itemIndex) => (
                <div
                  key={`${item.label}-${itemIndex}`}
                  className="block-data-item"
                >
                  <span>{item.label}</span>

                  <strong>
                    {item.value}
                  </strong>
                </div>
              )
            )}
          </div>
        </div>
      ))
    )}
  </section>
)}
      </article>
    </>
  )
}