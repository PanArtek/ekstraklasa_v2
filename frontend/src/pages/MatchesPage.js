import React, { useState, useMemo } from 'react';
import { useAllMatches, useMatchesWithFilters } from '../hooks/useMatches';
import useTeams from '../hooks/useTeams';
import useStadiums from '../hooks/useStadiums';
import MatchList from '../components/MatchList';
import FilterBar from '../components/FilterBar';

const MatchesPage = () => {
  // Initialize all filter states in a single filters object
  const [filters, setFilters] = useState({
    teamId: null,
    round: null,
    matchday: null,
    stadiumId: null,
    status: null,
    startDate: null,
    endDate: null
  });

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => value !== null);

  // Fetch all data we need
  const { data: teams, isLoading: isLoadingTeams } = useTeams();
  const { data: stadiums, isLoading: isLoadingStadiums } = useStadiums();
  const { data: allMatches, isLoading: isLoadingAll } = useAllMatches();
  const { data: filteredMatches, isLoading: isLoadingFiltered } = useMatchesWithFilters(filters);

  // Calculate available options for filters based on all matches
  const availableFilters = useMemo(() => {
    if (!allMatches) return { rounds: [], matchdays: [] };
    
    // Extract unique rounds and sort
    const rounds = [...new Set(allMatches.map(match => match.round))];
    rounds.sort((a, b) => a - b);
    
    // Extract unique matchdays and sort
    const matchdays = [...new Set(allMatches.map(match => match.matchday))];
    matchdays.sort((a, b) => a - b);
    
    return { rounds, matchdays };
  }, [allMatches]);

  // Determine which matches to display
  const displayMatches = useMemo(() => {
    if (hasActiveFilters && filteredMatches) return filteredMatches;
    if (allMatches) return allMatches;
    return [];
  }, [hasActiveFilters, filteredMatches, allMatches]);

  // Handle individual filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setFilters({
      teamId: null,
      round: null,
      matchday: null,
      stadiumId: null,
      status: null,
      startDate: null,
      endDate: null
    });
  };

  // Loading state
  const isLoading = isLoadingTeams || isLoadingStadiums || isLoadingAll || 
                   (hasActiveFilters && isLoadingFiltered);

  return (
    <div className="matches-page">
      <h2>Terminarz Ekstraklasy</h2>
      
      {isLoading ? (
        <div className="loading">Ładowanie danych...</div>
      ) : (
        <>
          <FilterBar
            teams={teams || []}
            rounds={availableFilters.rounds}
            matchdays={availableFilters.matchdays}
            stadiums={stadiums || []}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          <div className="filter-summary">
            {hasActiveFilters && (
              <p className="filter-info">
                Wyświetlanie: {filteredMatches?.length || 0} mecze z zastosowanymi filtrami
              </p>
            )}
          </div>
          
          <MatchList matches={displayMatches} />
        </>
      )}
    </div>
  );
};

export default MatchesPage;