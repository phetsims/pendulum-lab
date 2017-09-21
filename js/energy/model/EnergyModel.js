// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main model constructor for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function EnergyModel( options ) {
    options = _.extend( {
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
