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
  awayProbability
}: PredictionCardProps) {
  const homeInitial =
    homeTeam?.charAt(0) || '?'

  const awayInitial =
    awayTeam?.charAt(0) || '?'

  return (
    <Link
      to={`/predicciones/${slug}`}
      className="prediction-card"
    >
      <span className="prediction-card__competition">
        {competition}
      </span>

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

      <span className="prediction-card__button">
        Ver análisis
      </span>
    </Link>
  )
}