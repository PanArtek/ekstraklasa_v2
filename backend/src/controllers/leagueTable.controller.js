const leagueTableService = require('../services/leagueTable.service');

/**
 * Pobiera aktualną tabelę ligową
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
const getLeagueTable = async (req, res) => {
  try {
    const { season, forceUpdate } = req.query;
    
    // Jeśli parametr forceUpdate=true, aktualizujemy statystyki drużyn w bazie danych
    if (forceUpdate === 'true') {
      const updatedTable = await leagueTableService.updateTeamStats(season);
      return res.status(200).json({
        message: 'Statystyki drużyn zostały zaktualizowane.',
        table: updatedTable
      });
    }
    
    // W przeciwnym razie generujemy tabelę bez aktualizacji w bazie danych
    const leagueTable = await leagueTableService.generateLeagueTable(season);
    res.status(200).json(leagueTable);
    
  } catch (error) {
    console.error('Error fetching league table:', error);
    res.status(500).json({ message: 'Error fetching league table' });
  }
};

/**
 * Resetuje statystyki wszystkich drużyn
 * @param {Object} req - Request object
 * @param {Object} res - Response object 
 * @returns {Promise<void>}
 */
const resetTeamStats = async (req, res) => {
  try {
    await leagueTableService.resetTeamStats();
    res.status(200).json({ message: 'Statystyki drużyn zostały zresetowane.' });
  } catch (error) {
    console.error('Error resetting team stats:', error);
    res.status(500).json({ message: 'Error resetting team stats' });
  }
};

module.exports = {
  getLeagueTable,
  resetTeamStats
};