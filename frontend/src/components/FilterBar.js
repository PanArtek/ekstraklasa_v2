import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterBar = ({
  teams,
  rounds,
  matchdays,
  stadiums,
  filters,
  onFilterChange,
  onClearFilters
}) => {
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

  // Available status options
  const statusOptions = [
    { value: 'zaplanowany', label: 'Zaplanowany' },
    { value: 'rozegrany', label: 'Rozegrany' },
    { value: 'odwołany', label: 'Odwołany' }
  ];

  return (
    <div className="filter-bar">
      {/* Team Filter */}
      <div className="filter-group">
        <label htmlFor="teamFilter">Drużyna:</label>
        <select
          id="teamFilter"
          value={filters.teamId || ''}
          onChange={(e) => handleFilterChange('teamId', e.target.value)}
        >
          <option value="">Wszystkie drużyny</option>
          {teams && teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Round Filter */}
      <div className="filter-group">
        <label htmlFor="roundFilter">Runda:</label>
        <select
          id="roundFilter"
          value={filters.round || ''}
          onChange={(e) => handleFilterChange('round', e.target.value)}
        >
          <option value="">Wszystkie rundy</option>
          {rounds && rounds.map((round) => (
            <option key={round} value={round}>
              Runda {round}
            </option>
          ))}
        </select>
      </div>

      {/* Matchday Filter */}
      <div className="filter-group">
        <label htmlFor="matchdayFilter">Kolejka:</label>
        <select
          id="matchdayFilter"
          value={filters.matchday || ''}
          onChange={(e) => handleFilterChange('matchday', e.target.value)}
        >
          <option value="">Wszystkie kolejki</option>
          {matchdays && matchdays.map((matchday) => (
            <option key={matchday} value={matchday}>
              Kolejka {matchday}
            </option>
          ))}
        </select>
      </div>

      {/* Stadium Filter */}
      <div className="filter-group">
        <label htmlFor="stadiumFilter">Stadion:</label>
        <select
          id="stadiumFilter"
          value={filters.stadiumId || ''}
          onChange={(e) => handleFilterChange('stadiumId', e.target.value)}
        >
          <option value="">Wszystkie stadiony</option>
          {stadiums && stadiums.map((stadium) => (
            <option key={stadium._id} value={stadium._id}>
              {stadium.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="filter-group">
        <label htmlFor="statusFilter">Status meczu:</label>
        <select
          id="statusFilter"
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Wszystkie statusy</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="filter-group date-range">
        <label>Zakres dat:</label>
        <div className="date-pickers">
          <div className="date-picker-wrapper">
            <label htmlFor="startDateFilter">Od:</label>
            <DatePicker
              id="startDateFilter"
              selected={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Wybierz datę początkową"
              isClearable
            />
          </div>
          <div className="date-picker-wrapper">
            <label htmlFor="endDateFilter">Do:</label>
            <DatePicker
              id="endDateFilter"
              selected={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Wybierz datę końcową"
              isClearable
              minDate={filters.startDate}
            />
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="filter-group">
        <button 
          className="clear-filters-button" 
          onClick={onClearFilters}
        >
          Wyczyść filtry
        </button>
      </div>
    </div>
  );
};

export default FilterBar;