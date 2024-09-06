import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import axios from 'axios';
import Possession from '../../../../models/possessions/Possession.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function Patrimoine() {
  const [possessions, setPossessions] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedDay, setSelectedDay] = useState(1);
  const [specificDate, setSpecificDate] = useState('');
  const [patrimoineAtDate, setPatrimoineAtDate] = useState(null);

  // Charger les possessions depuis le fichier JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data.json');
        const data = response.data;

        if (data && data[1] && Array.isArray(data[1].data.possessions)) {
          const instancedPossessions = instancing(data[1].data.possessions);
          setPossessions(instancedPossessions);
        } else {
          console.error('Problème avec le format des données :', data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    };

    fetchData();
  }, []);

  // Instancier les objets Possession depuis les données
  const instancing = (possessionsData) => {
    return possessionsData.map((oneData) => {
      return new Possession(
        oneData.possesseur.nom,
        oneData.libelle,
        oneData.valeur,
        new Date(oneData.dateDebut),
        oneData.dateFin,
        oneData.tauxAmortissement || 0
      );
    });
  };

  // Calculer les valeurs du patrimoine en fonction des dates
  const calculatePatrimoineValues = () => {
    if (!dateRange.start || !dateRange.end) {
      alert('Veuillez sélectionner les dates de début et de fin.');
      return;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Sélection de date invalide. Veuillez choisir des dates valides.');
      return;
    }

    const yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    const months = endDate.getMonth() - startDate.getMonth();
    const totalMonths = months + yearToMonth;

    let resultsArray = [];
    const addMonths = (date, monthsToAdd) => {
      const resultDate = new Date(date);
      resultDate.setMonth(resultDate.getMonth() + monthsToAdd);
      return resultDate;
    };

    for (let i = 0; i <= totalMonths; i++) {
      const currentDate = addMonths(new Date(startDate.getFullYear(), startDate.getMonth(), selectedDay), i);

      const patrimoineValue = possessions.reduce((acc, possession) => {
        const valeurApresAmortissement = possession.getValeur(currentDate);
        return acc + valeurApresAmortissement;
      }, 0);

      resultsArray.push({ date: currentDate, value: patrimoineValue });
    }

    if (resultsArray.length > 0) {
      const labels = resultsArray.map((item) => item.date.toLocaleDateString());
      const dataValues = resultsArray.map((item) => item.value);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Valeur du Patrimoine',
            data: dataValues,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  };

  // Calculer la valeur du patrimoine à une date donnée
  const calculatePatrimoineAtDate = () => {
    if (!specificDate) {
      alert('Veuillez sélectionner une date.');
      return;
    }

    const date = new Date(specificDate);
    if (isNaN(date.getTime())) {
      alert('Date invalide. Veuillez choisir une date valide.');
      return;
    }

    const patrimoineValue = possessions.reduce((acc, possession) => {
      const valeurApresAmortissement = possession.getValeur(date);
      return acc + valeurApresAmortissement;
    }, 0);

    setPatrimoineAtDate(patrimoineValue);
  };

  return (
    <div>
      <h2>Évolution du Patrimoine</h2>
      <input
        type="date"
        value={dateRange.start}
        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
      />
      <input
        type="date"
        value={dateRange.end}
        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
      />
      <input
        type="number"
        value={selectedDay}
        min={1}
        max={31}
        onChange={(e) => setSelectedDay(parseInt(e.target.value))}
      />
      <button onClick={calculatePatrimoineValues}>Calculer</button>

      {chartData.labels.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>Aucune donnée à afficher. Veuillez ajuster les paramètres et appuyer sur "Calculer".</p>
      )}

      <div>
        <h3>Calculer la valeur du patrimoine à une date donnée</h3>
        <input
          type="date"
          value={specificDate}
          onChange={(e) => setSpecificDate(e.target.value)}
        />
        <button onClick={calculatePatrimoineAtDate}>Calculer</button>
        {patrimoineAtDate !== null && (
          <p>Valeur du patrimoine à la date sélectionnée : {patrimoineAtDate.toFixed(2)}MDG</p>
        )}
      </div>
    </div>
  );
}

export default Patrimoine;
