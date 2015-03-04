var HomeController = require('./../controllers/HomeController');
var ConnectController = require('./../controllers/ConnectController');
var PersonneController = require('./../controllers/PersonneController');
var CitationController = require('./../controllers/CitationController');
var VilleController = require('./../controllers/VilleController');

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);

// connection
   app.get('/connect', ConnectController.Connect);
   app.post('/connection', ConnectController.Connection);
   app.get('/deconnect', ConnectController.Deconnect);
   app.get('/connection', ConnectController.Connection);

   app.all('*', testConnecte);

// citations
    app.get('/listerCitation', CitationController.ListerCitation);
    app.get('/ajouterCitation', CitationController.AjouterCitation);
    app.get('/rechercherCitation', CitationController.RechercherCitation);

 // villes
   app.get('/listerVille', VilleController.ListerVille);
   app.get('/ajouterVille', VilleController.AjouterVille);
   app.post('/villeAjoutee', VilleController.InsertVille);
   app.get('/modifierVille', VilleController.ModifierVille);

 //personne
   app.get('/listerPersonne', PersonneController.ListerPersonne);
   app.get('/detailPersonne/:nump', PersonneController.DetailPersonne);
   app.get('/ajouterPersonne', PersonneController.AjouterPersonne);
   app.post('/validerPersonne', PersonneController.ValiderPersonne);
   app.post('/insererPersonne', PersonneController.InsertPersonne);

//vérification si connecté mais pas admin on ne doit pas accéder à ces routes 
  app.all('*', testAdmin);
//partie admin 
  app.get('/validerCitation', CitationController.ValiderCitation);
  app.get('/supprimerPersonne', PersonneController.SupprimerPersonne);
  app.get('/supprimerCitation', CitationController.SupprimerCitation);
  app.get('/supprimerVille', VilleController.SupprimerVille);

// tout le reste
  /*app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);*/

};

function testConnecte(request, response, next){
  if(request.session.login || request.originalUrl == '/listerPersonne' ||request.originalUrl == '/listerCitation' || request.originalUrl =='/listerVille'){
    next();   
  }else{
    response.redirect('/');   
  }
}

function testAdmin(request, response, next){
  if(request.session.admin ){
    next();   
  }else{
    response.redirect('/');   
  }
}