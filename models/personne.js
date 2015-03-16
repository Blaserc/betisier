// appel du module pour le cryptage du mot de passe
var crypto=require('crypto');
var db = require('../configDb');


/*
* Vérifie le nom utilisateur et son mot de passe
* 
* @param     data.login : le login de l'utilisateur
* @param     data.pass : le mot de passe
* @return l'identifiant de la personne si le mot de passe et le login sont bons
*     Rien sinon
*
*/
module.exports.getLoginOk = function (data, callback) {
	db.getConnection(function(err, connexion){
 	if(!err){
   	var sha256 = crypto.createHash("sha256"); // cryptage en sha256
   	sha256.update(data.pass, "utf8");
   	var resu = sha256.digest("base64");	
	   //console.log ('Mot de passe en clair : ' + data.pass); 
	   //console.log ('Mot de passe crypté : ' + resu);	 	
 		req= "SELECT * from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
      //console.log(req);
   	connexion.query(req, callback);
   	connexion.release();
   }
   	});
};

module.exports.getListePersonne = function (callback) {
   db.getConnection(function(err, connexion){
   if(!err){
      var req = 'SELECT per_num, per_nom, per_prenom FROM personne';
      connexion.query(req, callback);
      connexion.release();
   }
   });
};

module.exports.isEtudiant = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_num FROM etudiant WHERE per_num = " + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

function isEtudiant(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_num FROM etudiant WHERE per_num = " + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.isAdministrateur = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_num FROM personne WHERE per_num = " + data + " AND per_admin = 1";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getInfoPersonne = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_prenom, per_mail, per_tel FROM personne WHERE per_num =" + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getInfoEtudiant = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT dep_nom, vil_nom, per_nom, per_prenom, per_mail, per_tel FROM personne p JOIN etudiant e ON p.per_num = e.per_num JOIN departement d ON e.dep_num = d.dep_num JOIN ville v ON d.vil_num = v.vil_num WHERE e.per_num = " + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getInfoSalarie = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT sal_telprof, fon_libelle, per_nom, per_prenom, per_mail, per_tel FROM personne p JOIN salarie s ON p.per_num = s.per_num JOIN fonction f ON s.fon_num = f.fon_num WHERE s.per_num = " + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getDivision = function(callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT div_nom FROM division";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getDepartement = function(callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT dep_nom FROM departement";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getFonction = function(callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT fon_libelle FROM fonction";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getFonNumByFonLibelle = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT fon_num FROM fonction WHERE fon_libelle =" + connexion.escape(data);
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getDepNumByDepNom = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT dep_num FROM departement WHERE dep_nom =" + connexion.escape(data);
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getDivNumByDivNom = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT div_num FROM division WHERE div_nom =" + connexion.escape(data);
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getPersonneByNomPrenomMail = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_num FROM personne WHERE per_nom =" + connexion.escape(data.nom) + " AND per_prenom =" + connexion.escape(data.prenom) + " AND per_mail =" + connexion.escape(data.mail);
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getPersonneByName = function(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "SELECT per_num FROM personne WHERE per_nom =" + connexion.escape(data);
            connexion.query(req, callback);
            connexion.release();
        }
    });
};

module.exports.getPersonneByLogin = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_num FROM personne WHERE per_login =" + connexion.escape(data);
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getLoginPris = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT per_login FROM personne WHERE per_login =" + connexion.escape(data);
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.insertPersonne = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var sha256 = crypto.createHash("sha256"); // cryptage en sha256
         sha256.update(data.password, "utf8");
         var resu = sha256.digest("base64");
         var req = "INSERT INTO personne (per_nom, per_prenom, per_tel, per_mail, per_login, per_pwd) VALUES (" + connexion.escape(data.nom) + ", " + connexion.escape(data.prenom) + ", " + connexion.escape(data.tel) + ", " + connexion.escape(data.mail) + ", " + connexion.escape(data.login) + ", '" + resu + "')";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.insertEtudiant = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "INSERT INTO etudiant (per_num, dep_num, div_num) VALUES (" + connexion.escape(data.per_num) + ", " + connexion.escape(data.dep_num) + ", " + connexion.escape(data.div_num) + ")";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.insertSalarie = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "INSERT INTO salarie (per_num, sal_telprof, fon_num) VALUES (" + connexion.escape(data.per_num) + ", " + connexion.escape(data.sal_telprof) + ", " + connexion.escape(data.fon_num) + ")";
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getListePersonneSuppr = function (callback) {
   db.getConnection(function(err, connexion){
   if(!err){
      var req = 'SELECT per_num, per_nom, per_prenom FROM personne WHERE per_num NOT IN (SELECT per_num FROM citation)'+
      ' AND per_num NOT IN (SELECT per_num FROM vote)';
      connexion.query(req, callback);
      connexion.release();
   }
   });
};

module.exports.suprPers = function(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            //tester si étudiant ou pas
            isEtudiant(data, function(err,result){
               if (result.length == 0) {
                  suprSal(data, function(err,result){
                     if(err){
                        console.log(err);
                        return;
                     }else{
                        var req = "DELETE FROM personne WHERE per_num = " + connexion.escape(data);
                        connexion.query(req, callback);
                        connexion.release();
                     }
                  });
               }else{
                   suprEtu(data, function(err,result){
                      if(err){
                        console.log(err);
                        return;
                      }else{
                        var req = "DELETE FROM personne WHERE per_num = " + connexion.escape(data);
                        connexion.query(req, callback);
                        connexion.release();
                      }
                  });
               }
            });            
        }
    });
};

function suprEtu(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "DELETE FROM etudiant WHERE per_num = " + connexion.escape(data);
            connexion.query(req, callback);
            connexion.release();
        }
    });
};

function suprSal(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "DELETE FROM salarie WHERE per_num = " + connexion.escape(data);
            connexion.query(req, callback);
            connexion.release();
        }
    });
};