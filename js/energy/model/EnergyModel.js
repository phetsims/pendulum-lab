// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main model constructor for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PendulumLabModel from '../../common/model/PendulumLabModel.js';
import pendulumLab from '../../pendulumLab.js';

/**
 * @constructor
 *
 * @param {Object} [options]
 */
function EnergyModel( options ) {
  options = merge( {
    rulerInitiallyVisible: false, // Hide the ruler by default on the energy screens
    energyBoxExpanded: true
  }, options );

  PendulumLabModel.call( this, options );

  // add energy mode property
  this.isEnergyBoxExpandedProperty = new BooleanProperty( options.energyBoxExpanded );

  // @public {Property.<Pendulum>} - The pendulum whose energy will be displayed in the plot.
  this.activeEnergyPendulumProperty = new Property( this.pendula[ 0 ] );
}

pendulumLab.register( 'EnergyModel', EnergyModel );

inherit( PendulumLabModel, EnergyModel, {
  /**
   * Function that resets all the property associated with the energy model
   * @public
   */
  reset: function() {
    PendulumLabModel.prototype.reset.call( this );
    this.isEnergyBoxExpandedProperty.reset();
    this.activeEnergyPendulumProperty.reset();
  }
} );

export default EnergyModel;