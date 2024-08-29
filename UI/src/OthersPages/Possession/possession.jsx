import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Possession from '../../../patrimoine-economique/models/possessions/Possession.js';
import Flux from '../../../patrimoine-economique/models/possessions/Flux.js';
import axios from 'axios';

function App() {
  const [possessions, setPossessions] = useState([]);
  const [arrayResult, setArrayResult] = useState([]);
  const [patrimoineValue, setPatrimoineValue] = useState(0);
  const [datePicker, setDatePicker] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data.json'); // Utilisation d'axios pour la requête
        const data = response.data;
        console.log('Data loaded:', data);

        if (data && data[1] && Array.isArray(data[1].data.possessions)) {
          instancing(data[1].data.possessions);
        } else {
          console.error('Data format issue:', data);
        }
      } catch (error) {
        console.error('Fetching data failed:', error);
      }
    };

    fetchData();
  }, []);

  function instancing(possessionsData) {
    console.log('Possessions data:', possessionsData);

    const newPossessions = possessionsData.map((oneData) => {
      if (oneData.libelle === "Alternance" || oneData.libelle === "Survie") {
        return new Flux(
          oneData.possesseur.nom,
          oneData.libelle,
          oneData.valeur,
          new Date(oneData.dateDebut),
          oneData.dateFin,
          oneData.tauxAmortissement || "0",
          oneData.jour,
          oneData.valeurConstante
        );
      }
      return new Possession(
        oneData.possesseur.nom,
        oneData.libelle,
        oneData.valeur,
        new Date(oneData.dateDebut),
        oneData.dateFin,
        oneData.tauxAmortissement || 0
      );
    });
    console.log('New possessions:', newPossessions);
    setPossessions(newPossessions);
  }

  function getDatePicker(e) {
    setDatePicker(e.target.value);
    console.log('Selected date:', e.target.value);
  }

  function getNewValue() {
    if (!datePicker) {
      alert('Please select a date.');
      return;
    }
    const date = new Date(datePicker);

    const values = possessions.map((possession) =>
      possession.getValeurApresAmortissement(date)
    );

    const results = values.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );

    console.log('Calculated patrimoine value:', results);
    setPatrimoineValue(results);

    const updatedArrayResult = possessions.map((possession) =>
      possession.getValeurApresAmortissement(date)
    );
    console.log('Updated arrayResult:', updatedArrayResult);
    setArrayResult(updatedArrayResult);
  }

  function ShowList({ possessions, arrayResult }) {
    console.log('ShowList - Possessions:', possessions);
    console.log('ShowList - ArrayResult:', arrayResult);

    return (
      <tbody>
        {possessions.map((possession, i) => (
          <tr key={i}>
            <td>{possession.libelle}</td>
            <td>{possession.valeur}</td>
            <td>{possession.dateDebut.toDateString()}</td>
            <td>{possession.dateFin ? possession.dateFin.toDateString() : 'inconnue(s)'}</td>
            <td>{possession.tauxAmortissement}</td>
            <td>{arrayResult[i] !== undefined ? arrayResult[i] : 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <div className="d-flex flex-column vh-100">
      <header className="text-center py-3 border-bottom">
        <h1>Patrimoine-Economique</h1>
      </header>
      <main className="flex-grow-1">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th scope="header">Libelle</th>
              <th scope="header">Valeur Libelle</th>
              <th scope="header">Date de début</th>
              <th scope="header">Date de fin</th>
              <th scope="header">Amortissement</th>
              <th scope="header">Valeur actuelle</th>
            </tr>
          </thead>
          <ShowList possessions={possessions} arrayResult={arrayResult} />
        </table>
      </main>
      <footer className="inputContainer d-flex justify-content-between align-items-center p-3 border-top">
        <div className="input-group mb-3">
          <span className="input-text">DatePICKER</span>
          <input
            type="date"
            className="form"
            onChange={getDatePicker}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={getNewValue}
        >
          VALIDER
        </button>
        <div className="results">
          VALEUR DU PATRIMOINE : {patrimoineValue} MDG
        </div>
      </footer>
    </div>
  );
}

export default App;



