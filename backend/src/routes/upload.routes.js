const express = require('express')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const cloudinary = require('../config/cloudinary')
const requireAuth = require('../middleware/auth.middleware')

const router = express.Router()

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'futbol-analitico',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
})

const upload = multer({ storage })

router.post(
  '/',
  requireAuth,
  upload.single('image'),
  (req, res) => {
    res.json({
      url: req.file.path,
      public_id:
        req.file.filename ||
        req.file.public_id
    })
  }
)

module.exports = router
