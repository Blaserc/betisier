var model = require('../models/personne.js');

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R 
module.exports.Connect = function(request, response){
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
	 
	 response.redirect('/connect');
};

module.exports.Connection= function(request, response){
    model.getLoginOk( request.body, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        if (result.length == 0 || request.body.resu != request.session.resu ) {
        	response.statu = 'Votre login et/ou mot de passe est erroné !';
        	response.img = 'erreur.png';
        	response.res = 'Erreur';
        } else{
        	response.statu = 'Vous avez bien été connecté !';
        	response.img = 'valid.png';
        	response.res = 'Valide !';
        };
		response.render('connection', response);
	});
};

function aleatoire(min, max) { 
	return (Math.floor((max-min)*Math.random())+min); 
};