// Copyright 2014-2015, University of Colorado Boulder

/**
 * Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'PENDULUM_LAB/lab/model/LabModel' );
  var LabView = require( 'PENDULUM_LAB/lab/view/LabView' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenLabString = require( 'string!PENDULUM_LAB/screen.lab' );

  // images
  var labNavbarImage = require( 'mipmap!PENDULUM_LAB/lab-navbar-icon.png' );
  var labScreenImage = require( 'mipmap!PENDULUM_LAB/lab-screen-icon.png' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
      name: screenLabString,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new Image( labScreenImage ),
      navigationBarIcon: new Image( labNavbarImage )
    };

    Screen.call( this,
      function() { return new LabModel(); },
      //TODO magic number 2
      //TODO: MVT can be abstracted out?
      function( model ) { return new LabView( model, 195 ); },
      options
    );
  }

  pendulumLab.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
