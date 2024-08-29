let prompt = require("prompt-sync");

class Salaire{
    montant = 0;
    dateDeReception = new Date;
    constructor(montant,dateDeReception){
        this.montant = montant;
        this.dateDeReception = dateDeReception;
    }

    getMontant(){
        return this.montant;
    }

}

module.exports = Salaire;