# Dokumentacja Logiki Tabeli Ligowej

## 1. Algorytmy Obliczeniowe

### 1.1 System punktacji
- **Punktacja**: 3 punkty za zwycięstwo, 1 punkt za remis, 0 punktów za porażkę
- **Statystyki meczowe**: Każdy rozegrany mecz aktualizuje liczniki meczów, zwycięstw, remisów, porażek
- **Statystyki bramkowe**: Aktualizacja goli zdobytych, straconych i różnicy bramek
- **Forma**: Zapis wyników ostatnich 5 meczów w kolejności chronologicznej

### 1.2 Sortowanie tabeli
Sortowanie odbywa się według ściśle określonej hierarchii kryteriów:
1. Punkty (malejąco)
2. Różnica bramek (malejąco)
3. Bramki zdobyte (malejąco)
4. Nazwa drużyny (alfabetycznie)

### 1.3 Strefy ligowe
- **Strefa TOP (awans)**: 3 pierwsze miejsca w tabeli
- **Strefa MID (środek)**: Pozycje pomiędzy strefami awansu i spadku
- **Strefa BOTTOM (spadek)**: 3 ostatnie miejsca w tabeli

### 1.4 Statystyki bezpośrednie
- Śledzenie historii meczów bezpośrednich między każdą parą drużyn
- Dla każdej drużyny przechowywana jest mapa `headToHead` zawierająca statystyki:
  - Liczba meczów bezpośrednich
  - Liczba zwycięstw
  - Liczba remisów
  - Liczba porażek

## 2. Architektura Systemu

### 2.1 Warstwa usługowa (Backend)

#### leagueTable.service.js
- `generateLeagueTable(season)`: Oblicza tabelę na podstawie meczów z danego sezonu
- `updateTeamStats(season)`: Aktualizuje statystyki w bazie danych
- `resetTeamStats()`: Zeruje wszystkie statystyki drużyn
- `getTeamZone(position, totalTeams)`: Określa strefę drużyny na podstawie pozycji

#### leagueTable.controller.js
- `getLeagueTable`: Obsługuje zapytania GET do `/api/league-table`
- `resetTeamStats`: Obsługuje zapytania POST do `/api/league-table/reset`

### 2.2 Endpointy API
- `GET /api/league-table`: Pobiera aktualną tabelę ligową
  - Parametr `season`: Filtruje mecze według sezonu (np. '2024/2025')
  - Parametr `forceUpdate`: Gdy `true`, aktualizuje statystyki w bazie danych
- `POST /api/league-table/reset`: Resetuje statystyki wszystkich drużyn

### 2.3 Komponenty React (Frontend)

#### EnhancedTeamTable.js
- Wyświetla tabelę z pełnymi statystykami drużyn
- Renderuje kolumny: pozycja, drużyna, statystyki meczowe i bramkowe, punkty, forma
- Kolorystyczne oznaczenie stref awansu/spadku
- Wizualizacja formy z ostatnich 5 meczów

#### EnhancedLeagueTablePage.js
- Zarządza zapytaniami do API i stanem tabeli
- Obsługuje wybór sezonu i kontrolki do aktualizacji statystyk
- Wyświetla komunikaty o błędach i sukcesie operacji

### 2.4 Hooki React Query

#### useLeagueTable.js
- `useLeagueTable(options)`: Pobiera dane tabeli z API
- `useUpdateLeagueTable()`: Wywołuje aktualizację danych w bazie
- `useResetTeamStats()`: Resetuje statystyki wszystkich drużyn

## 3. Przepływ Danych

### 3.1 Inicjalizacja tabeli
1. Pobranie wszystkich drużyn z bazy danych
2. Inicjalizacja statystyk dla każdej drużyny
3. Pobranie wszystkich rozegranych meczów z danego sezonu
4. Obliczenie statystyk na podstawie wyników meczów
5. Sortowanie tabeli według zdefiniowanych kryteriów
6. Oznaczenie stref (awans/spadek) dla każdej drużyny

### 3.2 Aktualizacja statystyk
1. Resetowanie dotychczasowych statystyk drużyn
2. Wygenerowanie nowej tabeli na podstawie aktualnych wyników
3. Zapisanie zaktualizowanych statystyk do bazy danych
4. Zwrócenie zaktualizowanej tabeli

### 3.3 Wyświetlanie formy
1. Przechowywanie dla każdej drużyny tablicy wyników ostatnich meczów (W, D, L)
2. Aktualizacja tej tablicy chronologicznie, dodając nowy wynik na początku
3. Ograniczenie liczby wyników do ostatnich 5 meczów
4. Wizualizacja wyników w interfejsie z użyciem kolorów (zielony dla wygranej, pomarańczowy dla remisu, czerwony dla przegranej)

## 4. Optymalizacje i Zabezpieczenia

### 4.1 Optymalizacje wydajnościowe
- Użycie struktury Map do szybkiego dostępu do danych drużyn
- Memoizacja wyników w komponentach React
- Obsługa cachowania zapytań API z użyciem React Query
- Parametr `staleTime` ustawiony na 5 minut dla ograniczenia zbędnych zapytań

### 4.2 Obsługa błędów
- Walidacja istnienia drużyn przed aktualizacją statystyk
- Pomijanie meczów z drużynami, które nie istnieją w bazie
- Obsługa błędów w zapytaniach API i wyświetlanie komunikatów
- Możliwość ręcznego ponowienia zapytań w przypadku błędów

### 4.3 Wsparcie dla różnych sezonów
- Filtrowanie meczów według parametru sezonu
- Możliwość wyboru sezonu w interfejsie użytkownika
- Oddzielne klucze cache dla różnych sezonów

## 5. Przypadki brzegowe

### 5.1 Obsługa niekompletnych danych
- Jeśli brak danych o meczach: wyświetlane są drużyny z zerowymi statystykami
- Jeśli brak danych o formie: wyświetlany jest placeholder "-"
- Jeśli brak wybranego sezonu: uwzględniane są wszystkie mecze

### 5.2 Konsystencja danych
- Przed zapisem statystyk wszystkie dane są resetowane
- Aktualizacja statystyk zawsze obejmuje wszystkie drużyny
- Atomowe operacje zapisu przy użyciu Promise.all dla transakcyjności