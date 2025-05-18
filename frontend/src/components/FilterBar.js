import React from 'react';

const FilterBar = ({ teams, rounds, selectedTeam, selectedRound, onTeamChange, onRoundChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="teamFilter">Filter by Team:</label>
        <select
          id="teamFilter"
          value={selectedTeam || ''}
          onChange={(e) => onTeamChange(e.target.value || null)}
        >
          <option value="">All Teams</option>
          {teams && teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="roundFilter">Filter by Round:</label>
        <select
          id="roundFilter"
          value={selectedRound || ''}
          onChange={(e) => onRoundChange(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">All Rounds</option>
          {rounds && rounds.map((round) => (
            <option key={round} value={round}>
              Round {round}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;