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
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  // constants
  var INIT_PENDULUM_NUMBER = 0;

  /**
   * @param {Array.<Pendulum>} pendulums - Array of pendulum models.
   * @param {Property.<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   *
   * @constructor
   */
  function PeriodTimer( pendulums, isPeriodTraceVisibleProperty ) {
    var self = this;


    //TODO: we need more documentation here
    // make sure that we are not creating memory leaks.

    Stopwatch.call( this, {
      isVisible: isPeriodTraceVisibleProperty.value, // flag to control visibility of timer
      isFirst: true, // flag to trace timer pendulum
      activePendulum: pendulums[ INIT_PENDULUM_NUMBER ] // flag to identify pendulum
    } );

    // @private
    self._pendulums = pendulums;

    // add visibility observer
    isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
      self.isVisible = isPeriodTraceVisible;
    } );

    // stop the period timer when it is not visible.
    self.isVisibleProperty.onValue( false, this.stop.bind( this ) );


    self.isRunningProperty.link( function( isRunning ) {
      if ( isRunning ) {
        // clear time when timer revert to init state
        self.elapsedTime = 0;

        // reset and show trace path
        self.clear();
        self.activePendulum.periodTrace.isVisible = true;
      }
      else {
        // clear path if it wasn't finished
        if ( (self.activePendulum.periodTrace.numberOfPoints < 4) ) {
          self.clear();
        }

        // hide path if it wasn't started
        if ( self.activePendulum.periodTrace.numberOfPoints === 0 ) {
          self.activePendulum.periodTrace.isVisible = false;
        }
      }
    } );

    var clearCallback = this.clear.bind( this );

    // create listeners
    var pathListeners = [];
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      pendulum.periodTrace.removeVisibilityObservers();
      pendulum.periodTrace.isVisible = false;

      pendulum.lengthProperty.lazyLink( clearCallback );
      pendulum.gravityProperty.lazyLink( clearCallback );
      pendulum.isUserControlledProperty.lazyLink( clearCallback );
      self.isVisibleProperty.onValue( false, clearCallback ); // TODO: is this better not done, or does it matter for perf?

      pendulum.periodTrace.elapsedTimeProperty.lazyLink( function( time ) {
        if ( pendulum === self.activePendulum && self.isRunning ) {
          self.elapsedTime = time;
        }
      } );

      pathListeners[ pendulumIndex ] = function() {
        if ( pendulum.periodTrace.numberOfPoints === 4 && self.isRunning ) {
          self.isRunning = false;
        }
      };
    } );

    // add path listeners
    self.activePendulum.periodTrace.numberOfPointsProperty.link( pathListeners[ INIT_PENDULUM_NUMBER ] );
    self.isFirstProperty.lazyLink( function( isFirst ) {
      self.clear();

      self.activePendulum.periodTrace.isVisible = false;

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

  pendulumLab.register( 'PeriodTimer', PeriodTimer );

  return inherit( Stopwatch, PeriodTimer, {
    /**
     * Clears the timer and period traces
     * @private
     */
    clear: function() {
      // resetting the timer
      this.elapsedTime = 0;

      // clearing the period traces
      if ( !this.isRunning ) {
        this.activePendulum.periodTrace.isVisible = false;
      }
      this._pendulums.forEach( function( pendulum ) {
        pendulum.periodTrace.resetPathPoints();
      } );
    },
    /**
     * Stops the period timer and clear the trace
     * @public
     */
    stop: function() {
      if ( this.isRunning === true ) {
        this.clear();
      }
    }
  } );
} );