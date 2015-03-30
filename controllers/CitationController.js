var model = require('../models/citation.js');
var pers = require('../models/personne.js');
var mot = require('../models/mot.js');
   
// ////////////////////////////////////////////// L I S T E R     C I T A T I O N 
   
module.exports.ListerCitation = function(request, response){
  response.title = 'Liste des citations';
  // On récupère toutes les citations validées
  model.getListeCitation( function (err, result) {
    if (err) {
      // gestion de l'erreur
      console.log(err);
      return;
    }
    response.listeCitation = result; 
    response.nbCit = result.length;
    // Si la personne est connectée
    // On récupère toutes les citations qu'elle a noté
    if(request.session.num){
      model.getCitVotees(request.session.num, function (err, result){
        if(err){
          console.log(err);
          return;
        }
        if(result.length != 0){
          response.dejaNote = 'Citation déjà notée';
        }
      });
    }
    response.render('listerCitation', response);
  });
};   

//  ///////////////////////////////////////////// N O T E R     C I T A T I O N

module.exports.NoterCitation = function(request, response){
  response.title = 'Noter une citation';
  if(request.body.note){
    // L'utilisateur souhaite noter une citation
    note = {'cit_no':request.body.cit_no, 'per_num':request.session.num, 'vote':request.body.note};
    // On ajoute la note àla citation
    model.noterCitation(note, function (err, result){
      if(err){
        console.log(err);
        return;
      }
      // On redirige vers les citations à noter
      response.redirect('/listerCitation');
    });
  }
  else{
    //L'utilisateur n'a pas encore donné de note
    response.cit_no = request.body.cit_num;
    response.render('noterCitation', response);
    
  }
};

// ////////////////////////////////////////////// A J O U T E R     C I T A T I O N 
   
module.exports.AjouterCitation = 	function(request, response){
  response.title = 'Ajouter des citations';
  // On récupère la liste des enseignants
  model.getEnseignant(function(err, result){
    if(err){
      console.log(err);
      return;
    }
    // On envoie les résultats à la vue pour le formulaire d'ajout
    response.enseignant = result;
    response.render('ajouterCitation', response);
  });
};   

module.exports.VerifierCitation = function(request, response){
  // On recherche s'il y a des mots interdits
  mot.search(request.body.citation, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    if(result.length == 0){
      // Il n'y pas de mots interdits
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
          // Ce n'est pas une étudiant, il ne peut pas insérer de citations
          response.prof = 'prof';
          response.resu = 'Un salarié ne peut pas proposer de citations.';
          response.render('ajouterCitation', response);
        }
        else{
          // C'est un étudiant, on insère la citation
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
      // Il y a des mots interdits, on les remplace par ---
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
        // On propose la citation avec les mots remplacés
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
  // On récupère tous les éléments qui peuvent être associés à une ou plusieurs citations
  model.getEnseignantCitVal(function(err, result){
    if(err){
      console.log(err);
      return;
    }
    response.enseignant = result;
    model.getDates(function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.date = result;
      model.getNotes(function(err, result){
        if(err){
          console.log(err);
          return;
        }
        //console.log(result);
        response.note = result;
        response.render('rechercherCitation', response);
      });
    });
  });
}; 

module.exports.Recherche = function(request, response){
  response.title = 'Resultats de la recherche';
  // On cherche les citations qui correspondent aux différents choix de l'utilisateur
  if(request.body.prof){
    model.getResu(request.body.prof, request.body.date, request.body.note, function(err, result){
      if(err){
        console.log(err);
        return;
      }
      if(result.length == 0){
        response.res = "Aucun résultat.";
      }
      else{
        response.citation = result;
      }
      response.render('rechercheResultats', response);
    });
  }
};

module.exports.ValiderCitation = function(request, response){
  response.title = 'Valider une citation';
  if(request.body.cit_num){
    // On veut valider une citation
    // On récupère la date du jour
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 
    if(mm<10) {
        mm='0'+mm;
    }
    var date_val = yyyy+'-'+mm+'-'+dd;
    // On modifie les champs nécessaires à la validation
    model.validerCitation(request.body.cit_num, date_val, request.session.num, function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.img = 'valid.png';
      response.res = 'Valide !';
      response.statu = 'La citation a bien été validée !';
      response.render('validerCitation', response);
    });
  }
  // On affiche toutes les citations à valider
  else{
    model.getCitNonValides(function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.citNonVal = result;
      response.nb = result.length;
      response.render('validerCitation', response);
    });
  }
}; 

module.exports.SupprimerCitation = function(request, response){
  response.title = 'Supprimer une citation';
  // Si on a choisit la citation à supprimer, on la supprime
  if(request.body.cit){
    model.suprCitation(request.body.cit, function(err, result){
      if(err){
        // Gestion d'une erreur de suppression
        response.statu = 'La citation n\'a pas pu être supprimée !';
        response.img = 'erreur.png';
        response.res = 'Erreur';
      }else{
        response.img = 'valid.png';
        response.res = 'Valide !';
        response.statu = 'La citation a bien été supprimée !';
      }
      response.render('supprimerCitation', response);
    });
  }else{
    // Sinon, on récupère et envoie toutes les citations que l'on peut supprimer
     model.getListeCitation( function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      response.listeCitation = result; 
      response.nbCit = result.length;
      response.render('supprimerCitation', response);
    });
  }
}; 
