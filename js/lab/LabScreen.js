// Copyright 2014-2017, University of Colorado Boulder

/**
 * Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LabModel = require( 'PENDULUM_LAB/lab/model/LabModel' );
  const LabScreenView = require( 'PENDULUM_LAB/lab/view/LabScreenView' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!PENDULUM_LAB/screen.lab' );

  // images
  const labNavbarImage = require( 'mipmap!PENDULUM_LAB/lab-navbar-icon.png' );
  const labScreenImage = require( 'mipmap!PENDULUM_LAB/lab-screen-icon.png' );

  /**
   * @constructor
   */
  function LabScreen() {

    const options = {
      name: screenLabString,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new Image( labScreenImage ),
      navigationBarIcon: new Image( labNavbarImage )
    };

    Screen.call( this,
      function() { return new LabModel(); },
      function( model ) { return new LabScreenView( model ); },
      options
    );
  }

  pendulumLab.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
