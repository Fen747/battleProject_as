exports.class_unit = function (aType, anOwner, position_) {
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

  let unitId = 'U_'+uniqid();
  /* __Private attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Public attributes__
  */
  this.action = {
    type : null
  };
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
  this.setAction	= ( type, action ) => {
    if (!type) {
      this.action = { type: null };
    } else {
      this.action = action;
      this.action.type = type;
    }
  };
  /* __Setters
  *****************************************************************************/
};
