import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import StatusPage from './pages/StatusPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header>
        <h1>Vendor Discovery + Shortlist Builder</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
          <Link to="/status">Status</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </main>
    </div>
  );
}
