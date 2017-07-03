// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
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
      rulerInitiallyVisible: false // Hide the ruler by default on the energy screens
    }, options );

    PendulumLabModel.call( this, options );

    // add energy mode property
    this.isEnergyGraphExpandedProperty = new BooleanProperty( false );
    this.energyGraphModeProperty = new Property( EnergyGraphMode.ONE );
  }

  pendulumLab.register( 'EnergyModel', EnergyModel );

  return inherit( PendulumLabModel, EnergyModel, {
    /**
     * Function that resets all the property associated with the energy model
     * @public
     */
    reset: function() {
      PendulumLabModel.prototype.reset.call( this );
      this.isEnergyGraphExpandedProperty.reset();
      this.energyGraphModeProperty.reset();
    }
  } );
} );
