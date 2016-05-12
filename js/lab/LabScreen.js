// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'PENDULUM_LAB/lab/model/LabModel' );
  var LabView = require( 'PENDULUM_LAB/lab/view/LabView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenLabString = require( 'string!PENDULUM_LAB/screen.lab' );

  // images
  var labImage = require( 'mipmap!PENDULUM_LAB/lab-screen-icon.png' );

  /**
   * @constructor
   */
  function LabScreen() {

    // model coordinates are the same as view coordinates
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( PendulumLabConstants.MODEL_BOUNDS, PendulumLabConstants.SIM_BOUNDS );

    Screen.call( this, screenLabString, new Image( labImage ),
      function() { return new LabModel(); },
      function( model ) { return new LabView( model, modelViewTransform, 225 ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  pendulumLab.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );