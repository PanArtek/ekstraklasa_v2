const express = require('express');
const { 
  getAllMatches, 
  getMatchesByTeamId, 
  getMatchesByRound 
} = require('../controllers/match.controller');

const router = express.Router();

// GET /api/matches
router.get('/', getAllMatches);

// GET /api/matches/team/:teamId
router.get('/team/:teamId', getMatchesByTeamId);

// GET /api/matches/round/:round
router.get('/round/:round', getMatchesByRound);

module.exports = router;