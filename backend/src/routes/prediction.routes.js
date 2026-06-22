const express = require('express')
const requireAuth = require('../middleware/auth.middleware')

const router = express.Router()

const {
  getPredictions,
  getPredictionById,
  getPredictionBySlug,
  createPrediction,
  updatePrediction,
  deletePrediction
} = require('../controllers/prediction.controller')

router.get('/', getPredictions)

router.get('/id/:id', getPredictionById)

router.get('/:slug', getPredictionBySlug)

router.post('/', requireAuth, createPrediction)

router.put('/:id', requireAuth, updatePrediction)

router.patch('/:id', requireAuth, updatePrediction)

router.delete('/:id', requireAuth, deletePrediction)

module.exports = router
