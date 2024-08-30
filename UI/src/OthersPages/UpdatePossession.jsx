// UpdatePossession.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Possession from '../../../../models/possessions/Possession.js'; // Import renommer pour éviter le conflit
import Flux from '../../../../models/possessions/Flux.js'; // Chemin inchangé

function UpdatePossession({ mode, initialData, onSave }) {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [tauxAmortissement, setTauxAmortissement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Pour obtenir l'identifiant de la possession si nécessaire

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setLibelle(initialData.libelle);
      setValeur(initialData.valeur);
      setDateDebut(initialData.dateDebut);
      setTauxAmortissement(initialData.tauxAmortissement);
    }
  }, [mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newPossession = {
      libelle,
      valeur: parseFloat(valeur),
      dateDebut,
      tauxAmortissement: parseFloat(tauxAmortissement),
    };

    try {
      if (mode === 'add') {
        // Enregistrer la nouvelle possession
        await axios.post('/api/possessions', newPossession);
      } else if (mode === 'edit') {
        // Mettre à jour la possession existante
        await axios.put(`/api/possessions/${id}`, newPossession);
      }
      onSave(); // Callback pour mettre à jour la liste des possessions dans le composant parent
      navigate('/');
    } catch (error) {
      console.error('Error saving possession:', error);
      // Gestion des erreurs
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{mode === 'add' ? 'Créer une Possession' : 'Modifier une Possession'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="m-3">
          <label>Libellé</label>
          <input
            type="text"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="m-3">
          <label>Valeur</label>
          <input
            type="number"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="m-3">
          <label>Date Début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="m-3">
          <label>Taux d'Amortissement</label>
          <input
            type="number"
            value={tauxAmortissement}
            onChange={(e) => setTauxAmortissement(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : (mode === 'add' ? 'Créer' : 'Sauvegarder')}
        </button>
      </form>
    </div>
  );
}

export default UpdatePossession;
