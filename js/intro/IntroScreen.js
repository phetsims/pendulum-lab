// Copyright 2014-2015, University of Colorado Boulder

/**
 * Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIntroString = require( 'string!PENDULUM_LAB/screen.intro' );

  // images
  var introNavbarImage = require( 'mipmap!PENDULUM_LAB/intro-navbar-icon.png' );
  var introScreenImage = require( 'mipmap!PENDULUM_LAB/intro-screen-icon.png' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: screenIntroString,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new Image( introScreenImage ),
      navigationBarIcon: new Image( introNavbarImage )
    };

    Screen.call( this,
      function() { return new PendulumLabModel( true ); },
      function( model ) { return new PendulumLabView( model ); },
      options
    );
  }

  pendulumLab.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
