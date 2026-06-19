const News = require('../models/News')

exports.getNews = async (req, res) => {
  try {
    const news = await News.find()
  .populate('authorId')
  .sort({ createdAt: -1 })
    res.json(news)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.getNewsBySlug = async (req, res) => {
  try {
    const article = await News.findOne({
  slug: req.params.slug
}).populate('authorId')

    if (!article) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }

    res.json(article)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.createNews = async (req, res) => {
  try {
    const news = await News.create(req.body)
    res.status(201).json(news)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }

    res.json(news)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id)

    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }

    res.json({ message: 'Noticia eliminada' })
  } catch (error) {
    res.status(500).json(error)
  }
}
exports.getNewsById = async (req, res) => {
  try {
    const article = await News.findById(
  req.params.id
).populate('authorId')

    if (!article) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }

    res.json(article)
  } catch (error) {
    res.status(500).json(error)
  }
}