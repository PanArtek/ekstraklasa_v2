import React, { useState, useMemo } from 'react';
import { useAllMatches, useMatchesByTeam, useMatchesByRound } from '../hooks/useMatches';
import useTeams from '../hooks/useTeams';
import MatchList from '../components/MatchList';
import FilterBar from '../components/FilterBar';

const MatchesPage = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);

  // Fetch teams for the filter dropdown
  const { data: teams } = useTeams();

  // Fetch matches based on filter selections
  const { data: allMatches, isLoading: isLoadingAll } = useAllMatches();
  const { data: teamMatches, isLoading: isLoadingTeam } = useMatchesByTeam(selectedTeam);
  const { data: roundMatches, isLoading: isLoadingRound } = useMatchesByRound(selectedRound);

  // Determine which matches to display based on filters
  const displayMatches = useMemo(() => {
    if (selectedTeam) return teamMatches;
    if (selectedRound) return roundMatches;
    return allMatches;
  }, [selectedTeam, selectedRound, allMatches, teamMatches, roundMatches]);

  // Calculate available rounds for filter dropdown
  const availableRounds = useMemo(() => {
    if (!allMatches) return [];
    
    const rounds = [...new Set(allMatches.map(match => match.round))];
    return rounds.sort((a, b) => a - b);
  }, [allMatches]);

  // Loading state
  const isLoading = isLoadingAll || isLoadingTeam || isLoadingRound;
  if (isLoading) {
    return <div>Loading match data...</div>;
  }

  // Handle filter changes
  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    setSelectedRound(null); // Reset round filter when team filter changes
  };

  const handleRoundChange = (round) => {
    setSelectedRound(round);
    setSelectedTeam(null); // Reset team filter when round filter changes
  };

  return (
    <div className="matches-page">
      <h2>Ekstraklasa Matches</h2>
      
      <FilterBar
        teams={teams}
        rounds={availableRounds}
        selectedTeam={selectedTeam}
        selectedRound={selectedRound}
        onTeamChange={handleTeamChange}
        onRoundChange={handleRoundChange}
      />
      
      <MatchList matches={displayMatches || []} />
    </div>
  );
};

export default MatchesPage;