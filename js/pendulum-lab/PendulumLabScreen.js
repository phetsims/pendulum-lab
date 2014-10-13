//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author 0
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PendulumLabModel = require( 'PENDULUM_LAB/pendulum-lab/model/PendulumLabModel' );
  var PendulumLabScreenView = require( 'PENDULUM_LAB/pendulum-lab/view/PendulumLabScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var pendulumLabSimString = require( 'string!PENDULUM_LAB/pendulum-lab.name' );

  /**
   * @constructor
   */
  function PendulumLabScreen( screenshotImage ) {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = Rectangle.rect( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'white'
    } );

    Screen.call( this, pendulumLabSimString, icon,
      function() { return new PendulumLabModel(); },
      function( model ) { return new PendulumLabScreenView( model, screenshotImage ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, PendulumLabScreen );
} );