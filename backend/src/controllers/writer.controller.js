const Writer = require('../models/Writer')
const News = require('../models/News')

exports.getWriters = async (req, res) => {
  try {
    const writers = await Writer.find().sort({ name: 1 })
    res.json(writers)
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo escritores'
    })
  }
}

exports.getWriterById = async (req, res) => {
  try {
    const writer = await Writer.findById(req.params.id)

    if (!writer) {
      return res.status(404).json({
        message: 'Escritor no encontrado'
      })
    }

    res.json(writer)
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo el escritor'
    })
  }
}

exports.createWriter = async (req, res) => {
  try {
    const writer = await Writer.create(req.body)
    res.status(201).json(writer)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un escritor con ese slug'
      })
    }

    res.status(500).json({
      message: 'Error creando el escritor'
    })
  }
}

exports.updateWriter = async (req, res) => {
  try {
    const writer = await Writer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!writer) {
      return res.status(404).json({
        message: 'Escritor no encontrado'
      })
    }

    res.json(writer)
  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando el escritor'
    })
  }
}

exports.deleteWriter = async (req, res) => {
  try {
    const hasNews = await News.exists({
      authorId: req.params.id
    })

    if (hasNews) {
      return res.status(400).json({
        message:
          'No se puede eliminar porque tiene noticias asociadas'
      })
    }

    const writer = await Writer.findByIdAndDelete(req.params.id)

    if (!writer) {
      return res.status(404).json({
        message: 'Escritor no encontrado'
      })
    }

    res.json({
      message: 'Escritor eliminado'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error eliminando el escritor'
    })
  }
}