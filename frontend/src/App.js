import React from 'react';
import { 
  createBrowserRouter,
  RouterProvider, 
  Outlet,
  Link
} from 'react-router-dom';
import LeagueTablePage from './pages/LeagueTablePage';
import EnhancedLeagueTablePage from './pages/EnhancedLeagueTablePage';
import MatchesPage from './pages/MatchesPage';
import EnhancedMatchesPage from './pages/EnhancedMatchesPage';
import './styles/enhanced-matches.css';

// Layout component with navigation
function Layout() {
  return (
    <div className="app">
      <header>
        <h1>Ekstraklasa 2024/2025</h1>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
            <li>
              <Link to="/">Simple Table</Link>
            </li>
            <li>
              <Link to="/enhanced-table">Enhanced Table</Link>
            </li>
            <li>
              <Link to="/matches">Matches</Link>
            </li>
            <li>
              <Link to="/enhanced-matches">Enhanced Matches</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Create router with the future flag
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LeagueTablePage />,
      },
      {
        path: "enhanced-table",
        element: <EnhancedLeagueTablePage />,
      },
      {
        path: "matches",
        element: <MatchesPage />,
      },
      {
        path: "enhanced-matches",
        element: <EnhancedMatchesPage />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
  },
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;