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
    type : null
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
  this.getAction  = ( ) => {
    return attr.action;
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
  this.setAction = function( action ) {
    this.equalFunc(self, action);
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

exports.class_unit.prototype.equalFunc = (self, nextAction) => {
  var nextAction = nextAction || {type: null};

  if (self.action && self.action.type !== nextAction.type) {
    console.log('toto1');
    self.writeAction(nextAction);
    return false;
  } else {
    for (var key in nextAction) {
      console.log('toto2');
      // @FIXME On ne peut surement pas passer d'object dans nos arguments action
      if (!(self.action.hasOwnProperty(key) && self.action[key] === nextAction[key])) {
        console.log('toto3');
        self.writeAction(nextAction);
        return false;
      }
    }
  }

  return true;
};

exports.class_unit.prototype.writeAction = function (nextAction) {
  console.log('On rentre dans writeaction');
  this.action = nextAction;

  this.actionDep.changed();
};
