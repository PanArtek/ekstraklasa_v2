import React from 'react';

const MatchList = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <div>No matches data available.</div>;
  }

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="match-list-container">
      <table className="match-list">
        <thead>
          <tr>
            <th>Matchday</th>
            <th>Round</th>
            <th>Date</th>
            <th>Home Team</th>
            <th>Score</th>
            <th>Away Team</th>
            <th>Stadium</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match._id}>
              <td>{match.matchday}</td>
              <td>{match.round}</td>
              <td>{formatDate(match.date)}</td>
              <td>{match.homeTeamId.name}</td>
              <td>{match.homeGoals} - {match.awayGoals}</td>
              <td>{match.awayTeamId.name}</td>
              <td>{match.stadiumId.name}</td>
              <td>{match.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchList;