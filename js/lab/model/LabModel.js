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
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PeriodTimer = require( 'PENDULUM_LAB/lab/model/PeriodTimer' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function LabModel( options ) {
    options = _.extend( {
      periodTraceRepeatable: false
    }, options );

    EnergyModel.call( this, options );

    // add properties to control visibility of arrows
    this.isVelocityVisibleProperty = new BooleanProperty( false );
    this.isAccelerationVisibleProperty = new BooleanProperty( false );

    // model for period trace
    this.periodTimer = new PeriodTimer( this.pendula, this.isPeriodTraceVisibleProperty );
  }

  pendulumLab.register( 'LabModel', LabModel );

  return inherit( EnergyModel, LabModel, {
    /**
     * Reset function that resets the pendula, settings, and period timer settings and default location
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
