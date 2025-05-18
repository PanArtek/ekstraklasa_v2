# Dokumentacja mechanizmu filtrowania terminarza meczów

## 1. Architektura mechanizmu filtrowania

Aplikacja Ekstraklasa v2 implementuje funkcjonalność filtrowania terminarza meczów przy użyciu architektury opartej na współpracy wielu komponentów. Mechanizm filtrowania działa na zasadzie komunikacji między komponentami interfejsu użytkownika, zarządzaniem stanem za pomocą React Hooks oraz komunikacją z API serwera za pomocą React Query.

### 1.1 Ogólny przepływ danych

```
┌─────────────┐     ┌─────────────┐     ┌────────────┐     ┌──────────────┐
│ FilterBar   │────▶│ MatchesPage │────▶│ API Hooks  │────▶│ API Endpoints│
│ (UI)        │◀────│ (Stan)      │◀────│ (Zapytania)│◀────│ (Backend)    │
└─────────────┘     └─────────────┘     └────────────┘     └──────────────┘
```

## 2. Komponenty frontend odpowiedzialne za filtrowanie

### 2.1 FilterBar.js - Interfejs użytkownika filtrów

Komponent `FilterBar` dostarcza interfejs użytkownika do wyboru filtrów. Umożliwia filtrowanie według:
- Drużyny
- Rundy rozgrywek
- Kolejki meczowej (matchday)
- Stadionu
- Statusu meczu (rozegrany, zaplanowany, odwołany)
- Zakresu dat (od-do)

```jsx
// Fragment kodu z FilterBar.js
const FilterBar = ({
  teams,
  rounds,
  matchdays,
  stadiums,
  filters,
  onFilterChange,
  onClearFilters
}) => {
  // Handler dla zmian w filtrach
  const handleFilterChange = (filterName, value) => {
    // Konwersja wartości na odpowiednie typy
    let processedValue = value;
    if (filterName === 'round' || filterName === 'matchday') {
      processedValue = value ? parseInt(value) : null;
    } else if (filterName === 'startDate' || filterName === 'endDate') {
      // Już jest obiektem Date z DatePicker
    } else if (value === '') {
      processedValue = null;
    }
    
    onFilterChange(filterName, processedValue);
  };

  return (
    <div className="filter-bar">
      {/* Filtr drużyny */}
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

      {/* Inne filtry: runda, kolejka, stadion, status */}
      
      {/* Filtr zakresu dat */}
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

      {/* Przycisk czyszczenia filtrów */}
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
```

### 2.2 MatchesPage.js - Zarządzanie stanem filtrów

Komponent `MatchesPage` został przeprojektowany, aby zarządzać wszystkimi filtrami jednocześnie za pomocą jednego obiektu stanu. Kluczowe elementy:

1. **Scentralizowany stan filtrów**: Wszystkie filtry przechowywane w jednym obiekcie stanu
2. **Pobieranie danych**: Wykorzystuje głównie hook `useMatchesWithFilters` do pobierania danych z zastosowaniem wielu filtrów jednocześnie
3. **Dynamiczne obliczanie dostępnych opcji filtrów**: Opcje filtrów (rundy, kolejki) są obliczane na podstawie wszystkich meczów

```jsx
// Fragment kodu z MatchesPage.js
const MatchesPage = () => {
  // Inicjalizacja wszystkich filtrów w jednym obiekcie
  const [filters, setFilters] = useState({
    teamId: null,
    round: null,
    matchday: null,
    stadiumId: null,
    status: null,
    startDate: null,
    endDate: null
  });

  // Sprawdzenie, czy jakikolwiek filtr jest aktywny
  const hasActiveFilters = Object.values(filters).some(value => value !== null);

  // Pobieranie wszystkich potrzebnych danych
  const { data: teams, isLoading: isLoadingTeams } = useTeams();
  const { data: stadiums, isLoading: isLoadingStadiums } = useStadiums();
  const { data: allMatches, isLoading: isLoadingAll } = useAllMatches();
  const { data: filteredMatches, isLoading: isLoadingFiltered } = useMatchesWithFilters(filters);

  // Obliczanie dostępnych opcji filtrów na podstawie wszystkich meczów
  const availableFilters = useMemo(() => {
    if (!allMatches) return { rounds: [], matchdays: [] };
    
    // Wyodrębnienie unikalnych rund i sortowanie
    const rounds = [...new Set(allMatches.map(match => match.round))];
    rounds.sort((a, b) => a - b);
    
    // Wyodrębnienie unikalnych kolejek meczowych i sortowanie
    const matchdays = [...new Set(allMatches.map(match => match.matchday))];
    matchdays.sort((a, b) => a - b);
    
    return { rounds, matchdays };
  }, [allMatches]);

  // Określenie, które mecze mają być wyświetlane
  const displayMatches = useMemo(() => {
    if (hasActiveFilters && filteredMatches) return filteredMatches;
    if (allMatches) return allMatches;
    return [];
  }, [hasActiveFilters, filteredMatches, allMatches]);

  // Obsługa zmiany pojedynczego filtra
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Obsługa czyszczenia wszystkich filtrów
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

  // Pozostała część komponentu...
};
```

### 2.3 MatchList.js - Wyświetlanie wyfiltrowanych meczów

Komponent `MatchList` pozostaje niezmieniony i nadal odpowiada wyłącznie za prezentację danych w interfejsie użytkownika, zgodnie z zasadą pojedynczej odpowiedzialności.

## 3. Hooki do komunikacji z API

Rozszerzono zestaw hooków React Query o obsługę nowych filtrów oraz funkcję łączenia wielu filtrów jednocześnie.

### 3.1 useMatches.js - Rozszerzone hooki do pobierania danych o meczach

```jsx
// Fragment kodu z useMatches.js
import { useQuery } from '@tanstack/react-query';
import { 
  fetchAllMatches, 
  fetchMatchesByTeam, 
  fetchMatchesByRound,
  fetchMatchesByMatchday,
  fetchMatchesByStadiumId,
  fetchMatchesByStatus,
  fetchMatchesByDateRange,
  fetchMatchesWithFilters
} from '../services/api';

// Poprzednie hooki (useAllMatches, useMatchesByTeam, useMatchesByRound)...

// Nowe hooki dla dodatkowych filtrów
export const useMatchesByMatchday = (matchday) => {
  return useQuery({
    queryKey: ['matches', 'matchday', matchday],
    queryFn: () => fetchMatchesByMatchday(matchday),
    enabled: !!matchday, // Wykonaj zapytanie tylko gdy matchday jest podany
  });
};

export const useMatchesByStadiumId = (stadiumId) => {
  return useQuery({
    queryKey: ['matches', 'stadium', stadiumId],
    queryFn: () => fetchMatchesByStadiumId(stadiumId),
    enabled: !!stadiumId, // Wykonaj zapytanie tylko gdy stadiumId jest podany
  });
};

export const useMatchesByStatus = (status) => {
  return useQuery({
    queryKey: ['matches', 'status', status],
    queryFn: () => fetchMatchesByStatus(status),
    enabled: !!status, // Wykonaj zapytanie tylko gdy status jest podany
  });
};

export const useMatchesByDateRange = (startDate, endDate) => {
  return useQuery({
    queryKey: ['matches', 'dateRange', startDate, endDate],
    queryFn: () => fetchMatchesByDateRange(startDate, endDate),
    enabled: !!(startDate && endDate), // Wykonaj zapytanie tylko gdy obie daty są podane
  });
};

// Hook do obsługi złożonych filtrów
export const useMatchesWithFilters = (filters) => {
  // Tworzenie stabilnego klucza zapytania z filtrów
  const queryKey = ['matches', 'filters', 
    filters.teamId, 
    filters.round,
    filters.matchday, 
    filters.stadiumId, 
    filters.status,
    filters.startDate,
    filters.endDate
  ];
  
  // Sprawdzenie, czy jakikolwiek filtr jest ustawiony
  const hasFilters = Object.values(filters).some(value => !!value);
  
  return useQuery({
    queryKey,
    queryFn: () => fetchMatchesWithFilters(filters),
    enabled: hasFilters, // Wykonaj zapytanie tylko gdy co najmniej jeden filtr jest ustawiony
  });
};
```

### 3.2 api.js - Rozszerzone usługi komunikacji z API

```jsx
// Fragment kodu z api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

// Poprzednie funkcje API...

// Nowe funkcje API dla dodatkowych filtrów
export const fetchMatchesByMatchday = async (matchday) => {
  const response = await api.get(`/matches/matchday/${matchday}`);
  return response.data;
};

export const fetchMatchesByStadiumId = async (stadiumId) => {
  const response = await api.get(`/matches/stadium/${stadiumId}`);
  return response.data;
};

export const fetchMatchesByStatus = async (status) => {
  const response = await api.get(`/matches/status/${status}`);
  return response.data;
};

export const fetchMatchesByDateRange = async (startDate, endDate) => {
  const response = await api.get('/matches/date-range', {
    params: { startDate, endDate }
  });
  return response.data;
};

// Funkcja do obsługi złożonych filtrów
export const fetchMatchesWithFilters = async (filters) => {
  const response = await api.get('/matches/filters', {
    params: filters
  });
  return response.data;
};
```

## 4. Endpointy API backendu obsługujące filtrowanie

### 4.1 match.routes.js - Rozszerzone trasy dla endpointów meczów

```javascript
// Fragment kodu z match.routes.js
const express = require('express');
const { 
  getAllMatches, 
  getMatchesByTeamId, 
  getMatchesByRound,
  getMatchesByMatchday,
  getMatchesByStadiumId,
  getMatchesByStatus,
  getMatchesByDateRange,
  getMatchesWithFilters
} = require('../controllers/match.controller');

const router = express.Router();

// Istniejące endpointy
router.get('/', getAllMatches);
router.get('/team/:teamId', getMatchesByTeamId);
router.get('/round/:round', getMatchesByRound);

// Nowe endpointy dla dodatkowych filtrów
router.get('/matchday/:matchday', getMatchesByMatchday);
router.get('/stadium/:stadiumId', getMatchesByStadiumId);
router.get('/status/:status', getMatchesByStatus);
router.get('/date-range', getMatchesByDateRange);

// Endpoint do obsługi złożonych filtrów
router.get('/filters', getMatchesWithFilters);

module.exports = router;
```

### 4.2 match.controller.js - Rozszerzona logika filtrowania po stronie serwera

```javascript
// Fragment kodu z match.controller.js
const Match = require('../models/Match');

// Istniejące kontrolery...

// Nowe kontrolery dla dodatkowych filtrów
// Get matches by matchday
const getMatchesByMatchday = async (req, res) => {
  try {
    const matchday = req.params.matchday;
    
    const matches = await Match.find({ matchday })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by matchday:', error);
    res.status(500).json({ message: 'Error fetching matches by matchday' });
  }
};

// Get matches by stadium ID
const getMatchesByStadiumId = async (req, res) => {
  try {
    const stadiumId = req.params.stadiumId;
    
    const matches = await Match.find({ stadiumId })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by stadium ID:', error);
    res.status(500).json({ message: 'Error fetching matches by stadium ID' });
  }
};

// Get matches by status
const getMatchesByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    
    const matches = await Match.find({ status })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by status:', error);
    res.status(500).json({ message: 'Error fetching matches by status' });
  }
};

// Get matches by date range
const getMatchesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required' });
    }
    
    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    const matches = await Match.find(dateFilter)
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by date range:', error);
    res.status(500).json({ message: 'Error fetching matches by date range' });
  }
};

// Get matches with combined filters
const getMatchesWithFilters = async (req, res) => {
  try {
    const {
      teamId,
      round,
      matchday,
      stadiumId,
      status,
      startDate,
      endDate
    } = req.query;
    
    // Budowanie obiektu filtra na podstawie dostarczonych parametrów
    const filter = {};
    
    if (teamId) {
      filter.$or = [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ];
    }
    
    if (round) {
      filter.round = parseInt(round);
    }
    
    if (matchday) {
      filter.matchday = parseInt(matchday);
    }
    
    if (stadiumId) {
      filter.stadiumId = stadiumId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const matches = await Match.find(filter)
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches with filters:', error);
    res.status(500).json({ message: 'Error fetching matches with filters' });
  }
};
```

## 5. Przepływ danych podczas filtrowania

### 5.1 Proces filtrowania - krok po kroku

1. **Inicjalizacja**:
   - Komponent `MatchesPage` ładuje wszystkie mecze przy inicjalizacji
   - Równocześnie pobierane są dane wszystkich drużyn i stadionów
   - Dostępne rundy, kolejki i inne opcje filtrowania są obliczane dynamicznie na podstawie pobranych danych

2. **Wybór pojedynczego filtra**:
   - Użytkownik wybiera wartość filtra w komponencie `FilterBar` (np. drużyna, runda, kolejka, stadion, status)
   - `FilterBar` wywołuje funkcję `onFilterChange` przekazaną jako props
   - Funkcja `handleFilterChange` w `MatchesPage` aktualizuje odpowiednią właściwość w obiekcie stanu `filters`
   - Hook `useMatchesWithFilters` wykrywa zmianę w obiekcie `filters` i wykonuje zapytanie do API
   - Zapytanie trafia do endpointu `/api/matches/filters` na backendzie z parametrami zapytania
   - Backend buduje filtr MongoDB na podstawie dostarczonych parametrów
   - Wyniki są zwracane do frontendu i renderowane przez komponent `MatchList`

3. **Wybór zakresu dat**:
   - Użytkownik wybiera daty początkową i końcową w komponencie `DatePicker`
   - Daty są przetwarzane i dodawane do obiektu stanu `filters`
   - Hook `useMatchesWithFilters` wykrywa zmianę i wykonuje zapytanie do API
   - Zapytanie zawiera parametry dat, które są konwertowane na obiekty `Date` na backendzie
   - Backend filtruje mecze w wybranym zakresie dat
   - Wyniki są zwracane i renderowane

4. **Czyszczenie filtrów**:
   - Użytkownik klika przycisk "Wyczyść filtry"
   - Funkcja `handleClearFilters` w `MatchesPage` resetuje wszystkie właściwości w obiekcie stanu `filters` na `null`
   - Brak aktywnych filtrów powoduje wyświetlenie wszystkich meczów

### 5.2 Łączenie filtrów

W przeciwieństwie do poprzedniej implementacji, gdzie filtry wzajemnie się wykluczały, nowa wersja pozwala na łączenie wielu filtrów jednocześnie:

1. **Łączenie filtrów na frontendzie**:
   - Wszystkie filtry są przechowywane w jednym obiekcie stanu
   - Zmiany wartości jednego filtra nie resetują pozostałych
   - Interfejs użytkownika pokazuje wszystkie aktywne filtry jednocześnie

2. **Łączenie filtrów na backendzie**:
   - Endpoint `/api/matches/filters` przyjmuje wiele parametrów zapytania
   - Kontroler `getMatchesWithFilters` buduje złożony obiekt filtra MongoDB
   - Każdy dostarczony parametr zawęża wyniki zapytania

### 5.3 Optymalizacje i uwagi

1. **Warunkowe wykonywanie zapytań**:
   - Zapytanie do API z kombinacją filtrów jest wykonywane tylko wtedy, gdy co najmniej jeden filtr jest aktywny
   - Hook React Query używa warunku `enabled: hasFilters` do kontrolowania wykonania zapytania

2. **Obsługa formatu danych**:
   - Parametry liczbowe (`round`, `matchday`) są konwertowane z stringów na liczby całkowite
   - Obiekty `Date` są poprawnie przekazywane przez API i przetwarzane na backendzie

3. **Memoizacja obliczeń**:
   - Dynamiczne obliczanie dostępnych opcji filtrów jest zoptymalizowane za pomocą `useMemo`
   - Decyzja o tym, które dane wyświetlić, również wykorzystuje memoizację

4. **Obsługa stanów ładowania**:
   - Wszystkie stany ładowania są śledzone i łączone w jeden stan `isLoading`
   - Użytkownik widzi informację o ładowaniu tylko wtedy, gdy dane faktycznie są pobierane

5. **Responsywny interfejs użytkownika**:
   - Filtry są wyświetlane w układzie z zawijaniem wierszy
   - Na urządzeniach mobilnych układ dostosowuje się do mniejszych ekranów

## 6. Podsumowanie

Rozbudowany mechanizm filtrowania terminarza meczów w projekcie Ekstraklasa v2 opiera się na następujących kluczowych elementach:

1. **Rozszerzony interfejs użytkownika**: Komponent `FilterBar` umożliwiający wybór wielu różnych filtrów jednocześnie
2. **Scentralizowane zarządzanie stanem**: Komponent `MatchesPage` z pojedynczym obiektem stanu dla wszystkich filtrów
3. **Elastyczne pobieranie danych**: Hooki React Query do komunikacji z API, w szczególności `useMatchesWithFilters`
4. **Rozbudowany backend**: Endpointy API z możliwością łączenia wielu parametrów filtrowania

Dostępne filtry:
- Filtrowanie według drużyny (wszystkie mecze wybranej drużyny)
- Filtrowanie według rundy rozgrywek
- Filtrowanie według kolejki meczowej (matchday)
- Filtrowanie według stadionu
- Filtrowanie według statusu meczu (rozegrany, zaplanowany, odwołany)
- Filtrowanie według zakresu dat

Mechanizm zapewnia elastyczne i wydajne filtrowanie danych przy zachowaniu klarownego podziału odpowiedzialności między komponentami. Użytkownicy mogą teraz precyzyjnie wyszukiwać interesujące ich mecze, łącząc wiele kryteriów filtrowania.