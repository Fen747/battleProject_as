exports.class_gameObject = function () {
  "use strict";

  /*****************************************************************************
  ** Private attributes__
  */
  let attr = {
      pl        : {},
      _id       : uniqid(),
      startedAt : new Date(),
      endedAt   : null
  };

  let nbPlayer = 0;
  /* __Private attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Public attributes__
  */
  /* __Public attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Public methods__
  */
  this.end = ( ) => {
    attr.endedAt = new Date();
    // TODO
  };
  /* __Public methods
  *****************************************************************************/

  /*****************************************************************************
  ** Getters__
  */
  this.getPlayer    = ( userId ) => {
    return (userId ? attr.pl[userId] : attr.pl);
  };
  this.get_id     = ( ) => {
    return attr._id;
  };
  this.getStartedAt = ( ) => {
    return attr.startedAt;
  };
  this.getEndedAt     = ( ) => {
    return attr.endedAt;
  };
  this.getAttr      = ( ) => {
    return attr;
  };
  this.getNbPlayer = () => {
    return nbPlayer;
  };
  /* __Getters
  *****************************************************************************/

  /*****************************************************************************
  ** Setters
  */
  this.addPlayer = (player) => {
    if (nbPlayer < 2) {
      attr.pl[player.userId] = player;
      nbPlayer++;
    }
  };


  this.sendAction = (who, action, unitId, args) => {
    players = this.getPlayer();

    console.log('[SOCKET] On informe tous les joueurs dune nouvelle action');

    args.type = action;

    for (var player in players) {
        socketsConnected[players[player].userId].emit('validatedAction', unitId, args);
    }
  };
  /* __Setters
  *****************************************************************************/


  return this;
};

exports.class_gameObject.prototype = {
  getGameFromUid : function (uid) {

  }
};
