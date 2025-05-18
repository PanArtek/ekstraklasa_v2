const express = require('express');
const { 
  getAllMatches, 
  getMatchesByTeamId, 
  getMatchesByRound,
  getMatchesByMatchday,
  getMatchesByStadiumId,
  getMatchesByStatus,
  getMatchesByDateRange,
  getMatchesWithFilters
} = require('../controllers/match.controller');

const router = express.Router();

// GET /api/matches
router.get('/', getAllMatches);

// GET /api/matches/filters
router.get('/filters', getMatchesWithFilters);

// GET /api/matches/date-range
router.get('/date-range', getMatchesByDateRange);

// GET /api/matches/team/:teamId
router.get('/team/:teamId', getMatchesByTeamId);

// GET /api/matches/round/:round
router.get('/round/:round', getMatchesByRound);

// GET /api/matches/matchday/:matchday
router.get('/matchday/:matchday', getMatchesByMatchday);

// GET /api/matches/stadium/:stadiumId
router.get('/stadium/:stadiumId', getMatchesByStadiumId);

// GET /api/matches/status/:status
router.get('/status/:status', getMatchesByStatus);

module.exports = router;