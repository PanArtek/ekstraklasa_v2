import React, { useState, useMemo, useEffect } from 'react';
import { useAllMatches, useMatchesWithFilters } from '../hooks/useMatches';
import useTeams from '../hooks/useTeams';
import useStadiums from '../hooks/useStadiums';
import EnhancedMatchList from '../components/EnhancedMatchList';
import EnhancedFilterBar from '../components/EnhancedFilterBar';

const EnhancedMatchesPage = () => {
  // Get saved favorite team from localStorage
  const getSavedFavoriteTeam = () => {
    return localStorage.getItem('favoriteTeam') || null;
  };

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
  
  // State for favorite team
  const [favoriteTeam, setFavoriteTeam] = useState(getSavedFavoriteTeam);

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
    // Clear matchday filter if teamId is selected (for better UX)
    if (filterName === 'teamId' && value !== null) {
      setFilters(prev => ({
        ...prev,
        [filterName]: value,
        matchday: null
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterName]: value
      }));
    }
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

  // Handle setting favorite team
  const handleSetFavoriteTeam = (teamId) => {
    setFavoriteTeam(teamId);
  };

  // Add keyboard shortcut for favorite team (F key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F key to toggle favorite team filter
      if (e.key === 'f' && favoriteTeam && !e.ctrlKey && !e.metaKey && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLSelectElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        
        handleFilterChange('teamId', filters.teamId === favoriteTeam ? null : favoriteTeam);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [favoriteTeam, filters.teamId]);

  // Loading state
  const isLoading = isLoadingTeams || isLoadingStadiums || isLoadingAll || 
                   (hasActiveFilters && isLoadingFiltered);

  return (
    <div className="enhanced-matches-page">
      <header className="page-header">
        <h2>Terminarz Ekstraklasy</h2>
        {favoriteTeam && (
          <div className="favorite-team-hint">
            Naciśnij <span className="keyboard-key">F</span> aby filtrować ulubioną drużynę
          </div>
        )}
      </header>
      
      <EnhancedFilterBar
        teams={teams || []}
        rounds={availableFilters.rounds}
        matchdays={availableFilters.matchdays}
        stadiums={stadiums || []}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        favoriteTeam={favoriteTeam}
        onSetFavoriteTeam={handleSetFavoriteTeam}
      />
      
      {hasActiveFilters && (
        <div className="filter-summary">
          <p className="filter-info">
            Wyświetlanie: {filteredMatches?.length || 0} {filteredMatches?.length === 1 ? 'mecz' : 'mecze'} z zastosowanymi filtrami
          </p>
        </div>
      )}
      
      <EnhancedMatchList 
        matches={displayMatches} 
        matchdays={availableFilters.matchdays}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EnhancedMatchesPage;