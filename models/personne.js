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
 		req= "SELECT per_num from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
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
         var req = "SELECT * FROM etudiant WHERE per_num = " + data;
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
         var req = "SELECT dep_nom, vil_nom, per_nom, per_prenom, per_mail, per_tel FROM personne p JOIN etudiant e ON p.per_num = e.per_num JOIN departement d ON e.dep_num = d.dep_num JOIN ville v ON d.vil_num = v.vil_num WHERE per_num = " + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};

module.exports.getInfoSalarie = function(data, callback){
   db.getConnection(function(err, connexion){
      if(!err){
         var req = "SELECT sal_telprof, fon_libelle, per_nom, per_prenom, per_mail, per_tel FROM personne p JOIN salarie s ON p.per_num = s.per_num JOIN fonction f ON s.fon_num = f.fon_num WHERE per_num = " + data;
         connexion.query(req, callback);
         connexion.release();
      }
   });
};