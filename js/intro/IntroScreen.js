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
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var introString = require( 'string!PENDULUM_LAB/tab.intro' );

  /**
   * @constructor
   */
  function IntroScreen() {

    // icon for screen
    var icon = Rectangle.rect( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'white'
    } );

    // model coordinates are the same as view coordinates
    var mvt = ModelViewTransform2.createIdentity();

    Screen.call( this, introString, icon,
      function() { return new PendulumLabModel(); },
      function( model ) { return new PendulumLabView( model, mvt ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, IntroScreen );
} );