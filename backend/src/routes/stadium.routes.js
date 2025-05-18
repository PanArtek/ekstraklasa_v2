const express = require('express');
const { getStadiums } = require('../controllers/stadium.controller');

const router = express.Router();

// GET /api/stadiums
router.get('/', getStadiums);

module.exports = router;