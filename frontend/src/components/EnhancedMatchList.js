import React, { useState, useEffect, useRef } from 'react';

const EnhancedMatchList = ({ 
  matches, 
  matchdays = [],
  isLoading = false
}) => {
  // Get current matchday from localStorage or default to first available
  const getInitialMatchday = () => {
    const savedMatchday = localStorage.getItem('currentMatchday');
    if (savedMatchday && matchdays.includes(parseInt(savedMatchday))) {
      return parseInt(savedMatchday);
    }
    return matchdays[0] || 1;
  };

  // State for current matchday and animation direction
  const [currentMatchday, setCurrentMatchday] = useState(getInitialMatchday);
  const [animationDirection, setAnimationDirection] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const listRef = useRef(null);
  const matchdaySelectorRef = useRef(null);

  // Filter matches by the current matchday
  const matchesForCurrentMatchday = matches?.filter(match => match.matchday === currentMatchday) || [];

  // Handle matchday change with animation
  const changeMatchday = (matchday, direction) => {
    if (matchday === currentMatchday || isTransitioning) return;
    
    setIsTransitioning(true);
    setAnimationDirection(direction);
    
    // Delay setting the new matchday to allow animation to start
    setTimeout(() => {
      setCurrentMatchday(matchday);
      // Save to localStorage
      localStorage.setItem('currentMatchday', matchday.toString());
    }, 50);
    
    // Clear transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Should match CSS transition duration
  };

  // Navigate to next/prev matchday
  const goToNextMatchday = () => {
    const currentIndex = matchdays.indexOf(currentMatchday);
    if (currentIndex < matchdays.length - 1) {
      changeMatchday(matchdays[currentIndex + 1], 'left');
    }
  };

  const goToPrevMatchday = () => {
    const currentIndex = matchdays.indexOf(currentMatchday);
    if (currentIndex > 0) {
      changeMatchday(matchdays[currentIndex - 1], 'right');
    }
  };

  // Keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNextMatchday();
      } else if (e.key === 'ArrowLeft') {
        goToPrevMatchday();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMatchday, matchdays]);

  // Scroll active matchday into view in the selector
  useEffect(() => {
    if (matchdaySelectorRef.current) {
      const activeButton = matchdaySelectorRef.current.querySelector('.active');
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentMatchday]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render skeleton loading state
  const renderSkeletonLoading = () => {
    return Array(5).fill(0).map((_, idx) => (
      <tr key={`skeleton-${idx}`} className="skeleton-row">
        <td><div className="skeleton-loader"></div></td>
        <td><div className="skeleton-loader"></div></td>
        <td><div className="skeleton-loader"></div></td>
        <td><div className="skeleton-loader"></div></td>
        <td><div className="skeleton-loader"></div></td>
        <td><div className="skeleton-loader"></div></td>
      </tr>
    ));
  };

  // Render matchday buttons for sticky navigation
  const renderMatchdaySelector = () => {
    return (
      <div className="matchday-selector-container">
        <div className="matchday-selector-wrapper">
          <button 
            className="matchday-nav prev"
            onClick={goToPrevMatchday}
            disabled={matchdays.indexOf(currentMatchday) === 0}
            aria-label="Previous matchday"
          >
            ◀
          </button>
          
          <div className="matchday-selector" ref={matchdaySelectorRef}>
            {matchdays.map(matchday => (
              <button
                key={matchday}
                className={`matchday-button ${matchday === currentMatchday ? 'active' : ''}`}
                onClick={() => changeMatchday(
                  matchday, 
                  matchday > currentMatchday ? 'left' : 'right'
                )}
                aria-pressed={matchday === currentMatchday}
              >
                {matchday}
              </button>
            ))}
          </div>
          
          <button 
            className="matchday-nav next"
            onClick={goToNextMatchday}
            disabled={matchdays.indexOf(currentMatchday) === matchdays.length - 1}
            aria-label="Next matchday"
          >
            ▶
          </button>
        </div>
      </div>
    );
  };

  // Render compact pagination for bottom of page
  const renderCompactPagination = () => {
    const currentIndex = matchdays.indexOf(currentMatchday);
    
    return (
      <div className="compact-pagination">
        <button 
          className="compact-nav prev"
          onClick={goToPrevMatchday}
          disabled={currentIndex === 0}
          aria-label="Previous matchday"
        >
          ◀
        </button>
        
        <div className="compact-indicator">
          Kolejka {currentMatchday} z {matchdays.length}
        </div>
        
        <button 
          className="compact-nav next"
          onClick={goToNextMatchday}
          disabled={currentIndex === matchdays.length - 1}
          aria-label="Next matchday"
        >
          ▶
        </button>
      </div>
    );
  };

  // No matches display
  if (!matches || matches.length === 0) {
    return (
      <div className="enhanced-match-list">
        {renderMatchdaySelector()}
        <div className="no-data-message">Brak danych o meczach.</div>
      </div>
    );
  }

  return (
    <div className="enhanced-match-list">
      {/* Sticky matchday selector */}
      {renderMatchdaySelector()}
      
      {/* Match list with animation */}
      <div 
        className={`match-list-content ${isTransitioning ? `slide-${animationDirection}` : ''}`}
        ref={listRef}
      >
        <div className="current-matchday-header">
          <h3>Kolejka {currentMatchday}</h3>
          <div className="match-count">
            {matchesForCurrentMatchday.length} {matchesForCurrentMatchday.length === 1 ? 'mecz' : 'mecze'}
          </div>
        </div>
        
        <div className="match-list-container">
          <table className="match-list">
            <thead>
              <tr>
                <th>Data</th>
                <th>Gospodarz</th>
                <th>Wynik</th>
                <th>Gość</th>
                <th>Stadion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? renderSkeletonLoading() : (
                matchesForCurrentMatchday.length > 0 ? (
                  matchesForCurrentMatchday.map((match) => (
                    <tr key={match._id} className={`status-${match.status}`}>
                      <td>{formatDate(match.date)}</td>
                      <td className="team-name home">{match.homeTeamId.name}</td>
                      <td className="match-score">
                        <span className="score-value">{match.homeGoals} - {match.awayGoals}</span>
                      </td>
                      <td className="team-name away">{match.awayTeamId.name}</td>
                      <td>{match.stadiumId.name}</td>
                      <td className="match-status">{match.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-matches-message">
                      Brak meczów dla tej kolejki
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Compact pagination for bottom of page */}
      {renderCompactPagination()}
      
      {/* Keyboard navigation hint */}
      <div className="keyboard-hint">
        <span className="keyboard-key">◀</span> 
        <span className="keyboard-key">▶</span> 
        Nawigacja strzałkami
      </div>
    </div>
  );
};

export default EnhancedMatchList;