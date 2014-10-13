//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var PendulumLabScreenView = require( 'PENDULUM_LAB/common/view/PendulumLabScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var IntroString = require( 'string!PENDULUM_LAB/tab.intro' );

  /**
   * @constructor
   */
  function IntroScreen( screenshotImage ) {

    // icon for screen
    var icon = Rectangle.rect( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'white'
    } );

    Screen.call( this, IntroString, icon,
      function() { return new PendulumLabModel(); },
      function( model ) { return new PendulumLabScreenView( model, screenshotImage ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, IntroScreen );
} );