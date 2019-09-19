// Copyright 2014-2017, University of Colorado Boulder

/**
 * Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  const PendulumLabScreenView = require( 'PENDULUM_LAB/common/view/PendulumLabScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenIntroString = require( 'string!PENDULUM_LAB/screen.intro' );

  // images
  const introNavbarImage = require( 'mipmap!PENDULUM_LAB/intro-navbar-icon.png' );
  const introScreenImage = require( 'mipmap!PENDULUM_LAB/intro-screen-icon.png' );

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
      function() { return new PendulumLabModel(); },
      function( model ) { return new PendulumLabScreenView( model ); },
      options
    );
  }

  pendulumLab.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
