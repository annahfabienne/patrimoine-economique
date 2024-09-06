import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function Patrimoine() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [patrimoineValue, setPatrimoineValue] = useState(null);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3500/api/possession');
                const mockData = await response.json();
                setData(mockData.data[1].data.possessions); 
            } catch (error) {
                console.error('Fetching data failed:', error);
            }
        };
        fetchData();
    }, []);

    const updateChartData = (data, startDate, endDate) => {
        const filteredData = data.filter(possession =>
            new Date(possession.dateDebut) <= new Date(endDate) &&
            (!possession.dateFin || new Date(possession.dateFin) >= new Date(startDate))
        );

        const labels = filteredData.map(p => new Date(p.dateDebut).toLocaleDateString());
        const values = filteredData.map(p => p.valeur);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Valeur du patrimoine',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        });
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleCheckValue = () => {
        updateChartData(data, startDate, endDate);

        // Calculer et mettre à jour la valeur totale
        const filteredData = data.filter(possession =>
            new Date(possession.dateDebut) <= new Date(endDate) &&
            (!possession.dateFin || new Date(possession.dateFin) >= new Date(startDate))
        );

        const totalValue = filteredData.reduce((total, possession) => total + possession.valeur, 0);
        setPatrimoineValue(totalValue);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '100px' }}>
            <h1>Patrimoine de HEI</h1>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Line data={chartData} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date de début',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Valeur',
                            },
                            beginAtZero: true,
                        },
                    },
                }} />
            </div>
            {patrimoineValue !== null && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Valeur du patrimoine entre {new Date(startDate).toLocaleDateString()} et {new Date(endDate).toLocaleDateString()} :</h2>
                    <p>{patrimoineValue} </p>
                </div>
            )}
            <div style={{ position: 'absolute', bottom: '20px', width: '80%', margin: '0 auto', textAlign: 'center' }}>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                />
                <button onClick={handleCheckValue} style={{ marginLeft: '10px' }}>Valider</button>
            </div>
        </div>
    );
}

export default Patrimoine;
