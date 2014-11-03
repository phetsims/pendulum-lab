// Copyright 2002-2014, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );

  /**
   * @constructor
   */
  function Ruler() {
    Movable.call( this );

    // flag to controls visibility
    this.addProperty( 'isVisible', true );
  }

  return inherit( Movable, Ruler );
} );