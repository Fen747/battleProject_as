mongo = require("mongodb");
Cursor = mongo.Cursor;
var mongoURL = "mongodb://127.0.0.1:3001/meteor";

exports.MatchMaking = function() {
  "use strict";

  let test = '';

  this.findWar = ( ) => {
        console.log('-- On commence à chercher des joueurs dans la file d\'attente');

        var MatchMaker = this;

        mongo.MongoClient.connect(mongoURL, function (err, db) {
    				var users = db.collection ("users");

    				users.find({
              'battle.ready': true
            },
            {
              sort: {_id:1},
              limit:2
            }).toArray(function(err, user) {
              MatchMaker.makeGame(user);

    					db.close();
    			  });
    			});
  };

  this.makeGame = ( tabUserDispo ) => {
    if (tabUserDispo.length == 2) {
      console.log('[MATCHMAKING] -- On a trouvé deux joueurs, lancement d\'une partie !');
      // Si on a deux joueurs dispo, on crée une partie
      var player1 = tabUserDispo[0];
      var player2 = tabUserDispo[1];

      mongo.MongoClient.connect(mongoURL, function(err, db) {
        // Les deux joueurs sélectionnés sont retirés du match making
        var users = db.collection('users');
        users.update({
          _id: { $in: [player1._id, player2._id] }
        }, {
          $set: {'battle.ready': false}
        }, {
          multi: true
        });


        // On insere uen nouvelle partie en base de données
        var gameListDB = db.collection('gameListDB');
        gameListDB.insert({
              players   : [{
                _id   : player1._id,
                ready : true
              },{
                _id   : player2._id,
                ready: true
              }
            ],
              unitList  : []
        }, function(err, result) {
          generatePlayer(player1._id, socketsConnected[player1._id]);
          generatePlayer(player2._id, socketsConnected[player2._id]);

          // On envoie un ordre a ces deux clients pour leur dire de rejoindre la partie ( /game )
          console.log('[MATCHMAKING] -- Partie crée avec l\'ID : ' + result.ops[0]._id);

          socketsConnected[player1._id].emit('joinGame', result.ops[0]._id);
          socketsConnected[player2._id].emit('joinGame', result.ops[0]._id);
        });



      });
    } else {
      console.log('[MATCHMAKING] -- Aucune partie possible pour le moment ('+tabUserDispo.length + '/2)');
      console.log('[MATCHMAKING] -- Abandon de la recherche. En attente d\'un nouveau joueur dans la file');
    }
  };

}
