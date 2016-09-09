// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var LabModel = require( 'PENDULUM_LAB/lab/model/LabModel' );
  var LabView = require( 'PENDULUM_LAB/lab/view/LabView' );

  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenLabString = require( 'string!PENDULUM_LAB/screen.lab' );

  // images
  var labScreenImage = require( 'mipmap!PENDULUM_LAB/lab-screen-icon.png' );
  var labNavbarImage = require( 'mipmap!PENDULUM_LAB/lab-navbar-icon.png' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
      name: screenLabString,
      backgroundColor: PendulumLabConstants.BACKGROUND_COLOR,
      homeScreenIcon: new Image( labScreenImage ),
      navigationBarIcon: new Image( labNavbarImage )
    };

    Screen.call( this,
      function() { return new LabModel(); },
      //TODO magic number 2
      function( model ) { return new LabView( model, PendulumLabConstants.MODEL_VIEW_TRANSFORM, 195 ); },
      options
    );
  }

  pendulumLab.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );