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

Komponent `FilterBar` dostarcza interfejs użytkownika do wyboru filtrów. Umożliwia filtrowanie:
- Według drużyny
- Według rundy rozgrywek

```jsx
// Fragment kodu z FilterBar.js
const FilterBar = ({ teams, rounds, selectedTeam, selectedRound, onTeamChange, onRoundChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="teamFilter">Filter by Team:</label>
        <select
          id="teamFilter"
          value={selectedTeam || ''}
          onChange={(e) => onTeamChange(e.target.value || null)}
        >
          <option value="">All Teams</option>
          {teams && teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="roundFilter">Filter by Round:</label>
        <select
          id="roundFilter"
          value={selectedRound || ''}
          onChange={(e) => onRoundChange(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">All Rounds</option>
          {rounds && rounds.map((round) => (
            <option key={round} value={round}>
              Round {round}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
```

### 2.2 MatchesPage.js - Zarządzanie stanem filtrów

Komponent `MatchesPage` zarządza stanem filtrów i wywołuje odpowiednie zapytania do API na podstawie wybranych filtrów. Kluczowe elementy:

1. **Stan filtrów**: Przechowywany za pomocą React useState
2. **Pobieranie danych**: Wykorzystuje hooki React Query do pobierania odpowiednich danych
3. **Logika wyboru danych**: Określa, które dane mają być wyświetlane na podstawie wybranych filtrów

```jsx
// Fragment kodu z MatchesPage.js
const MatchesPage = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);

  // Fetch teams for the filter dropdown
  const { data: teams, isLoading: isLoadingTeams } = useTeams();

  // Fetch matches based on filter selections
  const { data: allMatches, isLoading: isLoadingAll } = useAllMatches();
  const { data: teamMatches, isLoading: isLoadingTeam } = useMatchesByTeam(selectedTeam);
  const { data: roundMatches, isLoading: isLoadingRound } = useMatchesByRound(selectedRound);

  // Determine which matches to display based on filters
  const displayMatches = useMemo(() => {
    if (selectedTeam && teamMatches) return teamMatches;
    if (selectedRound && roundMatches) return roundMatches;
    if (allMatches) return allMatches;
    return [];
  }, [selectedTeam, selectedRound, allMatches, teamMatches, roundMatches]);

  // Handlers for filter changes
  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    setSelectedRound(null); // Reset round filter when team filter changes
  };

  const handleRoundChange = (round) => {
    setSelectedRound(round);
    setSelectedTeam(null); // Reset team filter when round filter changes
  };
  
  // Remaining component code...
};
```

### 2.3 MatchList.js - Wyświetlanie wyfiltrowanych meczów

Komponent `MatchList` otrzymuje już wyfiltrowane dane i odpowiada wyłącznie za ich prezentację w interfejsie użytkownika. Komponent ten jest nieświadomy logiki filtrowania, co jest zgodne z zasadą pojedynczej odpowiedzialności.

## 3. Hooki do komunikacji z API

Aplikacja wykorzystuje React Query do efektywnej komunikacji z API i cachowania danych.

### 3.1 useMatches.js - Hooki do pobierania danych o meczach

```jsx
// Fragment kodu z useMatches.js
import { useQuery } from '@tanstack/react-query';
import { fetchAllMatches, fetchMatchesByTeam, fetchMatchesByRound } from '../services/api';

export const useAllMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchAllMatches,
  });
};

export const useMatchesByTeam = (teamId) => {
  return useQuery({
    queryKey: ['matches', 'team', teamId],
    queryFn: () => fetchMatchesByTeam(teamId),
    enabled: !!teamId, // Only run the query if teamId is provided
  });
};

export const useMatchesByRound = (round) => {
  return useQuery({
    queryKey: ['matches', 'round', round],
    queryFn: () => fetchMatchesByRound(round),
    enabled: !!round, // Only run the query if round is provided
  });
};
```

### 3.2 api.js - Usługi komunikacji z API

```jsx
// Fragment kodu z api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

export const fetchAllMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

export const fetchMatchesByTeam = async (teamId) => {
  const response = await api.get(`/matches/team/${teamId}`);
  return response.data;
};

export const fetchMatchesByRound = async (round) => {
  const response = await api.get(`/matches/round/${round}`);
  return response.data;
};
```

## 4. Endpointy API backendu obsługujące filtrowanie

### 4.1 match.routes.js - Trasy dla endpointów meczów

```javascript
// Fragment kodu z match.routes.js
const express = require('express');
const { 
  getAllMatches, 
  getMatchesByTeamId, 
  getMatchesByRound 
} = require('../controllers/match.controller');

const router = express.Router();

// GET /api/matches
router.get('/', getAllMatches);

// GET /api/matches/team/:teamId
router.get('/team/:teamId', getMatchesByTeamId);

// GET /api/matches/round/:round
router.get('/round/:round', getMatchesByRound);

module.exports = router;
```

### 4.2 match.controller.js - Logika filtrowania po stronie serwera

```javascript
// Fragment kodu z match.controller.js
const Match = require('../models/Match');

// Get matches by team ID
const getMatchesByTeamId = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    
    const matches = await Match.find({
      $or: [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ]
    })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by team ID:', error);
    res.status(500).json({ message: 'Error fetching matches by team ID' });
  }
};

// Get matches by round
const getMatchesByRound = async (req, res) => {
  try {
    const round = req.params.round;
    
    const matches = await Match.find({ round })
      .populate('homeTeamId', 'name shortName')
      .populate('awayTeamId', 'name shortName')
      .populate('stadiumId', 'name city');
    
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches by round:', error);
    res.status(500).json({ message: 'Error fetching matches by round' });
  }
};
```

## 5. Przepływ danych podczas filtrowania

### 5.1 Proces filtrowania - krok po kroku

1. **Inicjalizacja**:
   - Komponent `MatchesPage` ładuje wszystkie mecze przy inicjalizacji
   - Równocześnie pobierane są dane wszystkich drużyn dla listy rozwijanej
   - Dostępne rundy są obliczane dynamicznie na podstawie pobranych meczów

2. **Wybór filtra drużyny**:
   - Użytkownik wybiera drużynę z listy rozwijanej w komponencie `FilterBar`
   - `FilterBar` wywołuje funkcję `onTeamChange` przekazaną jako props
   - Funkcja `handleTeamChange` w `MatchesPage` aktualizuje stan `selectedTeam` i resetuje `selectedRound`
   - Hook `useMatchesByTeam` wykrywa zmianę `selectedTeam` i wykonuje zapytanie do API
   - Zapytanie trafia do endpointu `/api/matches/team/:teamId` na backendzie
   - Backend filtruje mecze, w których wybrana drużyna występuje jako gospodarz lub gość
   - Wyniki są zwracane do frontendu i renderowane przez komponent `MatchList`

3. **Wybór filtra rundy**:
   - Użytkownik wybiera rundę z listy rozwijanej
   - `FilterBar` wywołuje funkcję `onRoundChange`
   - Funkcja `handleRoundChange` w `MatchesPage` aktualizuje stan `selectedRound` i resetuje `selectedTeam`
   - Hook `useMatchesByRound` wykrywa zmianę i wykonuje zapytanie do API
   - Zapytanie trafia do endpointu `/api/matches/round/:round`
   - Backend filtruje mecze według wybranej rundy
   - Wyniki są zwracane i renderowane przez `MatchList`

4. **Resetowanie filtrów**:
   - Użytkownik może zresetować filtry, wybierając opcję "All Teams" lub "All Rounds"
   - Powoduje to ustawienie odpowiednich stanów na `null`
   - Strona wyświetla wówczas wszystkie mecze

### 5.2 Optymalizacje i uwagi

1. **Warunkowe wykonywanie zapytań**:
   - Zapytania o mecze według drużyny i rundy są wykonywane tylko wtedy, gdy odpowiednie filtry są ustawione (`enabled: !!teamId` i `enabled: !!round`)
   - Zapobiega to zbędnym żądaniom do API

2. **Wzajemne wykluczanie filtrów**:
   - W aktualnej implementacji filtry drużyny i rundy wzajemnie się wykluczają
   - Wybór jednego filtru powoduje automatyczne zresetowanie drugiego
   - Zapobiega to konfliktom filtrów i upraszcza logikę wyświetlania

3. **Memoizacja wyników**:
   - Komponent `MatchesPage` używa `useMemo` do określenia, które mecze mają być wyświetlane
   - Zapobiega to zbędnym przeliczeniom przy renderowaniu

## 6. Podsumowanie

Mechanizm filtrowania terminarza meczów w projekcie Ekstraklasa v2 opiera się na następujących kluczowych elementach:

1. **Interfejs użytkownika**: Komponent `FilterBar` umożliwiający wybór filtrów
2. **Zarządzanie stanem**: Komponent `MatchesPage` z logiką filtrowania
3. **Pobieranie danych**: Hooki React Query do komunikacji z API
4. **Backend**: Endpointy API obsługujące filtrowanie po stronie serwera

Filtry dostępne dla użytkownika:
- Filtrowanie według drużyny (wyświetla wszystkie mecze wybranej drużyny)
- Filtrowanie według rundy (wyświetla wszystkie mecze z wybranej rundy)

Mechanizm zapewnia efektywne filtrowanie danych przy minimalnej liczbie zapytań do API i zachowuje klarowny podział odpowiedzialności między komponentami.