// Copyright 2002-2014, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
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
  function Stopwatch( options ) {
    Movable.call( this, _.extend( {
      isVisible: false, // flag to control stopwatch visibility
      isRunning: false, // flag to determine stopwatch state
      elapsedTime: 0 // passed time
    }, options ) );
  }

  return inherit( Movable, Stopwatch );
} );