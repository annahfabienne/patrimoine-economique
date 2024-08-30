import express from 'express';
import cors from 'cors';
import { readFile as fetchFile } from '../data/index.js';

const server = express();
const PORT = 3500;

server.use(cors());
server.use(express.json()); // Ajouté pour gérer les données JSON dans les requêtes POST

server.get("/api/possession", async (req, res) => {
  try {
    const jsonData = await fetchFile("../UI/public/data.json");
    res.json(jsonData);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la lecture des données' });
  }
});

server.get("/api/patrimoine/:value", async (req, res) => {
  try {
    const { value } = req.params;
    const jsonData = await fetchFile("../UI/public/data.json");
    const possessions = jsonData.data[1].data.possessions;
    const filteredPossessions = possessions.filter(item => item.valeur <= value);

    res.json(filteredPossessions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du filtrage des possessions' });
  }
});

server.post("/api/possession", (req, res) => {
  const { libelle, valeur, dateDebut, taux } = req.body;

  if (!libelle || !valeur || !dateDebut || !taux) {
    return res.status(400).json({ error: 'Informations manquantes ou incorrectes' });
  }

  // Traitement de données
  res.status(200).json({ libelle, valeur, dateDebut, taux });
});

server.listen(PORT, () => {
  console.log(`Serveur actif sur le port ${PORT}`);
});







//


server.post("/api/possession", async (req, res) => {
  const { libelle, valeur, dateDebut, taux } = req.body;

  if (!libelle || !valeur || !dateDebut || !taux) {
    return res.status(400).json({ error: 'Informations manquantes ou incorrectes' });
  }

  try {
    // Ajouter la logique pour sauvegarder les données dans un fichier ou une base de données
    // Par exemple, mettre à jour le fichier JSON (à adapter selon votre besoin)
    const jsonData = await fetchFile("../UI/public/data.json");
    jsonData.data[1].data.possessions.push({ libelle, valeur, dateDebut, taux });
    
    // Sauvegarder les données mises à jour (à adapter selon votre besoin)
    // await saveFile("../UI/public/data.json", jsonData);

    res.status(201).json({ libelle, valeur, dateDebut, taux });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la possession' });
  }
});
