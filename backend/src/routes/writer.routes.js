const express = require('express')
const router = express.Router()

const {
  getWriters,
  getWriterById,
  createWriter,
  updateWriter,
  deleteWriter
} = require('../controllers/writer.controller')

router.get('/', getWriters)
router.get('/:id', getWriterById)
router.post('/', createWriter)
router.put('/:id', updateWriter)
router.delete('/:id', deleteWriter)

module.exports = router