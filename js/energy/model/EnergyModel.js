// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @param {boolean} isPeriodTraceRepeating
   * @constructor
   */
  function EnergyModel( isPeriodTraceRepeating ) {
    PendulumLabModel.call( this, isPeriodTraceRepeating );

    // hide ruler by default
    this.ruler.isVisible = false;

    // add energy mode property
    this.addProperty( 'isEnergyGraphExpanded', false );
    this.addProperty( 'energyGraphMode', EnergyGraphMode.ONE );
  }

  pendulumLab.register( 'EnergyModel', EnergyModel );

  return inherit( PendulumLabModel, EnergyModel, {
    /**
     * Function that resets all the property associated with the energy model
     * @public
     */
    reset: function() {
      PendulumLabModel.prototype.reset.call( this );

      this.ruler.isVisible = false;
    }
  } );
} );
