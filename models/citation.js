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

module.exports.getEnseignantCitVal = function (callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var req = "SELECT per_nom FROM personne p JOIN citation c ON p.per_num=c.per_num WHERE cit_date_valide is not null AND cit_valide = 1 AND p.per_num IN (SELECT per_num FROM salarie)";
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
};

module.exports.getDates = function(callback){
  db.getConnection(function(err, connexion){
    if(!err){
      var req = "SELECT distinct(date_format(cit_date, '%d/%m/%Y')) as cit_date FROM citation c WHERE cit_date_valide is not null AND cit_valide = 1";
      connexion.query(req, callback);
      connexion.release();
    }
  });
};

module.exports.getNotes = function(callback){
  db.getConnection(function(err, connexion){
    if(!err){
      var req = "SELECT distinct(vot_valeur) FROM vote v JOIN citation c ON v.cit_num=c.cit_num"+
      " JOIN personne p ON p.per_num=c.per_num WHERE cit_date_valide is not null AND cit_valide = 1 AND"+
      " p.per_num IN (SELECT per_num FROM salarie)";
      connexion.query(req, callback);
      connexion.release();
    }
  });
};

/*module.exports.getCitByProf = function(data, callback){
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL 
      var req = "SELECT c.cit_num, per_prenom, per_nom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, avg(vot_valeur) as moyenne " +
             'FROM citation c join personne p on c.per_num=p.per_num join vote v on c.cit_num = v.cit_num ' +
             'WHERE cit_valide = 1 AND per_nom = ' + connexion.escape(data) + " AND cit_date_valide IS NOT NULL " +
             "GROUP BY per_nom, per_prenom, cit_libelle, cit_date, c.cit_num";
      connexion.query(req, callback);
      // la connexion retourne dans le pool
      connexion.release();
    }
  }); 
};*/

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

module.exports.getResu = function(prof, date, note, callback){
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL 
      var req = "SELECT c.cit_num, per_prenom, per_nom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, avg(vot_valeur) as moyenne " +
             "FROM citation c join personne p on c.per_num=p.per_num join vote v on c.cit_num = v.cit_num "+
             "WHERE cit_valide = 1  AND cit_date_valide IS NOT NULL AND p.per_num IN (SELECT per_num FROM salarie)";
      if(prof != -1){
          req += ' AND per_nom = ' + connexion.escape(prof);
      }
      if(date != -1){
          date = date.split("/");
          date = date[2]+'-'+date[1]+'-'+date[0];
          req += ' AND cit_date = ' + connexion.escape(date);
      }
      req += " GROUP BY per_nom, per_prenom, cit_libelle, cit_date, c.cit_num";
      if(note != -1){
          req += ' HAVING moyenne between ' + connexion.escape(note-1) +
                  ' AND' + connexion.escape(note+1);
      }
      connexion.query(req, callback);
      // la connexion retourne dans le pool
      connexion.release();
    }
  }); 
};