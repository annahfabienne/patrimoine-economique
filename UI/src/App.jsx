
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import  {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import PatrimoinePage from './OthersPages/Patrimoine/patrimoine.jsx';//PROBLEME DE CHEMIN D'ACCES
import PossessionPage from './OthersPages/Possession/possession.jsx';

function App(){
  return(
  <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PossessionPage />} />
        <Route path="/PatrimoinePage" element={<PatrimoinePage />} />
      </Routes>
    </Router>
  );
}

export default App;
