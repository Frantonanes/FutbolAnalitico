const Category = require('../models/Category')
const Hashtag = require('../models/Hashtag')
const Media = require('../models/Media')
const Competition = require('../models/Competition')
const Team = require('../models/Team')

/* ==========================
   CATEGORIES
========================== */

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      message: 'Categoría eliminada'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

/* ==========================
   HASHTAGS
========================== */

exports.getHashtags = async (req, res) => {
  try {
    const hashtags = await Hashtag.find().sort({ name: 1 })
    res.json(hashtags)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.createHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.create(req.body)
    res.status(201).json(hashtag)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findByIdAndDelete(req.params.id)

    if (!hashtag) {
      return res.status(404).json({
        message: 'Hashtag no encontrado'
      })
    }

    res.json({
      message: 'Hashtag eliminado'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

/* ==========================
   MEDIA
========================== */

exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({
      createdAt: -1
    })

    res.json(media)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.createMedia = async (req, res) => {
  try {
    const { name, url, public_id, hashtags } = req.body

    if (!name || !url) {
      return res.status(400).json({
        message: 'Nombre e imagen son obligatorios'
      })
    }

    const media = await Media.create({
      name,
      url,
      public_id,
      hashtags
    })

    res.status(201).json(media)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.searchMediaByHashtag = async (req, res) => {
  try {
    const search = String(req.query.hashtag || '')
      .replace('#', '')
      .trim()

    if (!search) {
      const media = await Media.find().sort({
        createdAt: -1
      })

      return res.json(media)
    }

    const media = await Media.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          hashtags: {
            $in: [search, `#${search}`]
          }
        }
      ]
    }).sort({
      createdAt: -1
    })

    res.json(media)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id)

    if (!media) {
      return res.status(404).json({
        message: 'Imagen no encontrada'
      })
    }

    res.json({
      message: 'Imagen eliminada'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}
/* ==========================
   COMPETITIONS
========================== */

exports.getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find()
      .sort({ name: 1 })

    res.json(competitions)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.createCompetition = async (req, res) => {
  try {
    const competition = await Competition.create(req.body)

    res.status(201).json(competition)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteCompetition = async (req, res) => {
  try {
    const competition =
      await Competition.findByIdAndDelete(
        req.params.id
      )

    if (!competition) {
      return res.status(404).json({
        message: 'Competición no encontrada'
      })
    }

    res.json({
      message: 'Competición eliminada'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

/* ==========================
   TEAMS
========================== */

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .sort({ name: 1 })

    res.json(teams)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.getTeamsByCompetition = async (
  req,
  res
) => {
  try {
    const teams = await Team.find({
      competitionId: req.params.competitionId
    }).sort({ name: 1 })

    res.json(teams)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body)

    res.status(201).json(team)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(
      req.params.id
    )

    if (!team) {
      return res.status(404).json({
        message: 'Equipo no encontrado'
      })
    }

    res.json({
      message: 'Equipo eliminado'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}