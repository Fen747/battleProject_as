exports.class_player = function ( userId_, units_, socketId_ ) {
  'use strict';

  if ( !userId_ || !units_ || !socketId_ ) {
    throw ({
      error: "invalid_init_args",
      msg: "Invalid argument provided while instaciating a player."
    })
    return ;
  }


  /*****************************************************************************
  ** Private attributes__
  */
  let userId = userId_ ,
      units = units_,
      socketId = socketId_,
      averageLatency = 0,
      waitingPing = new Array(),
      checkedPing = new Array(),
      offsetTimeClient = 0,
      self = this;
  /* __Private attributes
  *****************************************************************************/

  /*****************************************************************************
  ** Getters__
  */
  this.getUserId = ( ) => {
    return (userId);
  };
  this.getUnits = ( id ) => {
    return ( id ? units[id] : units );
  };
  this.getSocketId = ( ) => {
    return (socketId);
  };
  this.getAverageLatency = ( ) => {
    return (averageLatency);
  };
  this.getOffsetTimeClient = ( ) => {
    return (offsetTimeClient);
  };
  /* __Getters
  *****************************************************************************/

  /*****************************************************************************
  ** Setters__
  */
  this.setSocketId = ( socketId_ ) => {
    socketId = socketId_;
  };
  /* __Setters
  *****************************************************************************/

  /*****************************************************************************
  ** Public methods__
  */
  this.ping = ( n ) => {
    let d = new Date().getTime();

    waitingPing.push(d);
    socketsConnected[userId].emit("ping", d);

    setTimeout(function() {
      self.ping();
    }, 1000);
  };

  /**
  if (p1.t > p2.t)
{
  timeout (p1.t - p2.t) (emit2)
  emit1
}
else
{
  timeout (p2.t - p1.t) (emit1)
  emit2
}*/

  this.startPingWatch = ( ) => {

    // When the client pong
    socketsConnected[userId].on("pong", function (d, clientTimeStamp) {
      //console.log('PONG:'+userId+':', d);
      // On calcule la latence : temps serveur - temps client / 2 (aller - retour)
      var localTime = new Date().getTime();
      var offsetWithoutPing = localTime - clientTimeStamp;

      checkedPing.unshift((localTime - d) / 2);
      while (checkedPing.length > 5)
        checkedPing.pop();

      waitingPing = waitingPing.splice(waitingPing.indexOf(d), 1);

      let i = -1,
          tmp = 0;

      if (waitingPing.length > 5) {
        // TODO: if more than 5 null, then dc
        console.log("TU LAG BRO");
      }

      while (checkedPing[++i]) {
        tmp += checkedPing[i];
      }

      averageLatency = (tmp / (i + 1));
      offsetTimeClient =  offsetWithoutPing + averageLatency;
      //console.log('AVGL:'+userId+':'+averageLatency + ' --- Offset:'+offsetTimeClient );

    });

    self.ping();

  };
  /* __Public methods
  *****************************************************************************/
};
