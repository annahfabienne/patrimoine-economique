import { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Patrimoine() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [day, setDay] = useState('');
  const [chartData, setChartData] = useState({});
  const [patrimoineValue, setPatrimoineValue] = useState(null);

  const fetchChartData = async () => {
    if (!dateDebut || !dateFin || !day) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.get('https://backend-patrimoine-hrj6.onrender.com/patrimoine/range', {
        params: {
          dateDebut: dateDebut,
          dateFin: dateFin,
          day: day
        }
      });
      const data = response.data;
      const labels = data.map(item => item.month);
      const values = data.map(item => item.value);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Valeur du Patrimoine',
            data: values,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }
        ]
      });

      console.log('Chart data:', {
        labels: labels,
        datasets: [
          {
            label: 'Valeur du Patrimoine',
            data: values,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }
        ]
      });

    } catch (error) {
      console.error('Fetching chart data failed:', error);
    }
  };

  const fetchPatrimoineValue = async () => {
    if (!dateDebut || !dateFin || !day) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.get('https://backend-patrimoine-hrj6.onrender.com/patrimoine/value', {
        params: {
          dateDebut: dateDebut,
          dateFin: dateFin,
          day: day
        }
      });
      const data = response.data;
      setPatrimoineValue(data.value);
      console.log('Patrimoine value:', data.value);
    } catch (error) {
      console.error('Fetching patrimoine value failed:', error);
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <header className="text-center py-3 border-bottom">
        <h1>Patrimoine</h1>
      </header>
      <main className="flex-grow-1">
        <div className="container mt-4">
          <div className="row mb-3">
            <div className="col">
              <input
                type="date"
                className="form-control"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="date"
                className="form-control"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Day of Month"
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={fetchChartData}
          >
            Fetch Chart Data
          </button>
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={fetchPatrimoineValue}
          >
            Calculate Patrimoine Value
          </button>
          {chartData.labels && (
            <div className="chart-container">
              <Line data={chartData} />
            </div>
          )}
          {patrimoineValue !== null && (
            <div className="mt-3">
              <h4>Patrimoine Value: {patrimoineValue}</h4>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Patrimoine;
