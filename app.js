var http = require('http'),
io = require('socket.io'),
cu = require('./class_unit.js'),
oMatchMaking = require('./matchMaking.js');






server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello world</h1>');
});
server.listen(2000);

var socket = io.listen(server);

var player = [];

// ON va stocker ici l'ensemble des sockets connectés sur le serveur, classé par ID player. ça permettra d'aller chercher le socket de n'importe ou pour envoyer un ordre au client
GLOBAL.socketsConnected = {};

function uniqid() {
    var ts=String(new Date().getTime()), i = 0, out = '';
    for(i=0;i<ts.length;i+=2) {
       out+=Number(ts.substr(i, 2)).toString(36);
    }
    return ('d'+out);
}

socket.on('connection', function(client){


	client.on('logon', function(ident){
		// on envoie au nouveau joueur les informations des autres joueurs
    isNewPlayer(ident, client);
		initializePlayer(client);
  });


	client.on('goTo', function(gameId, unitId, destination){

		console.log('MOVED: '+unitId+ ' TO '+destination);
		client.broadcast.emit('moved', unitId, destination);

    });


    client.on('disconnect', function(){
			// @TODO Si le joueur est en recherche de partie, on devrait le rendre indisponible
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


/** Methode qui permet de savoir si un joueur s'est déjà connecté ou non
  *
  */
isNewPlayer = function (ident, client) {
	var bool = true;
	player.forEach(function(aPlayer, index) {
		if (aPlayer.userId == ident) {
			console.log('[SOCKET] Un joueur vient de se connecter mais il était déjà present dans la partie', ident, client.id);
			// Oui, on met donc à jour sont ID socket.io
			aPlayer.socketId = client.id;
			bool = false;
		}
	});

	return bool;
};

generatePlayer = function(ident, client) {
	// On va maintenant mettre une unité à sa disposition
	//@TODO il faudra ici ajouter plusieurs unité en fonction de la puissance du joueur
	units = [];


	for (i = 0; i < 2; i++) {
		unitId = uniqid();
		unit = new cu.class_unit('dumb', ident, null);
		unit.setUnitId(unitId);

		// Gestion gauche droite
		console.log(player.length);
		if (player.length == 0) {
			unit.setPosition(32*i);
		} else {
			unit.setPosition(32*i + 600);
		}
		units.push(unit);
	}

	// On sauvegarde une partie des infos pour identifier ce joueur par la suite.
	var aPlayer = {
		socketId: client.id,
		userId: ident,
		units: units
	}

	player.push(aPlayer);

	console.log('Un nouveau joueur vient de rejoindre la partie', ident, client.id);
};

initializePlayer = function(client) {
	player.forEach(function(aPlayer, index) {
		// Ce n'est pas le même joueur, donc on transmet toutes les unités
		aPlayer.units.forEach(function(unit) {
      console.log('DEBUG::::', client.id);
			if (client.id == aPlayer.socketId) {
				console.log("Transmission de son propre joueur");
				sprite = 'dude';
			} else {
				console.log("Transmission d'un joueur déjà present à un nouveau joueur");
				sprite = 'dude2'
			}
			console.log('Owner', unit.getOwner());
			client.emit('addUnit', sprite, unit.getPosition(), unit.getUnitId(), unit.getOwner());
		});
	});
};
