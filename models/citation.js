var db = require('../configDb');



module.exports.getListeCitation = function (callback) {	
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL        	  
            connexion.query("SELECT c.cit_num, per_prenom, per_nom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, avg(vot_valeur) as moyenne " +
             'FROM citation c join personne p on c.per_num=p.per_num join vote v on c.cit_num = v.cit_num ' +
             'WHERE cit_valide = 1 AND cit_date_valide IS NOT NULL ' +
             'GROUP BY per_nom, per_prenom, cit_libelle, cit_date, c.cit_num', callback);
            
            // la connexion retourne dans le pool
            connexion.release();
         }
      });   
};

module.exports.getEnseignant = function (callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "SELECT per_nom FROM personne WHERE per_num IN (SELECT per_num FROM salarie)";
            connexion.query(req, callback);
            connexion.release();
        }
    });
};

module.exports.insertCitation = function(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "INSERT INTO citation (per_num, per_num_etu, cit_libelle, cit_date) VALUES (" + connexion.escape(data.per_num) +  ", "+ connexion.escape(data.per_num_etu) +  ", "+ connexion.escape(data.cit_libelle) + ", " + connexion.escape(data.cit_date) + ")";
            connexion.query(req, callback);
            connexion.release();
        }
    });
};


module.exports.noterCitation = function(data, callback){
  db.getConnection(function(err, connexion){
    if(!err){
      var req = "INSERT INTO vote (cit_num, per_num, vot_valeur) VALUES (" + connexion.escape(data.cit_no) + ", " + connexion.escape(data.per_num) + ", " + connexion.escape(data.vote) + ")";
      connexion.query(req, callback);
      connexion.release();
    }
  });
};

module.exports.getCitVotees = function(data, callback){
  db.getConnection(function(err, connexion){
    if(!err){
      var req = "SELECT per_num FROM vote WHERE per_num = " + connexion.escape(data);
      connexion.query(req, callback);
      connexion.release();
    }
  });

module.exports.suprCitation = function(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            suprVotes(data, function(err,result){
                if(err){
                    return;
                }else{
                    var req = "DELETE FROM citation WHERE cit_num = " + connexion.escape(data);
                    connexion.query(req, callback);
                    connexion.release();
                }
            });
            
        }
    });
};

function suprVotes(data, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "DELETE FROM vote WHERE cit_num = " + connexion.escape(data);
            connexion.query(req, callback);
            connexion.release();
        }
    });
};