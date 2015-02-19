var model = require('../models/citation.js');
   
// ////////////////////////////////////////////// L I S T E R     C I T A T I O N 
   
module.exports.ListerCitation = 	function(request, response){
  response.title = 'Liste des citations';
  model.getListeCitation( function (err, result) {
    if (err) {
      // gestion de l'erreur
      console.log(err);
      return;
    }
  response.listeCitation = result; 
  response.nbCit = result.length;
  response.render('listerCitation', response);
  });
};   

// ////////////////////////////////////////////// A J O U T E R     C I T A T I O N 
   
module.exports.AjouterCitation = 	function(request, response){
  response.title = 'Ajouter des citations';
  model.getEnseignant(function(err, result){
    if(err){
      console.log(err);
      return;
    }
    response.prof = result;
    response.render('ajouterCitation', response);
  });
};   

module.exports.InsertCitation = function(request, response){
  model.getPersonneByLogin(request.body.prof, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    response.per_num = result[0];
    citation = {'per_num':response.per_num['per_num'], 'per_num_etu':53, 'cit_libelle':request.body.citation};
    model.insertCitation(citation, function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.resu = 'La citation a été ajoutée.';
      console.log(response.resu);
      response.render('ajouterCitation', response);
    });
  });
};


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N 
   
module.exports.RechercherCitation = function(request, response){
  response.title = 'Rechercher des citations';
  response.render('rechercherCitation', response);
 
     		 
  } ; 

