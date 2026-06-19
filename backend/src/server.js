require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/database')
const News = require('./models/News')
const Prediction = require('./models/Prediction')
const authRoutes = require('./routes/auth.routes')
const newsRoutes = require('./routes/news.routes')
const predictionRoutes = require('./routes/prediction.routes')
const uploadRoutes = require('./routes/upload.routes')
const contentRoutes = require('./routes/content.routes')
const writerRoutes = require('./routes/writer.routes')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/news', newsRoutes)
app.use('/predictions', predictionRoutes)
app.use('/upload', uploadRoutes)
app.use('/content', contentRoutes)
app.use('/auth', authRoutes)
app.use('/writers', writerRoutes)
app.get('/', (req, res) => {
  res.json({
    message: 'API FutbolAnalitico'
  })
})
app.get('/sitemap.xml', async (req, res) => {
  const news = await News.find({}, 'slug')
  const predictions = await Prediction.find({}, 'slug')

  const baseUrl = 'https://futbolanalitico.com'

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/noticias`,
    `${baseUrl}/predicciones`,

    ...news.map(
      (item) => `${baseUrl}/noticias/${item.slug}`
    ),

    ...predictions.map(
      (item) => `${baseUrl}/predicciones/${item.slug}`
    )
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join('')}
</urlset>`

  res.header('Content-Type', 'application/xml')
  res.send(xml)
})
app.listen(3000, () => {
  console.log(
    'Servidor corriendo en puerto 3000'
  )
})