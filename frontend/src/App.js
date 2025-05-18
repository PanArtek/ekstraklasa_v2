import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LeagueTablePage from './pages/LeagueTablePage';
import MatchesPage from './pages/MatchesPage';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Ekstraklasa 2024/2025</h1>
          <nav>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
              <li>
                <Link to="/">League Table</Link>
              </li>
              <li>
                <Link to="/matches">Matches</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LeagueTablePage />} />
            <Route path="/matches" element={<MatchesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;