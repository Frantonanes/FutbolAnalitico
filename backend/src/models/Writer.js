const mongoose = require('mongoose')

const WriterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    image: {
      type: String,
      default: ''
    },

    role: {
      type: String,
      default: 'Redactor'
    },

    bio: {
      type: String,
      default: ''
    },

    twitter: {
      type: String,
      default: ''
    },

    instagram: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Writer', WriterSchema)