import React from 'react';
import useTeams from '../hooks/useTeams';
import TeamTable from '../components/TeamTable';

const LeagueTablePage = () => {
  const { data: teams, isLoading, isError, error } = useTeams();

  if (isLoading) {
    return <div>Loading team data...</div>;
  }

  if (isError) {
    return <div>Error loading teams: {error?.message || 'Unknown error'}</div>;
  }

  return (
    <div className="league-table-page">
      <h2>Ekstraklasa League Table</h2>
      <TeamTable teams={teams} />
    </div>
  );
};

export default LeagueTablePage;