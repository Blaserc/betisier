var model = require('../models/personne.js');

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R 
module.exports.Connect = function(request, response){
    // Gestion du captcha
	nb1 = aleatoire(1,9);
	nb2 = aleatoire(1,9);
	response.img1 = nb1+'.jpg';
	response.img2 = nb2+'.jpg';
	response.alt1 = nb1;
	response.alt2 = nb2;
	request.session.resu = nb1+nb2;
    response.render('connect', response);
};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R 
module.exports.Deconnect = function(request, response){
    // On supprime toutes les données utilisateurs en session et on informe de la déconnection.
	 request.session.destroy();
     response.statu = 'Vous avez bien été déconnecté.';
     response.img = 'valid.png';
     response.res = 'Valide !';
	 response.render('connection', response);
};

module.exports.Connection= function(request, response){
    //console.log(request.body);
    // On teste si l'utilisateur est bien dans la base
    model.getLoginOk( request.body, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        //console.log(request.session.resu);
        // Utilisateur non trouvé
        if (result.length == 0 || request.body.resu != request.session.resu ) {
        	response.statu = 'Votre login et/ou mot de passe est erroné !';
        	response.img = 'erreur.png';
        	response.res = 'Erreur';
        } else{
            // Utilisateur trouvé, enregistrement de ses données en session
        	response.statu = 'Vous avez bien été connecté !';
        	response.img = 'valid.png';
        	response.res = 'Valide !';
            request.session.login = request.body.login;
            request.session.num = result[0]['per_num'];
            model.isEtudiant (result[0]['per_num'], function (err, resulte) {
                if (err) {
                    // gestion de l'erreur
                    console.log(err);
                    return;
                }
                if (resulte.length != 0) {
                    request.session.etudiant = 1;
                }
                model.isAdministrateur (result[0]['per_num'], function (err, resulta) {
                    if (err) {
                        // gestion de l'erreur
                        console.log(err);
                        return;
                    }
                    if (resulta.length != 0) {
                        request.session.admin = 1;
                    }
                }); 
            });
        }
		response.render('connection', response);
	});
};

function aleatoire(min, max) { 
	return (Math.floor((max-min)*Math.random())+min); 
};