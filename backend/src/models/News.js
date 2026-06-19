const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema(
  {
    slug: String,

    title: String,
    subtitle: String,

    // LEGACY
    category: String,

    image: String,

    hashtags: [String],
    
    competition: String,

    teams: [String],
    authorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Writer',
  default: null
},
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },

    mediaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
      }
    ],

    featuredMediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },

    sections: [
      {
        type: {
          type: String
        },

        content: String,

        image: String,

        mediaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Media'
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'News',
  NewsSchema
)