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

module.exports = {
  getAllMatches,
  getMatchesByTeamId,
  getMatchesByRound
};