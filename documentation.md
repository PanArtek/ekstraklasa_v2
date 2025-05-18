# Ekstraklasa v2 - Application Documentation

## 1. Application Architecture

### 1.1 Technology Stack (MERN)
- **MongoDB**: NoSQL document database
- **Express.js**: Node.js web application framework
- **React**: Frontend UI library
- **Node.js**: JavaScript runtime environment

### 1.2 Layer Architecture
1. **Database Layer**: MongoDB collections for data persistence
2. **Backend Layer**: Express.js REST API
3. **Frontend Layer**: React SPA with React Router and React Query

### 1.3 Data Flow
```
Client ↔ React Components ↔ React Query Hooks ↔ API Services ↔ Express Routes ↔ Controllers ↔ MongoDB
```

### 1.4 Key Design Patterns
- **Repository Pattern**: Data access logic encapsulated in models
- **Service Layer**: Business logic separated from controllers
- **Container/Presentational**: Smart containers manage state, dumb components render UI
- **Custom Hooks**: Reusable logic with React Query for data fetching
- **Middleware Pattern**: Request processing pipeline in Express

## 2. Data Models

### 2.1 Team Model
```
Team {
  name: String           // Full team name
  shortName: String      // Abbreviated name
  played: Number         // Matches played
  wins: Number           // Wins count
  draws: Number          // Draws count
  losses: Number         // Losses count
  goalsFor: Number       // Goals scored
  goalsAgainst: Number   // Goals conceded
  goalDifference: Number // Goal difference
  points: Number         // Points accumulated
}
```

### 2.2 Match Model
```
Match {
  matchday: Number       // Matchday number
  homeTeamId: ObjectId   // Reference to Team
  awayTeamId: ObjectId   // Reference to Team
  date: Date             // Match date and time
  stadiumId: ObjectId    // Reference to Stadium
  homeGoals: Number      // Goals scored by home team
  awayGoals: Number      // Goals scored by away team
  status: String         // 'zaplanowany'|'rozegrany'|'odwołany'
  season: String         // Season identifier (e.g., '2024/2025')
  round: Number          // Tournament round
}
```

### 2.3 Stadium Model
```
Stadium {
  name: String           // Stadium name
  city: String           // City location
  capacity: Number       // Spectator capacity
  address: String        // Physical address
}
```

### 2.4 Data Relationships
- **Team ↔ Match**: One-to-many (team plays multiple matches as home/away)
- **Stadium ↔ Match**: One-to-many (stadium hosts multiple matches)
- **Team ↔ Team**: Many-to-many through matches (teams play against each other)

## 3. Key Functionalities

### 3.1 League Table
- Displays team standings with calculated statistics. [Details in table-logic.md](table-logic.md)
- Includes zone classification (promotion/relegation) and form indicators.

### 3.2 Match Schedule
- Lists matches with comprehensive filtering and pagination. [Details in filtering.md](filtering.md)
- Supports navigation between matchdays with animated transitions.

### 3.3 Advanced Filtering
- Multi-criteria filtering (team, matchday, round, stadium, status, date range).
- Supports favorite team saving and keyboard shortcuts.

### 3.4 Form Visualization
- Displays last 5 match results with color-coded indicators (W/D/L).
- Provides at-a-glance performance assessment for each team.

### 3.5 Statistics Management
- Calculates team statistics based on match results.
- Supports manual recalculation with API-triggered updates.

### 3.6 Responsive UI
- Adapts layout for desktop, tablet, and mobile devices.
- Provides optimized interactions for different screen sizes.

## 4. Code Organization

### 4.1 Directory Structure
```
/backend
  /src
    /config      - Database connection, environment variables
    /controllers - Request handlers for each resource
    /models      - Mongoose schemas and models
    /routes      - API route definitions
    /services    - Business logic layer
    app.js       - Express application setup
    server.js    - Application entry point

/frontend
  /src
    /components  - Reusable UI components
    /hooks       - Custom React hooks for data fetching
    /pages       - Page-level components (routing destinations)
    /services    - API communication layer
    /styles      - CSS stylesheets
    App.js       - Application routing setup
    index.js     - React entry point
```

### 4.2 State Management
- **React Query**: Data fetching, caching, and synchronization
- **React Hooks**: Local component state with useState
- **localStorage**: Persistence for user preferences (favorite team, current matchday)

### 4.3 API Organization
- **RESTful Endpoints**: Resource-based API design
- **Controller Layer**: Request validation and response formatting
- **Service Layer**: Core business logic implementation

## 5. Backend Architecture

### 5.1 API Endpoints
- **Teams**: `/api/teams` - Team data management
- **Matches**: `/api/matches` - Match data with filtering
- **Stadiums**: `/api/stadiums` - Stadium information
- **League Table**: `/api/league-table` - Calculated standings

### 5.2 Request Processing Pipeline
1. **Routing**: Match URL to appropriate controller
2. **Middleware**: Process request (CORS, body parsing)
3. **Controller**: Handle request and invoke service methods
4. **Service**: Execute business logic and database operations
5. **Response**: Format and return data to client

### 5.3 Database Interaction
- **Mongoose ODM**: Object-document mapping
- **Aggregation Pipeline**: For complex data operations
- **Indexes**: On frequently queried fields

## 6. Frontend Architecture

### 6.1 Component Hierarchy
- **App**: Main routing container
- **Pages**: Route-level components (TablePage, EnhancedMatchesPage)
- **Components**: Reusable UI elements (TeamTable, EnhancedFilterBar, EnhancedMatchList)

### 6.2 Data Fetching Strategy
- **React Query**: Declarative data fetching and caching
- **Custom Hooks**: Encapsulation of query logic by resource
- **Axios**: HTTP client for API communication

### 6.3 User Interface
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: ARIA attributes, keyboard navigation, focus management
- **Animations**: CSS transitions, micro-interactions, skeleton loading

## 7. Development and Deployment

### 7.1 Development Environment
- **Concurrent Servers**: Backend (5000) and Frontend (3000)
- **Hot Reloading**: For both client and server code
- **Environment Variables**: .env files for configuration

### 7.2 Build Process
- **Backend**: Node.js application
- **Frontend**: React build with optimization
- **Package Scripts**: Defined in package.json

### 7.3 Deployment Options
- **Monorepo**: Single repository for full-stack application
- **Separate Deployment**: Backend API and Frontend SPA
- **Database**: MongoDB Atlas cloud service

## 8. Future Enhancements

- Authentication and user management
- Enhanced visualizations and statistics
- Historical data and season comparisons
- Mobile application support
- Real-time updates with WebSockets