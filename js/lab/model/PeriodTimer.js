// Copyright 2014-2015, University of Colorado Boulder

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

  // constants
  var INIT_PENDULUM_NUMBER = 0;

  /**
   * @param {Array.<Pendulum>} pendulums - Array of pendulum models.
   * @param {Property<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   *
   * @constructor
   */
  function PeriodTimer( pendulums, isPeriodTraceVisibleProperty ) {
    var self = this;

    Stopwatch.call( this, {
      isVisible: isPeriodTraceVisibleProperty.value, // flag to control visibility of timer
      isFirst: true, // flag to trace timer pendulum
      isCalculate: false // flag to trace time calculating
    } );

    this._pendulums = pendulums;
    this.activePendulum = pendulums[ INIT_PENDULUM_NUMBER ];

    // add visibility observer
    isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
      self.isVisible = isPeriodTraceVisible;
    } );

    this.isVisibleProperty.onValue( false, self.stop.bind( this ) );

    // clear timer before starting calculating
    this.isCalculateProperty.onValue( true, function() {
      self.elapsedTime = 0;
    } );

    var updateTimer = function() {
      if ( self.isCalculate ) {
        self.isCalculate = false;
        self.elapsedTime = 0;
      }
    };

    this.isRunningProperty.link( function( isRunning ) {
      if ( isRunning ) {
        // clear time when timer revert to init state
        self.elapsedTime = 0;

        // reset and show trace path
        self.clear();
        self.activePendulum.periodTrace.isVisible = true;
      }
      else {
        // clear path if it wasn't finished
        if ( (self.activePendulum.periodTrace.numberOfPoints < 4 && self.isCalculate) ) {
          self.clear();
        }

        // hide path if it wasn't started
        if ( self.activePendulum.periodTrace.numberOfPoints === 0 ) {
          self.activePendulum.periodTrace.isVisible = false;
        }
        // stop calculating when timer stop
        self.isCalculate = false;
      }
    } );

    // create listeners
    var pathListeners = [];
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      pendulum.periodTrace.removeVisibilityObservers();
      pendulum.periodTrace.isRepeat = false;
      pendulum.periodTrace.isVisible = false;

      pendulum.lengthProperty.lazyLink( updateTimer );
      pendulum.gravityProperty.lazyLink( updateTimer );
      pendulum.isUserControlledProperty.lazyLink( updateTimer );
      self.isVisibleProperty.onValue( false, updateTimer );

      pathListeners[ pendulumIndex ] = function() {
        if ( pendulum.periodTrace.numberOfPoints === 1 && self.isRunning ) {
          self.isCalculate = true;
        }
        else if ( pendulum.periodTrace.numberOfPoints === 4 && self.isRunning ) {
          self.isRunning = false;
        }
      };
    } );

    // add path listeners
    this.activePendulum.periodTrace.numberOfPointsProperty.link( pathListeners[ INIT_PENDULUM_NUMBER ] );
    this.isFirstProperty.lazyLink( function( isFirst ) {
      self.clear();

      if ( isFirst ) {
        self.activePendulum.periodTrace.numberOfPointsProperty.unlink( pathListeners[ 1 ] );
        self.activePendulum = pendulums[ 0 ];
        self.activePendulum.periodTrace.numberOfPointsProperty.link( pathListeners[ 0 ] );
      }
      else {
        self.activePendulum.periodTrace.numberOfPointsProperty.unlink( pathListeners[ 0 ] );
        self.activePendulum = pendulums[ 1 ];
        self.activePendulum.periodTrace.numberOfPointsProperty.link( pathListeners[ 1 ] );
      }

      self.activePendulum.periodTrace.isVisible = self.isRunning;
    } );
  }

  return inherit( Stopwatch, PeriodTimer, {
    clear: function() {
      this.activePendulum.periodTrace.isVisible = false;
      this.isCalculate = false;
      this.elapsedTime = 0;

      this._pendulums.forEach( function( pendulum ) {
        pendulum.periodTrace.resetPathPoints();
      } );
    },
    stop: function() {
      this.clear();
      this.isRunning = false;
    }
  } );
} );