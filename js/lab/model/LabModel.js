// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main model constructor for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  const inherit = require( 'PHET_CORE/inherit' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PeriodTimer = require( 'PENDULUM_LAB/lab/model/PeriodTimer' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function LabModel( options ) {
    options = _.extend( {
      hasPeriodTimer: true,
      energyBoxExpanded: false
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
     * Returns the pendula to rest.
     * @public
     * @override
     */
    returnPendula: function() {
      EnergyModel.prototype.returnPendula.call( this );

      this.periodTimer.isRunningProperty.value = false;
    },

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
