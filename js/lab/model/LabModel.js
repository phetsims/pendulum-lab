// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var PeriodTimer = require( 'PENDULUM_LAB/lab/model/PeriodTimer' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function LabModel() {
    EnergyModel.call( this, false );

    // add properties to control visibility of arrows
    this.isVelocityVisibleProperty = new BooleanProperty( false );

    this.isAccelerationVisibleProperty = new BooleanProperty( false );

    // model for period trace
    this.periodTimer = new PeriodTimer( this.pendulums, this.isPeriodTraceVisibleProperty );
  }

  pendulumLab.register( 'LabModel', LabModel );

  return inherit( EnergyModel, LabModel, {
    /**
     * Reset function that resets the pendulums, settings, and period timer settings and default location
     * @public
     */
    reset: function() {
      EnergyModel.prototype.reset.call( this );

      this.isVelocityVisibleProperty.reset();
      this.isAccelerationVisibleProperty.reset();

      // reset period trace model
      this.periodTimer.reset();
    }
  } );
} );
