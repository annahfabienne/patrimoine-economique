import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatrimoinePage from './OthersPages/Patrimoine/Patrimoine.jsx';
import PossessionPage from './OthersPages/Possession/possession.jsx';
import NewPossession from './OthersPages/NewPossession.jsx';

function App() {
  return (
    <Router>
      <nav>
        <button><Link to="/Patrimoine">Patrimoine</Link></button>
        <button><Link to="/">Possession</Link></button>
      </nav>
      <Routes>
        <Route path="/" element={<PossessionPage />} />
        <Route path="/Patrimoine" element={<PatrimoinePage />} />
        <Route path="/possessioncreate" element={<NewPossession />} />
      </Routes>
    </Router>
  );
}

export default App;
