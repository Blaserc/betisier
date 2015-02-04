var db = require('../configDb');



module.exports.getListeCitation = function (callback) {	
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL        	  
            connexion.query("SELECT per_prenom, per_nom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, avg(vot_valeur) as moyenne " +
             'FROM citation c join personne p on c.per_num=p.per_num join vote v on c.cit_num = v.cit_num ' +
             'WHERE cit_valide = 1 AND cit_date_valide IS NOT NULL ' +
             'GROUP BY per_nom, per_prenom, cit_libelle, cit_date', callback);
            
            // la connexion retourne dans le pool
            connexion.release();
         }
      });   
};
