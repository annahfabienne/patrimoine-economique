

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPossession({ onAddPossession }) {
  const [formValues, setFormValues] = useState({
    possesseur: '',
    libelle: '',
    valeur: 0,
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPossession(formValues); // Appelle la fonction pour ajouter la possession
    navigate('/possession'); // Retourne à la page des possessions
  };

  return (
    <div className="container">
      <h2>Ajouter Nouvelle Possession</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Possesseur</label>
          <input
            type="text"
            className="form-control"
            name="possesseur"
            value={formValues.possesseur}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Libellé</label>
          <input
            type="text"
            className="form-control"
            name="libelle"
            value={formValues.libelle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Valeur</label>
          <input
            type="number"
            className="form-control"
            name="valeur"
            value={formValues.valeur}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date de début</label>
          <input
            type="date"
            className="form-control"
            name="dateDebut"
            value={formValues.dateDebut}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date de fin</label>
          <input
            type="date"
            className="form-control"
            name="dateFin"
            value={formValues.dateFin}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Taux d'Amortissement</label>
          <input
            type="number"
            className="form-control"
            name="tauxAmortissement"
            value={formValues.tauxAmortissement}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default NewPossession;
