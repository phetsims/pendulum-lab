//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var EnergyString = require( 'string!PENDULUM_LAB/tab.energy' );

  /**
   * @constructor
   */
  function EnergyScreen( screenshotImage ) {

    // icon for screen
    var icon = Rectangle.rect( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'white'
    } );

    Screen.call( this, EnergyString, icon,
      function() { return new PendulumLabModel(); },
      function( model ) { return new PendulumLabView( model, screenshotImage ); },
      { backgroundColor: PendulumLabConstants.SIMULATION_BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, EnergyScreen );
} );