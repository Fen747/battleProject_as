var http = require('http'),
io = require('socket.io'),
cu = require('./class_unit.js'),



oMatchMaking = require('./matchMaking.js');

GLOBAL.uniqid = function () {
    var ts=String(new Date().getTime()), i = 0, out = '';
    for(i=0;i<ts.length;i+=2) {
       out+=Number(ts.substr(i, 2)).toString(36);
    }
    return ('d'+out);
}


oGameObject = require('./classes/class_gameObject.js');
oGameObject = oGameObject.class_gameObject;
oGameList = require('./classes/class_gameList.js');
oGameList = oGameList.class_gameList;

mongoURL = "mongodb://127.0.0.1:3001/meteor";




/**
* Variables Globales
**/
GLOBAL.dbmongo = null;

// On stocl l'association Joueur -> gameID
GLOBAL.playerList = {};

// ON va stocker ici l'ensemble des sockets connectés sur le serveur, classé par ID player. ça permettra d'aller chercher le socket de n'importe ou pour envoyer un ordre au client
GLOBAL.socketsConnected = {};



/**
* Instances
*/
GLOBAL.GameList = new oGameList();


server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello world</h1>');
});
server.listen(2000);

var socket = io.listen(server);


// @FIXME on vide toutes les games, il faudra les archiver plutot
mongo.MongoClient.connect(mongoURL, function(err, db) {
  dbmongo = db;
  runServerAS();
});




runServerAS = function() {
  gameListDB = dbmongo.collection('gameListDb');
  gameListDB.remove();

  socket.on('connection', function(client){


  	client.on('logon', function(ident){
  		// on envoie au nouveau joueur les informations des autres joueur
  		initializePlayer(ident, client);
    });


  	client.on('goTo', function(gameId, unitId, destination){
  	    client.broadcast.emit('moved', unitId, destination);
    });


    client.on('disconnect', function(){
  			// @TODO Si le joueur est en recherche de partie, on devrait le rendre indisponible
    });

    client.on('validateAction', function(gameId, unitId, action){
  	   class_actions[action.type](gameId, unitId, action.args);
    });

  	client.on('findWar', function(ident){
  		if (socketsConnected[ident] == undefined) {
  			console.log('[SOCKET] Nouvelle connexion d\'un joueur. Stockage du stocket dans le tableau');
  			socketsConnected[ident] = client;
  		}
  		console.log('[MATCHMAKING] Recherche d\'une nouvelle partie en cours.');

  		// On cherche deux utilisateurs qui sont "Ready" en base de donnée
  		MatchMaker = new oMatchMaking.MatchMaking();
  		MatchMaker.findWar();
  	});
  });
}

/** Methode qui permet de savoir si un joueur s'est déjà connecté ou non
  *
  */
isNewPlayer = function (ident, client, gameId) {
	var bool = true;
  socketsConnected[ident] = client;

	for(var aPlayer in GameList.getGame(gameId).getPlayer()) {
		if (aPlayer.userId == ident) {
			console.log('[SOCKET] Un joueur vient de se connecter mais il était déjà present dans la partie', ident, client.id);
			// Oui, on met donc à jour sont ID socket.io
			aPlayer.socketId = client.id;
			bool = false;
		}
	};

	return bool;
};

generatePlayer = function(ident, client, gameId) {
	// On va maintenant mettre une unité à sa disposition
	//@TODO il faudra ici ajouter plusieurs unité en fonction de la puissance du joueur
	var units = {};

	for (i = 0; i < 2; i++) {
		unitId = uniqid();
		unit = new cu.class_unit('dumb', ident, null);
		unit.setUnitId(unitId);


		// Gestion gauche droite
		if (GameList.getGame(gameId).getNbPlayer() == 1) {
			unit.setPosition(32*i);
		} else {
			unit.setPosition(32*i + 600);
		}
		units[unitId] = unit;
	}

	// On sauvegarde une partie des infos pour identifier ce joueur par la suite.
	var aPlayer = {
		socketId: client.id,
		userId: ident,
		units: units
	};

  // On stock le gameId pour chaque joueur, ce sera ainsi plus facile de retrouver dans quel partie est positionné le joueur
  playerList[ident] = gameId;

	console.log('[GAME] Le joueur a été généré sur la carte', ident);

  return aPlayer;
};

initializePlayer = function(userId, client) {

  // On va chercher dans quel partie se trouve le joueur
  gameId = playerList[userId];

  // En cas de reconnexion, on rassocie correctement tous les socket et id
  isNewPlayer(userId, client, gameId);

  mesPlayers = GameList.getGame(gameId).getPlayer();
	for(var index in mesPlayers) {
    aPlayer = mesPlayers[index];
		// Ce n'est pas le même joueur, donc on transmet toutes les unités
		for(var unit in aPlayer.units) {
			if (client.id == aPlayer.socketId) {
				sprite = 'dude';
			} else {
				sprite = 'dude2'
			}
			client.emit('addUnit', sprite, unit.getPosition(), unit.getUnitId(), unit.getOwner());
		});
	};
};
