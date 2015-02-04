
var model = require('../models/personne.js');
  
    
// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S 
   
module.exports.ListerPersonne = function(request, response){
   response.title = 'Liste des personnes';
   model.getListePersonne( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
   response.listePersonne = result; 
   response.nbPersonne = result.length;
   response.render('listerPersonne', response);  
	});
};   

module.exports.DetailPersonne = function(request, response){
  var id = request.params.nump;
	model.isEtudiant(id, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
   response.nbResul = result.length;
	});
  //Il ne connait pas la variable nbResul => il faut la faire sortir de la requête
	if (nbResul == 0){
		//C'est un salarié, requête pour récupérer ses infos
    model.getInfoSalarie(id, function (err, response){
      if(err){
        console.log(err);
        return;
      }
      response.statut = "le salarié";
      response.infoSalarie = result;
      response.render('detailSalarie', response);
    });
	}
	else {
		//C'est un étudiant, requête pour récupérer ses infos
    model.getInfoEtudiant(id, function (err, response){
      if(err){
        console.log(err);
        return;
      }
      response.statut = "l'étudiant";
      response.infoEtudiant = result;
      response.render('detailEtudiant', response);
    });
	}
};
// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S 
   
module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   response.render('ajouterPersonne', response);  
}; 