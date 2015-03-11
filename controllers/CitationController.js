var model = require('../models/citation.js');
var pers = require('../models/personne.js');
var mot = require('../models/mot.js');
   
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
    response.enseignant = result;
    response.render('ajouterCitation', response);
  });
};   

module.exports.VerifierCitation = function(request, response){
  mot.search(request.body.citation, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    if(result.length == 0){
      // Inserer la citation
      pers.getPersonneByName(request.body.prof, function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.per_num = result[0];
      // Tester si la personne connectée en session est un étudiant
      pers.isEtudiant(request.session.num, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        if(result.length == 0){
          response.prof = 'prof';
          response.resu = 'Un salarié ne peut pas proposer de citations.';
          response.render('ajouterCitation', response);
        }
        else{
          response.etu = 'etu';
          citation = {'per_num':response.per_num['per_num'], 'per_num_etu':request.session.num, 'cit_libelle':request.body.citation, 'cit_date':request.body.date};
          model.insertCitation(citation, function(err, result){
            if(err){
              console.log(err);
              return;
            }
            response.resu = 'La citation a été ajoutée.';
            response.render('ajouterCitation', response);
          });
        }
    });
    });
    }
    else{
      var newCit = request.body.citation.replace(result[0]['mot_interdit'], "---")
      for(i=1; i<result.length; i++){
        newCit = newCit.replace(result[i]['mot_interdit'], "---");
      }
      response.citation = newCit;
      model.getEnseignant(function(err, result){
        if(err){
          console.log(err);
          return;
        }
        response.enseignant = result;
        var nonValide = {'prof':request.body.prof, 'date':request.body.date};
        response.nonValide = nonValide;
        response.render('ajouterCitation', response);
      });
    }
  });
};

// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N 
   
module.exports.RechercherCitation = function(request, response){
  response.title = 'Rechercher des citations';
  response.render('rechercherCitation', response);
 
     		 
  } ; 

module.exports.ValiderCitation = function(request, response){
  response.title = 'Valider une citation';
  response.render('validerCitation', response);
}; 

module.exports.SupprimerCitation = function(request, response){
  response.title = 'Supprimer une citation';
  if(request.body.pers){
    console.log('suppr');
    model.suprCitation(request.body.pers, function(err, result){
      if(err){
        response.statu = 'La citation n\'a pas pu être supprimée !';
        response.img = 'erreur.png';
        response.res = 'Erreur';
      }else{
        response.img = 'valid.png';
        response.res = 'Valide !';
        response.statu = 'La citation a bien été supprimée !';
      }
    });
  }else{
    
     model.getListeCitation( function (err, result) {
      if (err) {
        // gestion de l'erreur
        console.log(err);
        return;
      }
      response.listeCitation = result; 
      response.nbCit = result.length;
      response.render('supprimerCitation', response);
    });
  }
}; 
