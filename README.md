# Ekstraklasa League Table Application

A MERN stack application that displays the Polish Ekstraklasa football league table, matches, and stadium information.

## Features

- League table sorted by points, goal difference, and goals scored
- Match list with filtering by team and round
- Integration with MongoDB Cloud database

## Technical Stack

- **Frontend**: React, React Query, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Cloud

## Project Structure

```
ekstraklasa-app/
├── backend/         # Express.js server
└── frontend/        # React client
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm package manager
- MongoDB Cloud account (with existing data)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/PanArtek/ekstraklasa_v2.git
   cd ekstraklasa_v2
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   - Create `.env` file in the `backend` directory with your MongoDB connection string
   - Create `.env` file in the `frontend` directory with your API base URL

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/teams` - Get all teams sorted by points
- `GET /api/matches` - Get all matches
- `GET /api/matches/team/:teamId` - Get matches for a specific team
- `GET /api/matches/round/:round` - Get matches for a specific round
- `GET /api/stadiums` - Get all stadiums

## Data Models

### Team
```json
{
  "_id": ObjectId,
  "name": String,
  "shortName": String,
  "played": Number,
  "wins": Number,
  "draws": Number,
  "losses": Number,
  "goalsFor": Number,
  "goalsAgainst": Number,
  "goalDifference": Number,
  "points": Number
}
```

### Match
```json
{
  "_id": ObjectId,
  "matchday": Number,
  "homeTeamId": ObjectId (ref: Team),
  "awayTeamId": ObjectId (ref: Team),
  "date": Date,
  "stadiumId": ObjectId (ref: Stadium),
  "homeGoals": Number,
  "awayGoals": Number,
  "status": String,
  "season": String,
  "round": Number
}
```

### Stadium
```json
{
  "_id": ObjectId,
  "name": String,
  "city": String,
  "capacity": Number,
  "address": String
}
```

## Future Enhancements

- User authentication
- Admin panel for data management
- Historical season data comparison
- Player statistics

## License

MIT