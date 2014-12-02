// Copyright 2002-2014, University of Colorado Boulder

/**
 * Period trace model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  /**
   * @param {Property} isPeriodTraceVisibleProperty - Property to control visibility of period trace path.
   *
   * @constructor
   */
  function PeriodTrace( isPeriodTraceVisibleProperty ) {
    var self = this;

    Stopwatch.call( this, {
      isFirst: true // flag to trace timer pendulum
    } );

    // add visibility observer
    isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
      self.isVisible = isPeriodTraceVisible;
    } );

    this.property( 'isRunning' ).onValue( false, function() {
      self.elapsedTime = 0;
    } );
  }

  return inherit( Stopwatch, PeriodTrace );
} );