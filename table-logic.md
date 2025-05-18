# League Table Logic

## 1. Point Calculation System

### Basic Scoring Rules
- Win: 3 points
- Draw: 1 point
- Loss: 0 points

### Team Statistics
- Matches played (played)
- Wins, draws, losses counters
- Goals scored (goalsFor)
- Goals conceded (goalsAgainst)
- Goal difference (goalDifference = goalsFor - goalsAgainst)
- Points (accumulated based on results)

## 2. Table Sorting Hierarchy

Teams are sorted by:
1. Points (highest to lowest)
2. Goal difference (highest to lowest)
3. Goals scored (highest to lowest)
4. Team name (alphabetically)

## 3. Zone Classification

- Top Zone: First 3 positions (promotion/championship zone)
- Mid Zone: Middle positions
- Bottom Zone: Last 3 positions (relegation zone)

## 4. Form Tracking

- Shows results of the last 5 matches for each team
- Results stored chronologically (newest first)
- Each result represented as:
  - W: Win
  - D: Draw
  - L: Loss
- Visual representation using color-coding

## 5. Head-to-Head Statistics

For each team, the system maintains:
- Complete record against every other team
- Counters for: matches played, wins, draws, losses
- Updated after each match between teams

## 6. Architectural Components

### Backend Services
- `generateLeagueTable(season)`: Calculates standings based on match results
- `getTeamZone(position, totalTeams)`: Assigns zone classification
- `updateTeamStats(season)`: Updates database with calculated statistics
- `resetTeamStats()`: Resets all team statistics to zero

### API Endpoints
- `GET /api/league-table`: Retrieves current standings
  - Query params: `season`, `forceUpdate`
- `POST /api/league-table/reset`: Resets all statistics

### Data Models
- Team: Stores team data and current statistics
- Match: Contains match results with home/away goals

### Frontend Components
- TeamTable: Renders the league standings
- LeagueTablePage: Container for table display and controls

## 7. Data Flow Process

1. Data Retrieval
   - Load all teams from the database
   - Retrieve completed matches for specified season

2. Calculation Process
   - Initialize statistics for each team
   - Process each match and update team statistics
   - Calculate goal difference
   - Sort teams according to defined rules
   - Assign positions and zone classifications

3. Display Process
   - Render table with all statistics
   - Apply visual styling for zones (promotion/relegation)
   - Show form icons with appropriate colors

## 8. Filtering Capabilities

- Season filtering: Display table for specific season
- Force update option: Recalculate and persist statistics

## 9. Implementation Details

- Teams map used for efficient statistics tracking
- Form limited to 5 most recent matches
- Zone determination based on position thresholds
- Match status filtering (only 'rozegrany' matches counted)