// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main model constructor for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  const Property = require( 'AXON/Property' );

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

  return inherit( PendulumLabModel, EnergyModel, {
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
} );
