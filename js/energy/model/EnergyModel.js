//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyGraphMode = require( 'PENDULUM_LAB/energy/EnergyGraphMode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var Range = require( 'DOT/Range' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function EnergyModel() {
    PendulumLabModel.call( this );

    // hide ruler bu default
    this.rulerModel.property( 'isVisible' ).storeInitialValue( false );
    this.rulerModel.isVisible = false;

    // friction coefficient description
    this.frictionRange = new Range( 0, 0.5115, 0 );
    this.addProperty( 'friction', this.frictionRange.defaultValue );

    // add energy mode property
    this.addProperty( 'isEnergyGraphExpanded', false );
    this.addProperty( 'energyGraphMode', EnergyGraphMode.ONE );
  }

  return inherit( PendulumLabModel, EnergyModel );
} );