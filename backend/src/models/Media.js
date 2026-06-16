const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    url: {
      type: String,
      required: true
    },

    public_id: String,

    hashtags: [String]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Media',
  MediaSchema
)