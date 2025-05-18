const Match = require('../models/Match');

// Get all matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

// Get matches by team ID
const getMatchesByTeamId = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    
    const matches = await Match.find({
      $or: [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ]
    })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by team ID:', error);
    res.status(500).json({ message: 'Error fetching matches by team ID' });
  }
};

// Get matches by round
const getMatchesByRound = async (req, res) => {
  try {
    const round = req.params.round;
    
    const matches = await Match.find({ round })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by round:', error);
    res.status(500).json({ message: 'Error fetching matches by round' });
  }
};

// Get matches by matchday
const getMatchesByMatchday = async (req, res) => {
  try {
    const matchday = req.params.matchday;
    
    const matches = await Match.find({ matchday })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by matchday:', error);
    res.status(500).json({ message: 'Error fetching matches by matchday' });
  }
};

// Get matches by stadium ID
const getMatchesByStadiumId = async (req, res) => {
  try {
    const stadiumId = req.params.stadiumId;
    
    const matches = await Match.find({ stadiumId })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by stadium ID:', error);
    res.status(500).json({ message: 'Error fetching matches by stadium ID' });
  }
};

// Get matches by status
const getMatchesByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    
    const matches = await Match.find({ status })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by status:', error);
    res.status(500).json({ message: 'Error fetching matches by status' });
  }
};

// Get matches by date range
const getMatchesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required' });
    }
    
    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    const matches = await Match.find(dateFilter)
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by date range:', error);
    res.status(500).json({ message: 'Error fetching matches by date range' });
  }
};

// Get matches with combined filters
const getMatchesWithFilters = async (req, res) => {
  try {
    const {
      teamId,
      round,
      matchday,
      stadiumId,
      status,
      startDate,
      endDate
    } = req.query;
    
    // Build filter object based on provided parameters
    const filter = {};
    
    if (teamId) {
      filter.$or = [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ];
    }
    
    if (round) {
      filter.round = parseInt(round);
    }
    
    if (matchday) {
      filter.matchday = parseInt(matchday);
    }
    
    if (stadiumId) {
      filter.stadiumId = stadiumId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const matches = await Match.find(filter)
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches with filters:', error);
    res.status(500).json({ message: 'Error fetching matches with filters' });
  }
};

module.exports = {
  getAllMatches,
  getMatchesByTeamId,
  getMatchesByRound,
  getMatchesByMatchday,
  getMatchesByStadiumId,
  getMatchesByStatus,
  getMatchesByDateRange,
  getMatchesWithFilters
};