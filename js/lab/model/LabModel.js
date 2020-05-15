// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main model constructor for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import EnergyModel from '../../energy/model/EnergyModel.js';
import pendulumLab from '../../pendulumLab.js';
import PeriodTimer from './PeriodTimer.js';

/**
 * @constructor
 *
 * @param {Object} [options]
 */
function LabModel( options ) {
  options = merge( {
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

inherit( EnergyModel, LabModel, {
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
   * Reset function that resets the pendula, settings, and period timer settings and default positions
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

export default LabModel;
