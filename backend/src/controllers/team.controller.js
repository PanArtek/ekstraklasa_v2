const Team = require('../models/Team');

// Get all teams sorted by points, goal difference, and goals for
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .sort({ points: -1, goalDifference: -1, goalsFor: -1 });
    
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

module.exports = {
  getTeams
};