const Team = require('../models/Team');
const Match = require('../models/Match');

/**
 * Generuje tabelę ligową na podstawie meczów
 * @param {string} season - Sezon dla którego generowana jest tabela (np. '2024/2025')
 * @returns {Promise<Array>} - Posortowana tabela ligowa
 */
const generateLeagueTable = async (season) => {
  try {
    // Pobranie wszystkich drużyn
    const teams = await Team.find({}).lean();
    
    // Utworzenie mapy drużyn dla szybkiego dostępu
    const teamsMap = teams.reduce((map, team) => {
      // Inicjalizacja statystyk
      map[team._id.toString()] = {
        ...team,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [], // Ostatnie 5 meczów (W, R, P)
        headToHead: {} // Bezpośrednie mecze z innymi drużynami
      };
      return map;
    }, {});
    
    // Pobranie wszystkich rozegranych meczów z danego sezonu
    const matches = await Match.find({
      status: 'rozegrany',
      ...(season ? { season } : {})
    }).sort({ date: 1 }).lean();
    
    // Obliczanie statystyk na podstawie meczów
    matches.forEach(match => {
      const homeTeamId = match.homeTeamId.toString();
      const awayTeamId = match.awayTeamId.toString();
      
      // Sprawdzamy, czy drużyny istnieją w mapie
      if (!teamsMap[homeTeamId] || !teamsMap[awayTeamId]) {
        console.warn(`Pominięto mecz, brak drużyn w bazie: ${homeTeamId} vs ${awayTeamId}`);
        return;
      }
      
      const homeTeam = teamsMap[homeTeamId];
      const awayTeam = teamsMap[awayTeamId];
      
      // Zwiększenie liczby rozegranych meczów
      homeTeam.played += 1;
      awayTeam.played += 1;
      
      // Aktualizacja goli
      homeTeam.goalsFor += match.homeGoals;
      homeTeam.goalsAgainst += match.awayGoals;
      awayTeam.goalsFor += match.awayGoals;
      awayTeam.goalsAgainst += match.homeGoals;
      
      // Określenie wyniku meczu i aktualizacja statystyk
      let homeResult, awayResult;
      
      if (match.homeGoals > match.awayGoals) {
        // Wygrana gospodarzy
        homeTeam.wins += 1;
        homeTeam.points += 3;
        awayTeam.losses += 1;
        homeResult = 'W';
        awayResult = 'L';
      } else if (match.homeGoals < match.awayGoals) {
        // Wygrana gości
        homeTeam.losses += 1;
        awayTeam.wins += 1;
        awayTeam.points += 3;
        homeResult = 'L';
        awayResult = 'W';
      } else {
        // Remis
        homeTeam.draws += 1;
        homeTeam.points += 1;
        awayTeam.draws += 1;
        awayTeam.points += 1;
        homeResult = 'D';
        awayResult = 'D';
      }
      
      // Aktualizacja formy (ograniczone do ostatnich 5 meczów)
      homeTeam.form = [homeResult, ...homeTeam.form.slice(0, 4)];
      awayTeam.form = [awayResult, ...awayTeam.form.slice(0, 4)];
      
      // Aktualizacja statystyk head-to-head
      if (!homeTeam.headToHead[awayTeamId]) {
        homeTeam.headToHead[awayTeamId] = { played: 0, wins: 0, draws: 0, losses: 0 };
      }
      if (!awayTeam.headToHead[homeTeamId]) {
        awayTeam.headToHead[homeTeamId] = { played: 0, wins: 0, draws: 0, losses: 0 };
      }
      
      homeTeam.headToHead[awayTeamId].played += 1;
      awayTeam.headToHead[homeTeamId].played += 1;
      
      if (match.homeGoals > match.awayGoals) {
        homeTeam.headToHead[awayTeamId].wins += 1;
        awayTeam.headToHead[homeTeamId].losses += 1;
      } else if (match.homeGoals < match.awayGoals) {
        homeTeam.headToHead[awayTeamId].losses += 1;
        awayTeam.headToHead[homeTeamId].wins += 1;
      } else {
        homeTeam.headToHead[awayTeamId].draws += 1;
        awayTeam.headToHead[homeTeamId].draws += 1;
      }
    });
    
    // Obliczanie różnicy bramek
    Object.values(teamsMap).forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
    });
    
    // Konwersja mapy na tablicę i sortowanie
    const tableArray = Object.values(teamsMap);
    
    // Sortowanie tabeli
    tableArray.sort((a, b) => {
      // Główne kryteria sortowania: punkty (malejąco)
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      
      // Drugie kryterium: różnica bramek (malejąco)
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      
      // Trzecie kryterium: bramki zdobyte (malejąco)
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      
      // Ostatnie kryterium: nazwa drużyny (alfabetycznie)
      return a.name.localeCompare(b.name);
    });
    
    // Dodanie pozycji w tabeli
    const tableWithPositions = tableArray.map((team, index) => ({
      ...team,
      position: index + 1,
      zone: getTeamZone(index, tableArray.length)
    }));
    
    return tableWithPositions;
  } catch (error) {
    console.error('Error generating league table:', error);
    throw error;
  }
};

/**
 * Określa strefę drużyny w tabeli (górna, środkowa, spadkowa)
 * @param {number} position - Pozycja drużyny w tabeli (indeks, 0-based)
 * @param {number} totalTeams - Liczba wszystkich drużyn
 * @returns {string} - Oznaczenie strefy ('top', 'mid', 'bottom')
 */
const getTeamZone = (position, totalTeams) => {
  // 3 najlepsze drużyny
  if (position < 3) {
    return 'top';
  }
  
  // 3 ostatnie drużyny
  if (position >= totalTeams - 3) {
    return 'bottom';
  }
  
  // Pozostałe drużyny
  return 'mid';
};

/**
 * Resetuje statystyki wszystkich drużyn do zera
 * @returns {Promise<void>}
 */
const resetTeamStats = async () => {
  try {
    await Team.updateMany({}, {
      $set: {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }
    });
    
    console.log("Wszystkie statystyki drużyn zostały zresetowane.");
  } catch (error) {
    console.error('Error resetting team stats:', error);
    throw error;
  }
};

/**
 * Aktualizuje statystyki drużyn w bazie danych na podstawie aktualnych meczów
 * @param {string} season - Sezon dla którego aktualizowane są statystyki
 * @returns {Promise<void>}
 */
const updateTeamStats = async (season) => {
  try {
    // Najpierw resetujemy wszystkie statystyki
    await resetTeamStats();
    
    // Generujemy tabelę
    const leagueTable = await generateLeagueTable(season);
    
    // Aktualizujemy każdą drużynę w bazie danych
    const updatePromises = leagueTable.map(team => {
      return Team.updateOne(
        { _id: team._id },
        {
          $set: {
            played: team.played,
            wins: team.wins,
            draws: team.draws,
            losses: team.losses,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference,
            points: team.points
          }
        }
      );
    });
    
    await Promise.all(updatePromises);
    console.log(`Zaktualizowano statystyki ${updatePromises.length} drużyn.`);
    
    return leagueTable;
  } catch (error) {
    console.error('Error updating team stats:', error);
    throw error;
  }
};

module.exports = {
  generateLeagueTable,
  updateTeamStats,
  resetTeamStats
};