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
    var self = this, activePendulum = pendulumModels[0];

    Stopwatch.call( this, {
      isVisible: false, // flag to control visibility of timer
      isFirst: true, // flag to trace timer pendulum
      isCalculate: false // flag to trace time calculating
    } );

    // hide all traces
    var hideTraces = function() {
      pendulumModels.forEach( function( pendulumModel ) {
        pendulumModel.periodTrace.isVisible = false;
      } );
    };

    // add visibility observer
    isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
      self.isVisible = isPeriodTraceVisible;
      hideTraces();
    } );

    // clear timer before starting calculating
    this.property( 'isCalculate' ).onValue( true, function() {
      self.elapsedTime = 0;
    } );

    this.property( 'isRunning' ).link( function( isRunning ) {
      if ( isRunning ) {
        // show trace path
        activePendulum.periodTrace.isVisible = true;
      }
      else {
        // clear time when timer revert to init state
        self.elapsedTime = 0;

        // stop calculating when timer stop
        self.isCalculate = false;

        // hide trace path
        activePendulum.periodTrace.isVisible = false;
      }
    } );

    // create listeners
    var pathListeners = [];
    pendulumModels.forEach( function( pendulumModel, pendulumIndex ) {
      pendulumModel.periodTrace.isRepeat = false;
      pendulumModel.periodTrace.isVisible = false;

      pathListeners[pendulumIndex] = function() {
        if ( pendulumModel.periodTrace.pathPoints.length === 1 && self.isRunning ) {
          self.isCalculate = true;
        }
        else if ( (pendulumModel.periodTrace.pathPoints.length === 4 || pendulumModel.periodTrace.pathPoints.length === 0) && self.isRunning ) {
          self.isCalculate = false;
        }
      };
    } );

    // add path listeners
    pendulumModels[0].periodTrace.pathPoints.addItemAddedListener( pathListeners[0] );
    this.property( 'isFirst' ).lazyLink( function( isFirst ) {
      if ( isFirst ) {
        activePendulum.periodTrace.pathPoints.removeItemAddedListener( pathListeners[1] );
        activePendulum = pendulumModels[0];
        activePendulum.periodTrace.pathPoints.addItemAddedListener( pathListeners[0] );
      }
      else {
        activePendulum.periodTrace.pathPoints.removeItemAddedListener( pathListeners[0] );
        activePendulum = pendulumModels[1];
        activePendulum.periodTrace.pathPoints.addItemAddedListener( pathListeners[1] );
      }
    } );

  }

  return inherit( Stopwatch, PeriodTimer );
} );