// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model constructor for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function EnergyModel() {
    PendulumLabModel.call( this );

    // hide ruler by default
    this.ruler.isVisibleProperty.storeInitialValue( false );
    this.ruler.isVisible = false;

    // add energy mode property
    this.addProperty( 'isEnergyGraphExpanded', false );
    this.addProperty( 'energyGraphMode', EnergyGraphMode.ONE );
  }

  return inherit( PendulumLabModel, EnergyModel );
} );