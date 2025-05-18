const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchday: {
    type: Number,
    required: true
  },
  homeTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  awayTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  stadiumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stadium',
    required: true
  },
  homeGoals: {
    type: Number,
    required: true
  },
  awayGoals: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['zaplanowany', 'rozegrany', 'odwołany']
  },
  season: {
    type: String,
    required: true
  },
  round: {
    type: Number,
    required: true
  }
}, { collection: 'matches' });

module.exports = mongoose.model('Match', matchSchema, 'matches');