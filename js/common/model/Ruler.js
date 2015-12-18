// Copyright 2014-2015, University of Colorado Boulder

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
    Movable.call( this, {
      isVisible: true // flag to control ruler visibility
    } );

    // length of ruler in meters
    this.length = 1;
  }

  return inherit( Movable, Ruler );
} );