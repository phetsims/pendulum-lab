// Copyright 2014-2015, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );

  /**
   * @param {Object} [properties] for extending by this constructor.
   * @constructor
   */
  function Stopwatch( properties ) {
    Movable.call( this, _.extend( {
      isVisible: false, // flag to control stopwatch visibility
      isRunning: false, // flag to determine stopwatch state
      elapsedTime: 0 // passed time
    }, properties ) );
  }

  pendulumLab.register( 'Stopwatch', Stopwatch );

  return inherit( Movable, Stopwatch );
} );