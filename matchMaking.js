mongo = require("mongodb");
Cursor = mongo.Cursor;

exports.MatchMaking = function() {
  "use strict";

  let test = '';

  this.findWar = ( ) => {
        console.log('[MATCHMAKING] -- On commence à chercher des joueurs dans la file d\'attente');

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
            
              MatchMaker.makeGame(user, db);

    					db.close();
    			  });
    			});
  };

  this.makeGame = ( tabUserDispo, db ) => {
    if (tabUserDispo.length == 2) {
      console.log('[MATCHMAKING] -- On a trouvé deux joueurs, lancement d\'une partie !');
      // Si on a deux joueurs dispo, on crée une partie
      var player1 = tabUserDispo[0];
      var player2 = tabUserDispo[1];

      // Les deux joueurs sélectionnés sont retirés du match making
      var users = db.collection('users');
      users.update({
        _id: { $in: [player1._id, player2._id] }
      }, {
        $set: {'battle.ready': false}
      }, {
        multi: true
      });

      GameList.startNewGame(player1._id, player2._id);

    } else {
      console.log('[MATCHMAKING] -- Aucune partie possible pour le moment ('+tabUserDispo.length + '/2)');
      console.log('[MATCHMAKING] -- Abandon de la recherche. En attente d\'un nouveau joueur dans la file');
    }
  };

}
