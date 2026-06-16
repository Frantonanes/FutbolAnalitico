import { useEffect, useState } from 'react'

import { getNews } from '../../../services/newsService'
import { getPredictions } from '../../../services/predictionService'
import './DashboardPage.css'

export default function DashboardPage() {
  const [newsCount, setNewsCount] = useState(0)
  const [predictionsCount, setPredictionsCount] = useState(0)

  const [latestNews, setLatestNews] = useState('')
  const [latestPrediction, setLatestPrediction] =
    useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const news = await getNews()
      const predictions =
        await getPredictions()

      setNewsCount(news.length)
      setPredictionsCount(
        predictions.length
      )

      if (news.length > 0) {
        setLatestNews(
          news[0].title
        )
      }

      if (predictions.length > 0) {
        const last =
          predictions[0]

        setLatestPrediction(
          `${last.homeTeam} vs ${last.awayTeam}`
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h2>Total Noticias</h2>
          <span>{newsCount}</span>
        </div>

        <div className="dashboard-card">
          <h2>Total Predicciones</h2>
          <span>{predictionsCount}</span>
        </div>

      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h2>Última noticia</h2>
          <p>{latestNews || 'Sin noticias'}</p>
        </div>

        <div className="dashboard-card">
          <h2>Última predicción</h2>
          <p>
            {latestPrediction ||
              'Sin predicciones'}
          </p>
        </div>

      </div>

    </div>
  )
}