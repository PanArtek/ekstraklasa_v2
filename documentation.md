# Dokumentacja projektu Ekstraklasa v2

## 1. Wprowadzenie i cel projektu

Projekt Ekstraklasa v2 to aplikacja internetowa oparta na architekturze MERN (MongoDB, Express.js, React, Node.js), której celem jest prezentacja danych dotyczących polskiej ligi piłkarskiej Ekstraklasa. Aplikacja umożliwia przeglądanie tabeli ligowej, informacji o rozegranych meczach oraz obiektach stadionowych.

Głównym celem projektu jest dostarczenie prostego i funkcjonalnego narzędzia do śledzenia wyników i statystyk drużyn Ekstraklasy w sezonie 2024/2025, z możliwością przyszłej rozbudowy o dodatkowe funkcjonalności.

## 2. Kroki wykonane dotychczas

### Utworzenie repozytorium GitHub

Projekt rozpoczął się od utworzenia nowego repozytorium na platformie GitHub pod adresem:
https://github.com/PanArtek/ekstraklasa_v2.git

Repozytorium zostało skonfigurowane jako publiczne, co umożliwia łatwe udostępnianie kodu innym osobom zainteresowanym projektem.

### Klonowanie repozytorium

Po utworzeniu repozytorium, zostało ono sklonowane lokalnie za pomocą komendy:

```bash
git clone https://github.com/PanArtek/ekstraklasa_v2.git
```

Dzięki temu uzyskaliśmy lokalną kopię repozytorium, w której mogliśmy rozpocząć pracę nad projektem.

### Utworzenie struktury folderów

W ramach projektu utworzono strukturę folderów zgodną z typową organizacją projektu MERN:

- Główny katalog projektu `ekstraklasa_v2`
- Katalog `backend` dla serwera Express.js
- Katalog `frontend` dla aplikacji React

Wewnątrz tych głównych katalogów utworzono dalszą strukturę folderów odpowiadającą za organizację kodu:

- W katalogu `backend` utworzono foldery: `models`, `controllers`, `routes`, `config` i inne
- W katalogu `frontend` utworzono foldery: `components`, `pages`, `services`, `hooks` i inne

### Dodanie początkowych plików

W ramach początkowej konfiguracji projektu dodano następujące pliki:

- Pliki konfiguracyjne: `package.json` (zarówno w katalogu głównym, jak i w katalogach `backend` i `frontend`)
- Plik `README.md` z opisem projektu
- Plik `CLAUDE.md` z wytycznymi dla narzędzia Claude Code
- Pliki środowiskowe `.env` dla konfiguracji backendu i frontendu
- Pliki źródłowe implementujące serwer Express.js i aplikację React

## 3. Struktura projektu

Aktualna struktura projektu przedstawia się następująco:

```
ekstraklasa_v2/
├── README.md                   # Opis projektu i instrukcje
├── CLAUDE.md                   # Wytyczne dla narzędzia Claude Code
├── documentation.md            # Niniejsza dokumentacja
├── package.json                # Konfiguracja projektu głównego
├── backend/                    # Serwer Express.js (Node.js)
│   ├── .env                    # Zmienne środowiskowe backendu
│   ├── package.json            # Zależności backendu
│   └── src/
│       ├── app.js              # Główna aplikacja Express.js
│       ├── server.js           # Punkt wejścia serwera
│       ├── config/
│       │   └── db.js           # Konfiguracja połączenia z MongoDB
│       ├── controllers/
│       │   ├── match.controller.js    # Kontroler meczów
│       │   ├── stadium.controller.js  # Kontroler stadionów
│       │   └── team.controller.js     # Kontroler drużyn
│       ├── models/
│       │   ├── Match.js        # Model danych meczu
│       │   ├── Stadium.js      # Model danych stadionu
│       │   └── Team.js         # Model danych drużyny
│       └── routes/
│           ├── match.routes.js    # Trasy API dla meczów
│           ├── stadium.routes.js  # Trasy API dla stadionów
│           └── team.routes.js     # Trasy API dla drużyn
├── frontend/                   # Aplikacja React
│   ├── .env                    # Zmienne środowiskowe frontendu
│   ├── package.json            # Zależności frontendu
│   ├── public/
│   │   └── index.html          # Główny plik HTML
│   └── src/
│       ├── App.js              # Główny komponent aplikacji
│       ├── index.js            # Punkt wejścia aplikacji React
│       ├── index.css           # Globalne style CSS
│       ├── components/
│       │   ├── FilterBar.js    # Komponent filtrowania meczów
│       │   ├── MatchList.js    # Komponent listy meczów
│       │   └── TeamTable.js    # Komponent tabeli drużyn
│       ├── hooks/
│       │   ├── useMatches.js   # Hook do pobierania danych o meczach
│       │   ├── useStadiums.js  # Hook do pobierania danych o stadionach
│       │   └── useTeams.js     # Hook do pobierania danych o drużynach
│       ├── pages/
│       │   ├── LeagueTablePage.js  # Strona z tabelą ligową
│       │   └── MatchesPage.js      # Strona z listą meczów
│       └── services/
│           └── api.js          # Serwisy API do komunikacji z backendem
```

## 4. Konfiguracja Git i GitHub

Projekt został skonfigurowany z następującym ustawieniem Git:

- Repozytorium zdalne: `https://github.com/PanArtek/ekstraklasa_v2.git`
- Główna gałąź: `main`
- Użyte komendy Git:
  - `git init` - inicjalizacja repozytorium
  - `git add .` - dodanie plików do indeksu
  - `git commit -m "wiadomość"` - zatwierdzenie zmian
  - `git remote add origin URL` - dodanie zdalnego repozytorium
  - `git push -u origin main` - wysłanie zmian do zdalnego repozytorium

Wszystkie zmiany są regularne commitowane do repozytorium GitHub, co zapewnia bezpieczeństwo kodu oraz umożliwia śledzenie historii zmian.

## 5. Dostępne funkcjonalności

### Tabela ligowa Ekstraklasy

Aplikacja umożliwia przeglądanie aktualnej tabeli ligowej Ekstraklasy, prezentując następujące dane:

- Pozycja drużyny w tabeli
- Nazwa drużyny
- Liczba rozegranych meczów
- Liczba zwycięstw
- Liczba remisów 
- Liczba porażek
- Liczba zdobytych goli
- Liczba straconych goli
- Różnica goli
- Liczba punktów

Tabela jest automatycznie sortowana według:
1. Liczby punktów (malejąco)
2. Różnicy goli (malejąco)
3. Liczby zdobytych goli (malejąco)

Dane drużyn są pobierane z kolekcji `teams` w bazie danych MongoDB Cloud.

### Lista meczów

Aplikacja umożliwia przeglądanie listy meczów Ekstraklasy z następującymi informacjami:

- Kolejka meczu
- Runda
- Data i godzina rozegrania
- Drużyna gospodarzy
- Drużyna gości
- Wynik (liczba goli gospodarzy i gości)
- Stadion, na którym odbył się mecz
- Status meczu (zaplanowany, rozegrany, odwołany)

Funkcjonalność filtrowania meczów:
- Filtrowanie według drużyny - pokazuje wszystkie mecze wybranej drużyny (zarówno jako gospodarz, jak i gość)
- Filtrowanie według rundy - pokazuje wszystkie mecze z wybranej rundy

Dane meczów są pobierane z kolekcji `matches` w bazie danych MongoDB Cloud, z referencjami do kolekcji `teams` (dla drużyn) i `stadiums` (dla stadionów).

### Informacje o stadionach

Dane stadionów są wykorzystywane przy wyświetlaniu informacji o meczach i zawierają:

- Nazwę stadionu
- Miasto
- Pojemność
- Adres

Dane stadionów są pobierane z kolekcji `stadiums` w bazie danych MongoDB Cloud.

### Nawigacja w aplikacji

Aplikacja posiada prosty interfejs nawigacyjny umożliwiający przełączanie się między:
- Tabelą ligową (strona główna)
- Listą meczów (zakładka "Matches")

### Źródło danych

Wszystkie dane są przechowywane w bazie danych MongoDB Cloud w następujących kolekcjach:
- `ekstraklasa-app.teams` - dane drużyn
- `ekstraklasa-app.matches` - dane meczów
- `ekstraklasa-app.stadiums` - dane stadionów

Aplikacja korzysta z tych danych w trybie tylko do odczytu, nie wprowadzając żadnych modyfikacji.

## 6. Instrukcja uruchomienia projektu

Aby uruchomić projekt lokalnie, należy wykonać następujące kroki:

1. Sklonować repozytorium:
```bash
git clone https://github.com/PanArtek/ekstraklasa_v2.git
cd ekstraklasa_v2
```

2. Zainstalować zależności:
```bash
npm run install-all
```
lub zainstalować zależności osobno dla każdej części projektu:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

3. Uruchomić aplikację w trybie deweloperskim:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000
API będzie dostępne pod adresem: http://localhost:5000/api