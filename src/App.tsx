import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Setup from './pages/Setup';
import GameTable from './pages/GameTable';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/setup/:gameType" element={<Setup />} />
        <Route path="/game/:gameType" element={<GameTable />} />
      </Routes>
    </Router>
  );
}

export default App;
