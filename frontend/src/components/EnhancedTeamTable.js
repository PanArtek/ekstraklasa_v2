import React from 'react';

/**
 * Komponent wyświetlający rozszerzoną tabelę ligową
 */
const EnhancedTeamTable = ({ teams }) => {
  if (!teams || teams.length === 0) {
    return <div>No teams data available.</div>;
  }

  return (
    <div className="team-table-container">
      <table className="team-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr 
              key={team._id} 
              className={`table-row-${team.zone || 'mid'}`}
            >
              <td>{team.position}</td>
              <td>{team.name}</td>
              <td>{team.played}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
              <td>{team.goalsFor}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalDifference}</td>
              <td className="points-column">{team.points}</td>
              <td>{renderForm(team.form)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="team-table-legend">
        <div className="legend-item">
          <span className="legend-color top"></span>
          <span className="legend-text">European qualification</span>
        </div>
        <div className="legend-item">
          <span className="legend-color bottom"></span>
          <span className="legend-text">Relegation zone</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Renderuje formę drużyny jako wizualne elementy (W, D, L)
 * @param {Array} form - Tablica z wynikami ostatnich meczów
 * @returns {JSX.Element} Element JSX reprezentujący formę
 */
const renderForm = (form) => {
  if (!form || form.length === 0) {
    return <span className="no-form">-</span>;
  }

  return (
    <div className="team-form">
      {form.map((result, index) => {
        let resultClass = '';
        let resultText = '';
        
        switch (result) {
          case 'W':
            resultClass = 'win';
            resultText = 'W';
            break;
          case 'D':
            resultClass = 'draw';
            resultText = 'D';
            break;
          case 'L':
            resultClass = 'loss';
            resultText = 'L';
            break;
          default:
            resultClass = '';
            resultText = '-';
        }
        
        return (
          <span key={index} className={`form-result ${resultClass}`}>
            {resultText}
          </span>
        );
      })}
    </div>
  );
};

export default EnhancedTeamTable;