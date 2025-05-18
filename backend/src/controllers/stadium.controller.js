const Stadium = require('../models/Stadium');

// Get all stadiums
const getStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find();
    
    res.status(200).json(stadiums);
  } catch (error) {
    console.error('Error fetching stadiums:', error);
    res.status(500).json({ message: 'Error fetching stadiums' });
  }
};

module.exports = {
  getStadiums
};