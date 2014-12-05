//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var PeriodTimer = require( 'PENDULUM_LAB/lab/model/PeriodTimer' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function LabModel() {
    EnergyModel.call( this );

    // add properties to control visibility of arrows
    this.addProperty( 'isVelocityVisible', false );
    this.addProperty( 'isAccelerationVisible', false );

    // model for period trace
    this.periodTimerModel = new PeriodTimer( this.pendulumModels, this.property( 'isPeriodTraceVisible' ) );
  }

  return inherit( EnergyModel, LabModel, {
    reset: function() {
      EnergyModel.prototype.reset.call( this );

      // reset period trace model
      PropertySet.prototype.reset.call( this.periodTimerModel );
    }
  } );
} );