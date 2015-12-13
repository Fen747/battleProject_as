exports.class_unit = function (aType, anOwner, aPhaserItem) {
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
      effects     : [],
      position    : [],
      phaser_item : aPhaserItem || null,
      speed       : {
        max     : 200,
        current : 0
      }
  };

  let unitId = null;
  /* __Private attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Public attributes__
  */
  this.action = {
    type : null
  };
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
  this.getPhaserItem  = ( ) => {
    return attr.phaser_item;
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
  }
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
  }
  /* __Setters
  *****************************************************************************/
};
