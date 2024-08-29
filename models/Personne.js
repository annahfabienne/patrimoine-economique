export default class Personne {
  constructor(nom) {
    this.nom = nom;
  }


  ShowUser(user){
    console.log("my name is:" + this.nom + this.prénom + "date of birth:" + this.dateDeNaissance);
  }
}

module.exports = Personne;