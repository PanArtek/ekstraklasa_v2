const express = require('express');
const { getTeams } = require('../controllers/team.controller');

const router = express.Router();

// GET /api/teams
router.get('/', getTeams);

module.exports = router;