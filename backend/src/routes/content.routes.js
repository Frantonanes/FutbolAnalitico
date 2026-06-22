const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth.middleware')

const {
  getCategories,
  createCategory,
  deleteCategory,

  getHashtags,
  createHashtag,
  deleteHashtag,

  getMedia,
  createMedia,
  searchMediaByHashtag,
  deleteMedia,

  getCompetitions,
  createCompetition,
  deleteCompetition,

  getTeams,
  getTeamsByCompetition,
  createTeam,
  deleteTeam
} = require('../controllers/content.controller')

/* Categories */
router.get('/categories', getCategories)
router.post('/categories', requireAuth, createCategory)
router.delete('/categories/:id', requireAuth, deleteCategory)

/* Hashtags */
router.get('/hashtags', getHashtags)
router.post('/hashtags', requireAuth, createHashtag)
router.delete('/hashtags/:id', requireAuth, deleteHashtag)

/* Media */
router.get('/media', getMedia)
router.post('/media', requireAuth, createMedia)
router.get('/media/search', searchMediaByHashtag)
router.delete('/media/:id', requireAuth, deleteMedia)

/* Competitions */
router.get('/competitions', getCompetitions)
router.post('/competitions', requireAuth, createCompetition)
router.delete('/competitions/:id', requireAuth, deleteCompetition)

/* Teams */
router.get('/teams', getTeams)
router.get(
  '/teams/competition/:competitionId',
  getTeamsByCompetition
)
router.post('/teams', requireAuth, createTeam)
router.delete('/teams/:id', requireAuth, deleteTeam)

module.exports = router
