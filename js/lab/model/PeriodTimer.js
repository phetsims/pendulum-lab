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
   * @param {Array} pendulums - Array of pendulum models.
   * @param {Property<boolean>} isPeriodTraceVisibleProperty - Property to control visibility of period trace path.
   *
   * @constructor
   */
  function PeriodTimer( pendulums, isPeriodTraceVisibleProperty ) {
    var self = this;

    Stopwatch.call( this, {
      isVisible: false, // flag to control visibility of timer
      isFirst: true, // flag to trace timer pendulum
      isCalculate: false // flag to trace time calculating
    } );

    this.activePendulum = pendulums[ 0 ];

    // add visibility observer
    isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
      self.stop();
      self.isVisible = isPeriodTraceVisible;

      // hide all traces
      pendulums.forEach( function( pendulum ) {
        pendulum.periodTrace.removeVisibilityObservers();
        pendulum.periodTrace.isVisible = false;
      } );
    } );

    // clear timer before starting calculating
    this.property( 'isCalculate' ).onValue( true, function() {
      self.elapsedTime = 0;
    } );

    this.property( 'isRunning' ).link( function( isRunning ) {
      if ( isRunning ) {
        // clear time when timer revert to init state
        self.elapsedTime = 0;

        // reset and show trace path
        self.activePendulum.periodTrace.pathPoints.reset();
        self.activePendulum.periodTrace.isVisible = true;
      }
      else {
        // stop calculating when timer stop
        self.isCalculate = false;
      }
    } );

    var updateTimer = function() {
      if ( self.isCalculate ) {
        self.elapsedTime = 0;
        self.isCalculate = false;
      }
    };

    // create listeners
    var pathListeners = [];
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      pendulum.periodTrace.isRepeat = false;
      pendulum.periodTrace.isVisible = false;

      pendulum.property( 'length' ).lazyLink( updateTimer );
      pendulum._gravityProperty.lazyLink( updateTimer );
      pendulum.property( 'isUserControlled' ).lazyLink( updateTimer );
      self.property( 'isVisible' ).onValue( false, updateTimer );

      pathListeners[ pendulumIndex ] = function() {
        if ( pendulum.periodTrace.pathPoints.length === 1 && self.isRunning ) {
          self.isCalculate = true;
        }
        else if ( (pendulum.periodTrace.pathPoints.length === 4 || pendulum.periodTrace.pathPoints.length === 0) && self.isRunning ) {
          self.isRunning = false;
        }
      };

    } );

    // add path listeners
    pendulums[ 0 ].periodTrace.pathPoints.addItemAddedListener( pathListeners[ 0 ] );
    this.property( 'isFirst' ).lazyLink( function( isFirst ) {
      self.activePendulum.periodTrace.pathPoints.reset();
      self.clear();

      if ( isFirst ) {
        self.activePendulum.periodTrace.pathPoints.removeItemAddedListener( pathListeners[ 1 ] );
        self.activePendulum = pendulums[ 0 ];
        self.activePendulum.periodTrace.pathPoints.addItemAddedListener( pathListeners[ 0 ] );
      }
      else {
        self.activePendulum.periodTrace.pathPoints.removeItemAddedListener( pathListeners[ 0 ] );
        self.activePendulum = pendulums[ 1 ];
        self.activePendulum.periodTrace.pathPoints.addItemAddedListener( pathListeners[ 1 ] );
      }

      if ( self.isRunning ) {
        self.activePendulum.periodTrace.isVisible = true;
      }
    } );
  }

  return inherit( Stopwatch, PeriodTimer, {
    clear: function() {
      this.activePendulum.periodTrace.isVisible = false;
      this.isCalculate = false;
      this.elapsedTime = 0;
    },
    stop: function() {
      this.clear();
      this.isRunning = false;
    }
  } );
} );