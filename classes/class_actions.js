exports.class_action =  {
  move: function ( gameId, unitId, args ) {
    var game =   GameList.getGame(gameId);

    players = game.getPlayer();
    for (var player in players) {
      if (players[player].getUnits(unitId)) {
        players[player].getUnits(unitId).setAction(args);
      }
    }
  },

  attack: function ( unit, target , args) {

  }
};
