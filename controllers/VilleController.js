var model = require('../models/ville.js');
   
   // ////////////////////////////////////////////// L I S T E R     V I L L E S 
 
/*
* Ce module permet de récupérer l'intégralité des Villes 
* en utilisant la méthode getListVille du model ville.js
* il passe listeVille  et nbVille à la vue listerVille.
* response.listeVille contient par exemple :
* [ { vil_num: 5, vil_nom: 'Tulle' },
* { vil_num: 6, vil_nom: 'Brive' },
* { vil_num: 17, vil_nom: 'Orléans' } ]

* response.nbVille contient par exemple : 3
* response.title est passé à main.handlebars via la vue listerVille
* il sera inclus dans cette balise : <title> {{title}}</title>
*/ 
     
module.exports.ListerVille = function(request, response){
  response.title = 'Liste des villes';
  // on récupère les villes  
  model.getListeVille( function (err, result) {
    if (err) {
      // gestion de l'erreur
      console.log(err);
      return;
    }
  response.listeVille = result; 
  response.nbVille = result.length;
  response.render('listerVille', response);
  });   
};   

   // ////////////////////////////////////////////// A J O U T E R     V I L L E
   
module.exports.AjouterVille = function(request, response){

  response.title = 'Ajouter des villes';
  response.etat = 'Ajout';
	// La vue doit afficher le formulaire d'ajout d'une ville
  response.render('ajoutVille', response);
};  
 
   // ////////////////////////////////////////////// I N S E R E R     V I L L E 
 
module.exports.InsertVille = function(request, response){
  response.title = 'Insertion d\'une ville';
  var nom = request.body.nom;
  response.nom = nom;
  // On vérifie que la ville n'existe pas déjà
  model.getVilleByName(nom, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    if(result.length == 0){
      // Elle n'existe pas, on l'insère
      model.insertVille(nom, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        response.render('ajoutVille', response);
      });
    }
    else{
      // Elle existe déjà
      response.erreur = "La ville a déjà été ajoutée."
      response.render('ajoutVille', response);
    }
  });
};

   // ////////////////////////////////////////////// M O D I F I E R     V I L L E
     
module.exports.ModifierVille = function(request, response){
  response.title = 'Modifier une ville';
  if(request.body.vil_num){
    if(request.body.vil_nom){
      // Si la ville à modifier est choisie et le nouveau nom saisi, on modifie le nom
      var data = {'num':request.body.vil_num, 'nom':request.body.vil_nom};
      model.modifierVille(data, function(err, result){
        if(err){
          // Gestion d'une erreur de modification
          console.log(err);
          response.statu = 'La ville n\'a pas pu être modifiée !';
          response.img = 'erreur.png';
          response.res = 'Erreur';
        }
        else{
          // Modification ok
          response.img = 'valid.png';
          response.res = 'Valide !';
          response.statu = 'La ville a bien été modifiée !';
        }
        response.render('modifierVille', response);
      });
    }
    else{
      // Informer la vue qu'elle doit afficher le formulaire de modification
      response.num = request.body.vil_num;
      response.render('modifierVille', response);
    }
  }
  else{
    // La ville à modifier n'est pas choisie, on récupère et envoie toutes les villes
    model.getListeVille(function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.listeVille = result;
      response.render('modifierVille', response);
    });
  }
}; 

module.exports.SupprimerVille = function(request, response){
  response.title = 'Supprimer une ville';
  if(request.body.vil_num){
    // La ville à supprimer est choisie, on la supprime
    model.supprimerVille(request.body.vil_num, function(err, result){
      if(err){
        console.log(err);
        // Traitement de l'erreur
        response.statu = 'La ville n\'a pas pu être supprimée !';
        response.img = 'erreur.png';
        response.res = 'Erreur';
      }
      else{
        response.img = 'valid.png';
        response.res = 'Valide !';
        response.statu = 'La ville a bien été supprimée !';
      }
      response.render('supprimerVille', response);
    });
  }
  else{
    // On récupère et envoie toutes les villes
    model.getListeVille(function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.listeVille = result;
      response.nb = result.length;
      response.render('supprimerVille', response);
    });
  }
}; 