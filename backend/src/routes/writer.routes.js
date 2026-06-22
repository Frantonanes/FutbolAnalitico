const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/auth.middleware')

const {
  getWriters,
  getWriterById,
  createWriter,
  updateWriter,
  deleteWriter
} = require('../controllers/writer.controller')

router.get('/', getWriters)
router.get('/:id', getWriterById)
router.post('/', requireAuth, createWriter)
router.put('/:id', requireAuth, updateWriter)
router.patch('/:id', requireAuth, updateWriter)
router.delete('/:id', requireAuth, deleteWriter)

module.exports = router
