var db = require('../configDb');

module.exports.search = function(data, callback){
	db.getConnection(function(err, connexion){
		if(!err){
			var req = "SELECT mot_interdit FROM mot WHERE MATCH(mot_interdit) AGAINST (" + connexion.escape(data) + ");";
			connexion.query(req, callback);
			connexion.release();
		}
	});
};