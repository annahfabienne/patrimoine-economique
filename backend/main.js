import express from 'express';
import cors from 'cors';
import { readFile as fetchFile } from '../data/index.js';

const app = express();
const PORT = 3500;

app.use(cors());
app.use(express.json());

app.get('/api/possession', async (req, res) => {
  try {
    const jsonData = await fetchFile('../UI/public/data.json');
    res.json(jsonData);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la lecture des données' });
  }
});

app.get('/api/patrimoine/:value', async (req, res) => {
  try {
    const { value } = req.params;
    const jsonData = await fetchFile('../UI/public/data.json');
    const possessions = jsonData.data[1].data.possessions;
    const filteredPossessions = possessions.filter(item => item.valeur <= value);
    res.json(filteredPossessions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du filtrage des possessions' });
  }
});

app.post('/api/possession', async (req, res) => {
  const { libelle, valeur, dateDebut, taux } = req.body;

  if (!libelle || !valeur || !dateDebut || !taux) {
    return res.status(400).json({ error: 'Informations manquantes ou incorrectes' });
  }

  try {
    const jsonData = await fetchFile('../UI/public/data.json');
    jsonData.data[1].data.possessions.push({ libelle, valeur, dateDebut, taux });
    
    res.status(201).json({ libelle, valeur, dateDebut, taux });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la possession' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur actif sur le port ${PORT}`);
});
