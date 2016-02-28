exports.class_unit = function (aType, anOwner, position_, game_) {
  "use strict";

  /*****************************************************************************
  ** Private attributes__
  */
  let attr = {
      type        : aType || null,
      owner       : anOwner || null,
      troopSize   : 100,
      moral       : 100,
      energy      : 100,
      lifePoints  : 100,
      damage      : 1,
      range       : 3,
      radius      : 16,
      effects     : [],
      position    : position_,

      speed       : {
        max     : 200,
        current : 0
      }
  };

  let game = game_;

  let unitId = 'U_'+uniqid();

  let self = this;
  /* __Private attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Public attributes__
  */
  this.action = {
    type : null,
    hasNotBeenSent: false
  };
  this.actionDep = new Tracker.Dependency;

  this.nextX = position_;
  /* __Public attributes
  *****************************************************************************/


  /*****************************************************************************
  ** Getters__
  */
  this.getType      = ( ) => {
    return attr.type;
  };
  this.getOwner     = ( ) => {
    return attr.owner;
  };
  this.getTroopSize = ( ) => {
    return attr.troopSize;
  };
  this.getMoral     = ( ) => {
    return attr.moral;
  };
  this.getEffects   = ( ) => {
    return attr.effets;
  };
  this.getPosition  = ( ) => {
    return attr.position;
  };
  this.getCurSpeed  = ( ) => {
    return attr.speed.current;
  };
  this.getMaxSpeed  = ( ) => {
    return attr.speed.max;
  };
  this.getAttr      = ( ) => {
    return attr;
  };
  this.getUnitId	= ( ) => {
	  return unitId;
  };
  this.getRadius	= ( ) => {
    return attr.radius;
  };
  this.getGame	= ( ) => {
    return game;
  };
  /* __Getters
  *****************************************************************************/

  /*****************************************************************************
  ** Setters
  */
  this.setType      = ( aType ) => {
    attr.type = aType;
  };
  this.setOwner     = ( anOwner ) => {
    attr.owner = anOwner;
  };
  this.setTroopSize = ( aTroopSize ) => {
    attr.troopSize = aTroopSize;
  };
  this.setMoral     = ( aMoral ) => {
    attr.moral = aMoral;
  };
  this.setAnEffect   = ( anEffect ) => {
    return attr.effets;
  };
  this.unsetAnEffect = ( anEffect ) => {
    return attr.effets;
  };
  this.setPosition  = ( aPosition ) => {
    attr.position = aPosition;
  };
  this.setCurSpeed  = ( aSpeed ) => {
    attr.speed.current = aSpeed;
  };
  this.setUnitId	= ( id ) => {
	  if (unitId == null) {
		  unitId = id;
	  }
  };
  this.setAction = ( action, doNotSend ) => {
    return this.equalFunc(self, action, doNotSend);
  };

  let callSendAction = Tracker.autorun(function(thisComp) {
    self.actionDep.depend();
    if (!thisComp.firstRun){
      game.sendAction(self);
    }
  });
  /* __Setters
  *****************************************************************************/
};

exports.class_unit.prototype.equalFunc = (self, nextAction_, doNotSend) => {
  "use strict";
  let nextAction = nextAction_ || {type: null, hasNotBeenSent: false};

  if (self.action && self.action.type !== nextAction.type) {
    // L'action est de type differente, donc on informe les clients directement
    self.writeAction(nextAction, doNotSend);
    return false;
  } else {
    for (let key in nextAction) {
      // L'action est de même type, on va vérifier que les arguments aient changés, si oui, on informe les joueurs, sinon RAS
      // @FIXME On ne peut surement pas passer d'object dans nos arguments action
      if (!(self.action.hasOwnProperty(key) && self.action[key] === nextAction[key])) {
        // Au moins un argument a changé, on informe les clients
        self.writeAction(nextAction, doNotSend);
        return false;
      }
    }
  }

  return true;
};

exports.class_unit.prototype.writeAction = function (nextAction, doNotSend) {
  this.action = nextAction;

  if (!doNotSend) {
    this.actionDep.changed();
  }
};
