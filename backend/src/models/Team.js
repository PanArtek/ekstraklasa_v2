const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  played: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  draws: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  goalsFor: {
    type: Number,
    default: 0
  },
  goalsAgainst: {
    type: Number,
    default: 0
  },
  goalDifference: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  }
}, { collection: 'teams' });

module.exports = mongoose.model('Team', teamSchema, 'teams');