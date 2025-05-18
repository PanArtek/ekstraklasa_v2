import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EnhancedFilterBar = ({
  teams,
  rounds,
  matchdays,
  stadiums,
  filters,
  onFilterChange,
  onClearFilters,
  favoriteTeam,
  onSetFavoriteTeam
}) => {
  // State for mobile filters visibility
  const [filtersVisible, setFiltersVisible] = useState(false);
  const filterRef = useRef(null);
  
  // Handler for single select filter changes
  const handleFilterChange = (filterName, value) => {
    // Convert values to appropriate types
    let processedValue = value;
    if (filterName === 'round' || filterName === 'matchday') {
      processedValue = value ? parseInt(value) : null;
    } else if (filterName === 'startDate' || filterName === 'endDate') {
      // Already a Date object from DatePicker
    } else if (value === '') {
      processedValue = null;
    }
    
    onFilterChange(filterName, processedValue);
  };

  // Handler to remove a single filter (for filter chips)
  const handleRemoveFilter = (filterName) => {
    onFilterChange(filterName, null);
  };

  // Handler to set favorite team
  const handleSetFavoriteTeam = (teamId) => {
    // Store in localStorage
    if (teamId) {
      localStorage.setItem('favoriteTeam', teamId);
    } else {
      localStorage.removeItem('favoriteTeam');
    }
    
    if (onSetFavoriteTeam) {
      onSetFavoriteTeam(teamId);
    }
  };

  // Available status options
  const statusOptions = [
    { value: 'zaplanowany', label: 'Zaplanowany' },
    { value: 'rozegrany', label: 'Rozegrany' },
    { value: 'odwołany', label: 'Odwołany' }
  ];

  // Get label for filter values (for displaying in chips)
  const getFilterLabel = (filterName, value) => {
    switch(filterName) {
      case 'teamId':
        const team = teams?.find(t => t._id === value);
        return team ? team.name : 'Unknown Team';
      case 'round':
        return `Runda ${value}`;
      case 'matchday':
        return `Kolejka ${value}`;
      case 'stadiumId':
        const stadium = stadiums?.find(s => s._id === value);
        return stadium ? stadium.name : 'Unknown Stadium';
      case 'status':
        const status = statusOptions.find(s => s.value === value);
        return status ? status.label : value;
      case 'startDate':
        return `Od: ${value.toLocaleDateString()}`;
      case 'endDate':
        return `Do: ${value.toLocaleDateString()}`;
      default:
        return value;
    }
  };

  // Determine which filters are active for showing filter chips
  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== null);

  // Handler for toggle filters on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Close filters dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFiltersVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render filter chips
  const renderFilterChips = () => {
    if (activeFilters.length === 0) return null;
    
    return (
      <div className="filter-chips">
        {activeFilters.map(([filterName, value]) => (
          <div key={filterName} className="filter-chip">
            <span>{getFilterLabel(filterName, value)}</span>
            <button 
              onClick={() => handleRemoveFilter(filterName)}
              aria-label={`Remove ${filterName} filter`}
              className="filter-chip-remove"
            >
              ×
            </button>
          </div>
        ))}
        {activeFilters.length > 0 && (
          <button 
            onClick={onClearFilters} 
            className="filter-chip filter-chip-clear"
          >
            Wyczyść wszystkie
          </button>
        )}
      </div>
    );
  };

  // Render the favorite team button
  const renderFavoriteTeamButton = () => {
    const isFavorite = favoriteTeam === filters.teamId;
    
    if (!filters.teamId) return null;
    
    return (
      <button
        className={`favorite-team-button ${isFavorite ? 'is-favorite' : ''}`}
        onClick={() => handleSetFavoriteTeam(isFavorite ? null : filters.teamId)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    );
  };

  // Group related filters
  const renderFilterGroups = () => (
    <>
      <div className="filter-groups-row">
        {/* Teams Filter Group */}
        <div className="filter-group-container">
          <h3 className="filter-group-title">Drużyna</h3>
          <div className="filter-controls">
            <div className="filter-group">
              <select
                id="teamFilter"
                value={filters.teamId || ''}
                onChange={(e) => handleFilterChange('teamId', e.target.value)}
                aria-label="Filter by team"
              >
                <option value="">Wszystkie drużyny</option>
                {teams?.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {renderFavoriteTeamButton()}
            </div>
          </div>
        </div>

        {/* Schedule Filter Group */}
        <div className="filter-group-container">
          <h3 className="filter-group-title">Terminarz</h3>
          <div className="filter-controls">
            <div className="filter-group">
              <select
                id="roundFilter"
                value={filters.round || ''}
                onChange={(e) => handleFilterChange('round', e.target.value)}
                aria-label="Filter by round"
              >
                <option value="">Wszystkie rundy</option>
                {rounds?.map((round) => (
                  <option key={round} value={round}>
                    Runda {round}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                id="matchdayFilter"
                value={filters.matchday || ''}
                onChange={(e) => handleFilterChange('matchday', e.target.value)}
                aria-label="Filter by matchday"
              >
                <option value="">Wszystkie kolejki</option>
                {matchdays?.map((matchday) => (
                  <option key={matchday} value={matchday}>
                    Kolejka {matchday}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Venue & Status Filter Group */}
        <div className="filter-group-container">
          <h3 className="filter-group-title">Miejsce i Status</h3>
          <div className="filter-controls">
            <div className="filter-group">
              <select
                id="stadiumFilter"
                value={filters.stadiumId || ''}
                onChange={(e) => handleFilterChange('stadiumId', e.target.value)}
                aria-label="Filter by stadium"
              >
                <option value="">Wszystkie stadiony</option>
                {stadiums?.map((stadium) => (
                  <option key={stadium._id} value={stadium._id}>
                    {stadium.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                id="statusFilter"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                aria-label="Filter by match status"
              >
                <option value="">Wszystkie statusy</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Date Range Filter Group - Separate row below */}
      <div className="date-range-row">
        <div className="filter-group-container date-range-container">
          <h3 className="filter-group-title">Zakres Dat</h3>
          <div className="filter-controls date-range">
            <div className="date-pickers-wrapper">
              <div className="date-picker-container">
                <label htmlFor="startDateFilter" className="date-picker-label">Od:</label>
                <DatePicker
                  id="startDateFilter"
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Wybierz datę początkową"
                  isClearable
                  aria-label="Start date"
                  className="date-picker-input"
                />
              </div>
              
              <div className="date-picker-container">
                <label htmlFor="endDateFilter" className="date-picker-label">Do:</label>
                <DatePicker
                  id="endDateFilter"
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Wybierz datę końcową"
                  isClearable
                  minDate={filters.startDate}
                  aria-label="End date"
                  className="date-picker-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="enhanced-filter-container" ref={filterRef}>
      {/* Mobile filters toggle button */}
      <div className="mobile-filter-header">
        <button 
          className={`filter-toggle-button ${filtersVisible ? 'active' : ''}`}
          onClick={toggleFilters}
          aria-expanded={filtersVisible}
          aria-controls="filter-content"
        >
          <span className="filter-icon"></span>
          Filtry
          {activeFilters.length > 0 && (
            <span className="filter-count">{activeFilters.length}</span>
          )}
        </button>
        
        {/* Quick Favorite Team access on mobile */}
        {favoriteTeam && (
          <button 
            className="quick-favorite-button"
            onClick={() => handleFilterChange('teamId', favoriteTeam === filters.teamId ? null : favoriteTeam)}
            aria-label="Filter by favorite team"
          >
            {favoriteTeam === filters.teamId ? '★ Ulubiona' : '☆ Ulubiona'}
          </button>
        )}
      </div>
      
      {/* Filter chips (active filters) */}
      {renderFilterChips()}
      
      {/* Main filter bar (desktop always visible, mobile conditionally) */}
      <div 
        id="filter-content"
        className={`enhanced-filter-bar ${filtersVisible ? 'visible' : ''}`}
      >
        {renderFilterGroups()}
      </div>
    </div>
  );
};

export default EnhancedFilterBar;