class_action =  {
  move: function ( gameId, unitId, args ) {
    let game =   GameList.getGame(gameId);

    players = game.getPlayer();
    for (var player in players) {
      if (player.units[unitId]) {
        player.units[unitId].setAction(args);
      }
    }

    game.sendAction('all', 'move', unitId, args);
  },

  attack: function ( unit, target , args) {

  }
};
