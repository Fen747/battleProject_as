exports.class_tickRate = function(game_) {
  "use strict";

  let game = game_,
      iTick = 0,
      desiredFps = 25,
      unitList = new Set(),
      instanceTickRate = null;

  // On crée un tableau d'unité pour les exploiter plus facilement par la suite
  let players = game.getPlayer();

  for (var player in players) {

    let units = players[player].getUnits();

    for (var unit in units) {
      unitList.add(units[unit]);
    }
  }

  // On lance les ticks
  instanceTickRate = setInterval(function() {
    iTick++;
    predictNewTick();
    checkColision();
    applyTick();
  }, (1000 / desiredFps));

  let _stopUnit = u => {
    u.setAction();
    u.direction = 0;
  };

  let _getPlayers = () => game.getPlayer();

  let _updateUnitNextPosition = u => u.action.toPos = u.nextX;

  let _canMoveToX = (u) => {
    return u.getMaxSpeed() * (1 / desiredFps) * u.direction;
  };

  let predictNewTick = () => {

    for (let unit of unitList) {

      let currentX = unit.getPosition();

      if (unit.action.type === 'move') {
        // Calcul de la direction
        if (currentX > unit.action.toPos) {
          // On va vers la gauche
          unit.direction = -1;
        } else {
          // On va vers la droite
          unit.direction = 1;
        }

        unit.nextX = currentX + _canMoveToX(unit);

        if (Reached(unit)) {
          unit.nextX = unit.action.toPos;
        }
      }
    }
  };

  let checkColision = () => {

    for (let unit of unitList) {

      for (let unit2 of unitList) {

        if (!Object.is(unit, unit2)) {

          let dimension1 = {
            right : unit.nextX + unit.getRadius(),
            left  : unit.nextX - unit.getRadius()
          };
          let dimension2 = {
            right : unit2.nextX + unit2.getRadius(),
            left  : unit2.nextX - unit2.getRadius()
          };

          if (dimension1.left.between(dimension2.left, dimension2.right) || dimension1.right.between(dimension2.left, dimension2.right)) {

            if (unit.action.type == 'move') {
              // L'unité 1 collide avec l'unité 2

              if (dimension1.left.between(dimension2.left, dimension2.right)) {
                  // On calcule le nombre de pixel d'ecart entre la gauche de l'unité 1 et la droite de l'unité 2
                  unit.nextX += dimension2.right - dimension1.left + 1;
              } else if (dimension1.right.between(dimension2.left, dimension2.right))  {
                  // On calcule le nombre de pixel d'ecart entre la droite de l'unité 1 et la gauche de l'unité 2
                  unit.nextX -= dimension1.right - dimension2.left + 1 ;
              }
            }

            console.log('Colision detected', unit.getUnitId(), unit2.getUnitId(), unit.nextX, unit2.nextX);
            _updateUnitNextPosition(unit);
          }
        }
      }
    }

  };

  // We apply the changes we computed
  let applyTick = () => {

    for (let unit of unitList) {

      if (unit.action.type == 'move') {
        // @TODO Il faut log pour checker si ça fonctionne
        if (Reached(unit)) {
          _stopUnit(unit);
        }

        unit.setPosition(unit.nextX);
      }

      // UPDATE MOUVEMENT
      if (!(iTick % 2)) {
        let players = _getPlayers(),
            units = [];

      	for (let index in players) {

          let aPlayer = players[index];

      		for (let unit_id in aPlayer.getUnits()) {
            units.push({
              id        : unit_id,
              position  : aPlayer.getUnits(unit_id).getPosition()
            });
      		}
      	}

        for (let index in players) {
          socketsConnected[players[index].getUserId()].emit('update_unit_pos', units);
        }

      }

      // Si l'action n'est pas send, on l'envoie
      if (!unit.action.hasNotBeenSent) {
        unit.actionDep.changed();
      }

    }
  };

  let Reached = (unit) => {
    return ( (unit.nextX <= unit.action.toPos && unit.direction == -1) ||  (unit.nextX >= unit.action.toPos && unit.direction == 1));
  };
}
