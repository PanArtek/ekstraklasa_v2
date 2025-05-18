# Ekstraklasa v2

<div align="center">

  <h3>Nowoczesna aplikacja do śledzenia tabeli i terminarza Ekstraklasy</h3>
</div>

## 📋 O projekcie

Ekstraklasa v2 to aplikacja MERN stack umożliwiająca zaawansowane przeglądanie tabeli ligowej i terminarza polskiej Ekstraklasy. Aplikacja oferuje interaktywne funkcje filtrowania meczów, dynamiczną nawigację między kolejkami oraz wizualizację statystyk drużyn.

## ✨ Kluczowe funkcjonalności

| Funkcjonalność | Opis |
|----------------|------|
| 📊 **Interaktywna tabela ligowa** | Wizualizacja pozycji z oznaczeniem stref awansu/spadku |
| 📅 **Paginowany terminarz** | Nawigacja między kolejkami z animowanymi przejściami |
| 🔍 **Zaawansowane filtrowanie** | Multi-kryterialne filtrowanie (drużyna, data, stadion, status) |
| 📈 **Wizualizacja formy** | Kolorowe wskaźniki ostatnich 5 meczów (W/R/P) |
| ⭐ **Ulubione drużyny** | Zapisywanie preferowanych drużyn z szybkim dostępem |
| 📱 **Responsywny interfejs** | Dostosowany do urządzeń mobilnych i desktopowych |
| ⌨️ **Dostępność** | Nawigacja klawiaturą, oznaczenia ARIA, optymalizacja dla czytników ekranu |

## 🚀 Technologie

<div align="center">
  <h3>Stack MERN</h3>
  <p>
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  </p>
</div>

### Dodatkowe biblioteki i narzędzia

- **React Query** - zarządzanie stanem i cache
- **React Router** - routing po stronie klienta
- **Axios** - komunikacja HTTP
- **CSS Transitions** - animacje i micro-interakcje

## 📊 Modele danych

Aplikacja zarządza trzema głównymi modelami danych:

```
Team {                     Match {                     Stadium {
  name: String               matchday: Number           name: String
  shortName: String          homeTeamId: ObjectId       city: String
  played: Number             awayTeamId: ObjectId       capacity: Number
  wins: Number               date: Date                 address: String
  draws: Number              stadiumId: ObjectId      }
  losses: Number             homeGoals: Number
  goalsFor: Number           awayGoals: Number
  goalsAgainst: Number       status: String
  goalDifference: Number     season: String
  points: Number             round: Number
}                          }
```

## 🖼️ Zrzuty ekranu

<div align="center">
  <img src="https://via.placeholder.com/400x200?text=Tabela+Ligowa" alt="Tabela Ligowa"/>
  <img src="https://via.placeholder.com/400x200?text=Terminarz+Meczów" alt="Terminarz Meczów"/>
</div>

## 🛠️ Instalacja i uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/PanArtek/ekstraklasa_v2.git
cd ekstraklasa_v2

# Instalacja zależności
npm run install-all

# Uruchomienie aplikacji (frontend + backend)
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000  
API będzie działać pod adresem: http://localhost:5000/api

## 📖 Dokumentacja

Projekt posiada szczegółową dokumentację w następujących plikach:

- [📚 Dokumentacja główna](documentation.md) - Architektura i organizacja projektu
- [📊 Logika tabeli](table-logic.md) - Szczegóły obliczania statystyk i pozycji
- [🔍 Filtrowanie i paginacja](filtering.md) - Opis mechanizmów nawigacji i filtrowania

## 🔌 API Endpoints

- **Teams**: `/api/teams` - Zarządzanie danymi drużyn
- **Matches**: `/api/matches` - Dane meczów z filtrowaniem
- **Stadiums**: `/api/stadiums` - Informacje o stadionach
- **League Table**: `/api/league-table` - Obliczona tabela ligowa

## 🔭 Planowany rozwój

- 🔐 Autentykacja i zarządzanie użytkownikami
- 📊 Rozszerzone wizualizacje i statystyki
- 📜 Dane historyczne i porównania sezonów
- 📱 Aplikacja mobilna
- ⚡ Aktualizacje w czasie rzeczywistym z WebSockets

## 📝 Licencja

[MIT](LICENSE)

---

<div align="center">
  <p>Projekt Ekstraklasa v2 © 2025</p>
  <p>
    <a href="https://github.com/PanArtek/ekstraklasa_v2">GitHub</a> •
    <a href="https://github.com/PanArtek/ekstraklasa_v2/issues">Zgłoś błąd</a>
  </p>
</div>
