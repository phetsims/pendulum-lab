// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenEnergyString = require( 'string!PENDULUM_LAB/screen.energy' );

  // images
  var energyImage = require( 'mipmap!PENDULUM_LAB/energy-screen-icon.png' );

  /**
   * @constructor
   */
  function EnergyScreen() {

    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( PendulumLabConstants.MODEL_BOUNDS, PendulumLabConstants.SIM_BOUNDS );

    Screen.call( this, screenEnergyString, new Image( energyImage ),
      function() { return new EnergyModel( true ); },
      function( model ) { return new EnergyView( model, modelViewTransform ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, EnergyScreen );
} );