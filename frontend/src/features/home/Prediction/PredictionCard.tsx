import { Link } from 'react-router-dom'
import './PredictionCard.css'

type PredictionCardProps = {
  slug: string
  competition: string
  homeTeam: string
  awayTeam: string
  date: string
  homeProbability: number
  drawProbability: number
  awayProbability: number
  homeLogo?: string
  awayLogo?: string
  status?: 'pending' | 'finished'
  finalScore?: string
}

export default function PredictionCard({
  slug,
  competition,
  homeTeam,
  awayTeam,
  date,
  homeLogo,
  awayLogo,
  homeProbability,
  drawProbability,
  awayProbability,
  status = 'pending',
  finalScore = ''
}: PredictionCardProps) {
  const homeInitial =
    homeTeam?.charAt(0) || '?'

  const awayInitial =
    awayTeam?.charAt(0) || '?'

  const isFinished =
    status === 'finished'

  return (
    <Link
      to={`/predicciones/${slug}`}
      className="prediction-card"
    >
      <div className="prediction-card__top">
        <span className="prediction-card__competition">
          {competition}
        </span>

        {isFinished && (
          <span className="prediction-card__status">
            Finalizado
          </span>
        )}
      </div>

      <div className="prediction-card__header">
        <div className="team">
          <div className="team-logo">
            {homeLogo ? (
              <img
                src={homeLogo}
                alt={homeTeam}
              />
            ) : (
              homeInitial
            )}
          </div>

          <span>{homeTeam}</span>
        </div>

        <div className="match-date">
          <span>{date}</span>
          <strong>VS</strong>
        </div>

        <div className="team">
          <div className="team-logo">
            {awayLogo ? (
              <img
                src={awayLogo}
                alt={awayTeam}
              />
            ) : (
              awayInitial
            )}
          </div>

          <span>{awayTeam}</span>
        </div>
      </div>

      {isFinished ? (
        <div className="prediction-card__result">
          <span>Resultado final</span>

          <strong>
            {finalScore || 'Finalizado'}
          </strong>
        </div>
      ) : (
        <>
          <div className="prediction-card__bar">
            <div
              className="home-bar"
              style={{
                width: `${homeProbability}%`
              }}
            />

            <div
              className="draw-bar"
              style={{
                width: `${drawProbability}%`
              }}
            />

            <div
              className="away-bar"
              style={{
                width: `${awayProbability}%`
              }}
            />
          </div>

          <div className="prediction-card__percentages">
            <span>
              {homeProbability}% Local
            </span>

            <span>
              {drawProbability}% Empate
            </span>

            <span>
              {awayProbability}% Visitante
            </span>
          </div>
        </>
      )}

      <span className="prediction-card__button">
        {isFinished
          ? 'Ver resumen'
          : 'Ver análisis'}
      </span>
    </Link>
  )
}