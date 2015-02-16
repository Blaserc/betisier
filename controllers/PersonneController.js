
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

module.exports.ValiderPersonne = function(request, response){
  request.session.personne = {'nom':request.body.nom, 'prenom':request.body.prenom, 'tel':request.body.telephone, 'mail':request.body.email, 'login':request.body.login, 'password':request.body.password, 'categorie':request.body.categorie};
  if(request.body.categorie == 'etudiant'){
    model.getDivision(function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.annee = result;
      model.getDepartement(function(err, result){
        response.dep = result;
        response.etu = 'etudiant';
        response.render('ajouterPersonne', response);
      });
    });
  }
  else{
    model.getFonction(function(err, result){
      if(err){
        console.log(err);
        return;
      }
      response.fonction = result;
      response.sal = 'sal';
      response.render('ajouterPersonne', response);
    });
  }
};

module.exports.InsertPersonne = function(request, response){
  // Tester si le login est déjà pris
  model.getLoginPris(request.session.personne['login'], function(err, result){
    if(err){
      console.log(err);
      return;
    }
    if(result.length != 0){
      // Le login est déjà utilisé
      response.resultatNeg = 'Le login est déjà utilisé.';
      response.render('insererPersonne', response);
    }
    else{
      // Le login est libre
      // On teste si la personne existe (mail, nom, prenom)
      pers = {'nom':request.session.personne['nom'], 'prenom':request.session.personne['prenom'], 'mail':request.session.personne['mail']};
      model.getPersonneByNomPrenomMail(pers, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        if(result.length != 0){
          // La personne existe déjà
          response.resultatNeg = 'La personne existe déjà.';
          response.render('insererPersonne', response);
        }
        else{
          // La personne n'existe pas, le login est libre
          // On insert la personne
          model.insertPersonne(request.session.personne, function(err, result){
            if(err){
              console.log(err);
              return;
            }
            // On récupère le numéro de la personne insérée
            model.getPersonneByNomPrenomMail(pers, function(err, result){
              if(err){
                console.log(err);
                return;
              }
              response.per_num = result[0]['per_num'];
              // On teste si c'est un étudiant
              if(request.session.personne['categorie'] == 'etudiant'){
                // C'est un étudiant
                // On récupère le numéro de sa division
                model.getDivNumByDivNom(request.body.annee, function(err, result){
                  if(err){
                    console.log(err);
                    return;
                  }
                  response.div_num = result[0]['div_num'];
                  // On récupère le numéro de son département
                  //Attention, villes non gérées
                  model.getDepNumByDepNom(request.body.dep, function(err, result){
                    if(err){
                      console.log(err);
                      return;
                    }
                    response.dep_num = result[0]['dep_num'];
                    var etu = {'per_num':response.per_num, 'div_num':response.div_num, 'dep_num':response.dep_num}
                    model.insertEtudiant(etu, function(err, result){
                      if(err){
                        console.log(err);
                        return;
                      }
                      response.resultatPos = 'L\'étudiant';
                      response.render('insererPersonne', response);
                    });
                  });
                });
              }
              else{
                model.getFonNumByFonLibelle(request.body.fonction, function(err, result){
                  if(err){
                    console.log(err);
                    return;
                  }
                  response.fon_num = result[0]['fon_num'];
                  var sal = {'per_num':response.per_num, 'fon_num':response.fon_num, 'sal_telprof':request.body.tel}
                  model.insertSalarie(sal, function(err, result){
                    if(err){
                      console.log(err);
                      return;
                    }
                    response.resultatPos = 'Le salarié';
                    response.render('insererPersonne', response);
                  });
                });
              }
            });
            
          });
        }
      });
    }
  });
};

