const express = require('express');
const { getLeagueTable, resetTeamStats } = require('../controllers/leagueTable.controller');

const router = express.Router();

// GET /api/league-table
router.get('/', getLeagueTable);

// POST /api/league-table/reset
router.post('/reset', resetTeamStats);

module.exports = router;