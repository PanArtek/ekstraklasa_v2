import React, { useState } from 'react';
import { useLeagueTable, useUpdateLeagueTable, useResetTeamStats } from '../hooks/useLeagueTable';
import EnhancedTeamTable from '../components/EnhancedTeamTable';

const EnhancedLeagueTablePage = () => {
  const [season, setSeason] = useState('2024/2025');
  
  // Pobieranie danych tabeli
  const { 
    data: leagueTable, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useLeagueTable({ season });
  
  // Mutacje do aktualizacji i resetowania
  const updateMutation = useUpdateLeagueTable();
  const resetMutation = useResetTeamStats();
  
  // Obsługa zmiany sezonu
  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
  };
  
  // Obsługa aktualizacji tabeli
  const handleUpdateTable = () => {
    updateMutation.mutate(season);
  };
  
  // Obsługa resetowania statystyk
  const handleResetStats = () => {
    if (window.confirm('Czy na pewno chcesz zresetować wszystkie statystyki drużyn?')) {
      resetMutation.mutate();
    }
  };
  
  // Dostępne sezony (można pobrać to z API w przyszłości)
  const availableSeasons = ['2023/2024', '2024/2025'];
  
  // Sprawdzenie ładowania
  if (isLoading) {
    return <div className="loading">Ładowanie tabeli ligowej...</div>;
  }
  
  // Sprawdzenie błędów
  if (isError) {
    return (
      <div className="error-message">
        <p>Błąd wczytywania tabeli: {error?.message || 'Nieznany błąd'}</p>
        <button onClick={() => refetch()}>Spróbuj ponownie</button>
      </div>
    );
  }
  
  // Sprawdzenie, czy mamy dane tabeli
  const hasTableData = Array.isArray(leagueTable) && leagueTable.length > 0;
  
  return (
    <div className="league-table-page">
      <div className="page-header">
        <h2>Tabela Ekstraklasy</h2>
        
        <div className="table-controls">
          <div className="control-group">
            <label htmlFor="season-select">Sezon:</label>
            <select 
              id="season-select" 
              value={season}
              onChange={handleSeasonChange}
            >
              {availableSeasons.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div className="button-group">
            <button 
              className="update-button" 
              onClick={handleUpdateTable}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Aktualizowanie...' : 'Aktualizuj tabelę'}
            </button>
            
            <button 
              className="reset-button" 
              onClick={handleResetStats}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? 'Resetowanie...' : 'Resetuj statystyki'}
            </button>
          </div>
        </div>
        
        {updateMutation.isSuccess && (
          <div className="success-message">
            Tabela została pomyślnie zaktualizowana.
          </div>
        )}
        
        {resetMutation.isSuccess && (
          <div className="success-message">
            Statystyki drużyn zostały zresetowane.
          </div>
        )}
      </div>
      
      {hasTableData ? (
        <EnhancedTeamTable teams={leagueTable} />
      ) : (
        <div className="no-data-message">
          Brak danych tabeli dla wybranego sezonu.
        </div>
      )}
    </div>
  );
};

export default EnhancedLeagueTablePage;