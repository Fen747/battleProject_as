exports.class_gameList = function () {
  'use strict';
  /*****************************************************************************
  ** Private attributes__
  */
  let gameList  = {},
      nb_game   = 0;
  /* __Private attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Getters__
  */
  this.getGame = ( id ) => {
    return ( id ? gameList[id] : gameList);
  };
  this.getNbGame     = ( ) => {
    return nb_game;
  };
  this.getGameFromUid = ( ) => {
    // TODO return attr.startedAt;
  };
  /* __Getters
  *****************************************************************************/

  /*****************************************************************************
  ** Public methods__
  */
  this.endAllGames = ( ) => {
    for (let game in gameList) {
      gameList.end();
    }
    // TODO gerer db
  };
  this.startNewGame = ( p1, p2 ) => {

    // @FIXME On supprime toutes les parties en cours pour n'en garder qu'une seule
    let gameListDB = dbmongo.collection('gameListDB');
    gameList = {};

    let NBREMOVED = gameListDB.remove({}, function() {

      let game = new oGameObject();

      let gameId = game.get_id();

      gameList[gameId] = game;

      // On insere uen nouvelle partie en base de données

      gameListDB.insert({
            _id: gameId,
            players   : [{
              _id   : p1,
              ready : true
            },{
              _id   : p2,
              ready: true
            }
          ],
            unitList  : []
      }, function(err, result) {
        p1 = generatePlayer(p1, socketsConnected[p1], game);
        game.addPlayer(p1);
        p2 = generatePlayer(p2, socketsConnected[p2], game);
        game.addPlayer(p2);

        // On lance le tickrate de la Partie
        game.start();

        // On envoie un ordre a ces deux clients pour leur dire de rejoindre la partie ( /game )
        console.log('[MATCHMAKING] -- Partie crée avec l\'ID : ' + gameId);

        socketsConnected[p1.getUserId()].emit('joinGame', gameId);
        socketsConnected[p2.getUserId()].emit('joinGame', gameId);
      });
    });
  };
  /* __Public methods
  *****************************************************************************/

};
