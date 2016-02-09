// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function LabModel() {
    EnergyModel.call( this, false );

    // add properties to control visibility of arrows
    this.addProperty( 'isVelocityVisible', false );
    this.addProperty( 'isAccelerationVisible', false );
  }

  return inherit( EnergyModel, LabModel );
} );