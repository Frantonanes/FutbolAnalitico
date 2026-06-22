const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth.middleware')

const {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getNewsById,
} = require('../controllers/news.controller')

router.get('/', getNews)
router.post('/', requireAuth, createNews)
router.put('/:id', requireAuth, updateNews)
router.patch('/:id', requireAuth, updateNews)
router.delete('/:id', requireAuth, deleteNews)
router.get('/id/:id', getNewsById)
router.get('/:slug', getNewsBySlug)
module.exports = router
