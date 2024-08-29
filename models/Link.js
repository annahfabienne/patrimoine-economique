const trainDeVie = require("./TrainDeVie.js");
const salaire = require("./Salaire.js");

const TrainDeVie = new trainDeVie(20_000, "...");
const Salaire = new salaire(80_000, "18/12/2026");

let spentMoney = [];
let i = 0;
let revenuTotal = 0;

function retrieveSpentMoney() {
    return spentMoney; // Retourner la liste des dépenses
}

function logExpense(trainDeVie) {
    revenuTotal -= trainDeVie.getCout();
    i += 1;
    const currentDate = new Date(); // Utilisation d'une nouvelle variable pour la date
    const expenseLog = `Dépense ${i} : Motif - ${trainDeVie.getDescription()}, Montant - ${trainDeVie.getCout()}, Date - ${currentDate}`; // Formatage du message
    console.log(expenseLog);
    spentMoney.push(expenseLog);
    return `Vous avez dépensé ${trainDeVie.getCout()} MDG. Solde restant : ${revenuTotal} MDG \n Motif : ${trainDeVie.getDescription()}`;
}

function addSalary(salaire) {
    revenuTotal += salaire.getMontant();
    return `Votre solde total est désormais ${revenuTotal} MDG.`;
}

// Appels de fonction
console.log(TrainDeVie.getCout()); // Affiche le montant de l'objet TrainDeVie
console.log(addSalary(Salaire)); // Affiche le montant total après ajout du salaire
console.log(logExpense(TrainDeVie)); // Enregistre et affiche la dépense
console.log(retrieveSpentMoney()); // Affiche la liste des dépenses

module.exports = {
    revenuTotal,
    i,
    spentMoney,
    addSalary, // Fonction exportée pour ajouter le salaire
    logExpense // Fonction exportée pour enregistrer les dépenses
};
