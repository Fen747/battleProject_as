var http = require('http'),
io = require('socket.io'),
cu = require('./classes/class_unit.js'),
cp = require('./classes/class_player.js'),
class_actions = require('./classes/class_actions.js').class_action,
tick_rate = require('./classes/class_tickrate.js').class_tickRate,
Tracker = require('meteor-standalone-tracker'),




oMatchMaking = require('./matchMaking.js');

GLOBAL.tick_rate = tick_rate;

GLOBAL.uniqid = function () {
  var time = new Date().getTime();
  while (time == new Date().getTime());
  return new Date().getTime().toString(36);
}


oGameObject = require('./classes/class_gameObject.js');
oGameObject = oGameObject.class_gameObject;
oGameList = require('./classes/class_gameList.js');
oGameList = oGameList.class_gameList;

mongoURL = "mongodb://127.0.0.1:81/meteor";




/**
* Variables Globales
**/
GLOBAL.dbmongo = null;

// On stocl l'association Joueur -> gameID
GLOBAL.playerList = {};

// ON va stocker ici l'ensemble des sockets connectés sur le serveur, classé par ID player. ça permettra d'aller chercher le socket de n'importe ou pour envoyer un ordre au client
GLOBAL.socketsConnected = {};

GLOBAL.Tracker =  Tracker;


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

    client.on('disconnect', function(ident){
  			// @TODO Si le joueur est en recherche de partie, on devrait le rendre indisponible
        //delete socketsConnected[ident] ;
    });

    client.on('askValidateAction', function(gameId, unitId, action){
       console.log('[SOCKET] On vient de recevoir une demande action', gameId, unitId, action);
  	   class_actions[action.type](gameId, unitId, action);
    });

  	client.on('findWar', function(ident){
  		if (!socketsConnected[ident] || socketsConnected[ident].id != client.id) {
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
isNewPlayer = function (userId, client, gameId) {
  socketsConnected[userId] = client;

  GameList.getGame(gameId).getPlayer(userId).setSocketId(client.id);

	return true;
};

generatePlayer = function(ident, client, game) {
	// On va maintenant mettre une unité à sa disposition
	//@TODO il faudra ici ajouter plusieurs unité en fonction de la puissance du joueur
	var units = {};

  var i;
	for (i = 0; i < 2; i++) {
    // Gestion gauche droite
    var position = null;
		if (game.getNbPlayer() == 1) {
			position = (32*i);
		} else {
			position = (32*i + 600);
		}

		unit = new cu.class_unit('dumb', ident, position, game);

		units[unit.getUnitId()] = unit;
	}

	// On sauvegarde une partie des infos pour identifier ce joueur par la suite.
  var aPlayer = new cp.class_player(ident, units, client.id);

  // On stock le gameId pour chaque joueur, ce sera ainsi plus facile de retrouver dans quel partie est positionné le joueur
  playerList[ident] = game.getGameId();

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
		for(var unit in aPlayer.getUnits()) {
      aUnit = aPlayer.getUnits(unit);
			if (client.id == aPlayer.getSocketId()) {
				sprite = 'dude';
			} else {
				sprite = 'dude2'
			}
      console.log('[SOCKET] Envoi dune unité au joueur ');
			client.emit('addUnit', sprite, aUnit.getPosition(), aUnit.getUnitId(), aUnit.getOwner());
		}
	};

  GameList.getGame(gameId).getPlayer(userId).startPingWatch();
};

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a,b]),
      max = Math.max.apply(Math, [a,b]);

  return this > min && this < max;
};
