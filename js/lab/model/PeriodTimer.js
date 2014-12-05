// Copyright 2002-2014, University of Colorado Boulder

/**
 * Period timer model in 'Pendulum Lab' simulation.
 * Calculate period time of first or second pendulum.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  /**
   * @param {Array} pendulumModels - Array of pendulum models.
   * @param {Property} isPeriodTraceVisibleProperty - Property to control visibility of period trace path.
   *
   * @constructor
   */
  function PeriodTimer( pendulumModels, isPeriodTraceVisibleProperty ) {
    var self = this;

    Stopwatch.call( this, {
      isFirst: true, // flag to trace timer pendulum
      isCalculate: false // flag to trace time calculating
    } );

    // add visibility observer
    isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
      self.isVisible = isPeriodTraceVisible;
    } );

    // clear timer before starting calculating
    this.property( 'isCalculate' ).onValue( true, function() {
      self.elapsedTime = 0;
    } );

    this.property( 'isRunning' ).link( function( isRunning ) {
      if ( isRunning ) {
        // clear time when timer start
        self.elapsedTime = 0;
      }
      else {
        // stop calculating when timer stop
        self.isCalculate = false;
      }
    } );

    // create listeners
    var pathListeners = [];
    pendulumModels.forEach( function( pendulumModel, pendulumIndex ) {
      pathListeners[pendulumIndex] = function() {
        if ( pendulumModel.pathPoints.length === 1 && self.isRunning ) {
          self.isCalculate = true;
        }
        else if ( (pendulumModel.pathPoints.length === 4 || pendulumModel.pathPoints.length === 0) && self.isRunning ) {
          self.isCalculate = false;
        }
      };
    } );

    // add path listeners
    pendulumModels[0].pathPoints.addItemAddedListener( pathListeners[0] );
    this.property( 'isFirst' ).lazyLink( function( isFirst ) {
      if ( isFirst ) {
        pendulumModels[1].pathPoints.removeItemAddedListener( pathListeners[1] );
        pendulumModels[0].pathPoints.addItemAddedListener( pathListeners[0] );
      }
      else {
        pendulumModels[0].pathPoints.removeItemAddedListener( pathListeners[0] );
        pendulumModels[1].pathPoints.addItemAddedListener( pathListeners[1] );
      }
    } );

  }

  return inherit( Stopwatch, PeriodTimer );
} );