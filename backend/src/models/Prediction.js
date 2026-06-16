const mongoose = require('mongoose')

const PredictionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true
    },

    competition: {
      type: String,
      required: true,
      trim: true
    },

    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition'
    },

    homeTeam: {
      type: String,
      required: true,
      trim: true
    },

    awayTeam: {
      type: String,
      required: true,
      trim: true
    },

    homeTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },

    awayTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },

    homeLogo: String,
    awayLogo: String,

    date: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'finished'],
      default: 'pending'
    },

    finalScore: {
      type: String,
      default: ''
    },

    homeProbability: {
      type: Number,
      required: true
    },

    drawProbability: {
      type: Number,
      required: true
    },

    awayProbability: {
      type: Number,
      required: true
    },

    blocks: [
      {
        title: String,
        items: [
          {
            label: String,
            value: String
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Prediction',
  PredictionSchema
)