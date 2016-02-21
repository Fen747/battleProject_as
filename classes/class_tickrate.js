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
  }, 1000/desiredFps);


  let predictNewTick = () => {
    for (let unit of unitList) {
      var currentX = unit.getPosition();

      if (unit.action.type === 'move') {
        // Calcul de la direction
        if (currentX > unit.action.toPos) {
          // On va vers la gauche
          unit.direction = -1;
        } else {
          // On va vers la droite
          unit.direction = 1;
        }
        var canMoveToX = unit.getMaxSpeed() * (1/desiredFps);
        canMoveToX *= unit.direction;
        unit.nextX = currentX + canMoveToX;
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
          var dimension1 = {
            right : unit.nextX + unit.getRadius(),
            left  : unit.nextX - unit.getRadius()
          };
          var dimension2 = {
            right : unit2.nextX + unit2.getRadius(),
            left  : unit2.nextX - unit2.getRadius()
          };

          if (dimension1.left.between(dimension2.left, dimension2.right) || dimension1.right.between(dimension2.left, dimension2.right)) {
            let nbPixel, a;

            // @TODO On a un doute sur la gestion de tous les cas
            if (unit.action.type == 'move') {
              if (dimension1.left.between(dimension2.left, dimension2.right)) {
                  // L'unité 1 collide avec l'unité 2 de la gauche vers la droite

                  // On calcule le nombre de pixel d'ecart entre la droite de l'unité 1 et la gauche de l'unité 2
                  nbPixel = dimension2.right - dimension1.left;

                  // On trouve le pixel entre les deux
                  unit.nextX += nbPixel;

              } else {
                  // L'unité 1 collide avec l'unité 2 de la droite vers la gauche
                  nbPixel = dimension1.right - dimension2.left;

                  unit.nextX -= nbPixel;
              }
            }

            console.log('Colision detected',  unit.nextX, unit2.nextX);

            unit.action.toPos = unit.nextX;

            // @TODO Ici, le serveur est déjà au courant de l'action à envoyer, inutile de le repréciser
            // @TODO Les untites doivent avoir au moins 1 ou 2 (suivant si cest paire ou impaire) entres chaques unités lors d'un collide.
            // Les unités devronts forcément avoir une portée d'attaque supérieure ou égale à 2

          }
        }
      }
    }

  };

  let applyTick = () => {
    for (let unit of unitList) {
      if (unit.action.type == 'move') {
        var currentX = unit.getPosition();

        // @TODO Il faut log pour checker si ça fonctionne
        if (Reached(unit)) {
          //unit.setAction();
          unit.direction = 0;
        }
        unit.setPosition(unit.nextX);
      }

      // DEBUG MOUVEMENT
      if (1) {
        var mesUnits = [];

        var mesPlayers = game.getPlayer();
      	for(var index in mesPlayers) {
          var aPlayer = mesPlayers[index];
      		for(var unit123 in aPlayer.getUnits()) {
            var aUnit = aPlayer.getUnits(unit123);
            mesUnits.push({id: unit123, position: aUnit.getPosition()});
      		}
      	}

        for(var index in mesPlayers) {
          socketsConnected[aPlayer.getUserId()].emit('majPosDebug', mesUnits);
        }

      }
    }
  };

  let Reached = (unit) => {
    return ( (unit.nextX <= unit.action.toPos && unit.direction == -1) ||  (unit.nextX >= unit.action.toPos && unit.direction == 1));
  };
}
