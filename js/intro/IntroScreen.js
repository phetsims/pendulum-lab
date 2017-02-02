// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenIntroString = require( 'string!PENDULUM_LAB/screen.intro' );

  // images
  var introScreenImage = require( 'mipmap!PENDULUM_LAB/intro-screen-icon.png' );
  var introNavbarImage = require( 'mipmap!PENDULUM_LAB/intro-navbar-icon.png' );

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
      function( model ) { return new PendulumLabView( model, PendulumLabConstants.MODEL_VIEW_TRANSFORM ); },
      options
    );
  }

  pendulumLab.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
