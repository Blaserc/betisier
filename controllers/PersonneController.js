
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
    var status = "etu";
    if(result.length == 0){
      status = "prof";
    }
	
  //Il ne connait pas la variable nbResul => il faut la faire sortir de la requête
	if (status == "prof"){
		//C'est un salarié, requête pour récupérer ses infos
    model.getInfoSalarie(id, function (err, result){
      if(err){
        console.log(err);
        return;
      }
      response.infoSalarie = result[0];
      response.render('detailSalarie', response);
    });
	}
	else {
		//C'est un étudiant, requête pour récupérer ses infos
    model.getInfoEtudiant(id, function (err, result){
      if(err){
        console.log(err);
        return;
      }
      response.infoEtudiant = result[0];
      response.render('detailEtudiant', response);
    });
	}
  });
};
// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S 
   
module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   response.render('ajouterPersonne', response);  
}; 