// Copyright 2014-2015, University of Colorado Boulder

/**
 * Period timer model in 'Pendulum Lab' simulation.
 * Calculates the period for the active pendulum, in addition to the normal trace.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  /**
   * @param {Array.<Pendulum>} pendula - Array of pendulum models.
   * @param {Property.<boolean>} isVisibleProperty
   *
   * @constructor
   */
  function PeriodTimer( pendula, isVisibleProperty ) {
    var self = this;

    // TODO make sure that we are not creating memory leaks.

    Stopwatch.call( this, isVisibleProperty.value );

    // Forward our invisibleProperty over to the MovableComponent visibility.
    isVisibleProperty.linkAttribute( this.isVisibleProperty, 'value' );

    // @public {Property.<number>}
    this.activePendulumIndexProperty = new NumberProperty( 0 ); // Start with the first pendulum

    // @public {Property.<pendulum>} - The active pendulum that we'll record the period/trace on.
    this.activePendulumProperty = new DerivedProperty( [ this.activePendulumIndexProperty ], function( index ) {
      return pendula[ index ];
    } );

    // @private {Array.<Pendulum>}
    this.pendula = pendula;

    // stop the period timer when it is not visible.
    this.isVisibleProperty.onValue( false, this.stop.bind( this ) );

    this.isRunningProperty.link( function( isRunning ) {
      if ( isRunning ) {
        // clear time when timer revert to init state
        self.elapsedTimeProperty.value = 0;

        // reset and show trace path
        self.clear();
        self.activePendulumProperty.value.periodTrace.isVisibleProperty.value = true;
      }
      else {
        // clear path if it wasn't finished
        if ( (self.activePendulumProperty.value.periodTrace.numberOfPointsProperty.value < 4) ) {
          self.clear();
        }

        // hide path if it wasn't started
        if ( self.activePendulumProperty.value.periodTrace.numberOfPointsProperty.value === 0 ) {
          self.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
        }
      }
    } );

    var clearCallback = this.clear.bind( this );

    // create listeners
    var pathListeners = [];
    pendula.forEach( function( pendulum, pendulumIndex ) {
      pendulum.periodTrace.isVisibleProperty.value = false;

      pendulum.lengthProperty.lazyLink( clearCallback );
      pendulum.gravityProperty.lazyLink( clearCallback );
      pendulum.isUserControlledProperty.lazyLink( clearCallback );
      self.isVisibleProperty.onValue( false, clearCallback ); // TODO: is this better not done, or does it matter for perf?

      pendulum.periodTrace.elapsedTimeProperty.lazyLink( function( time ) {
        if ( pendulum === self.activePendulumProperty.value && self.isRunningProperty.value ) {
          self.elapsedTimeProperty.value = time;
        }
      } );

      pathListeners[ pendulumIndex ] = function() {
        if ( pendulum.periodTrace.numberOfPointsProperty.value === 4 && self.isRunningProperty.value ) {
          self.isRunningProperty.value = false;
        }
      };
    } );

    // add path listeners
    self.activePendulumProperty.value.periodTrace.numberOfPointsProperty.link( pathListeners[ this.activePendulumIndexProperty.value ] );
    self.activePendulumIndexProperty.lazyLink( function( index, oldIndex ) {
      self.clear();

      self.pendula[ oldIndex ].periodTrace.isVisibleProperty.value = false;
      self.pendula[ oldIndex ].periodTrace.numberOfPointsProperty.unlink( pathListeners[ oldIndex ] );

      self.pendula[ index ].periodTrace.numberOfPointsProperty.link( pathListeners[ index ] );
      self.pendula[ index ].periodTrace.isVisibleProperty.value = self.isRunningProperty.value;
    } );
  }

  pendulumLab.register( 'PeriodTimer', PeriodTimer );

  return inherit( Stopwatch, PeriodTimer, {
    /**
     * Resets the PeriodTimer
     * @public
     */
    reset: function() {
      Stopwatch.prototype.reset.call( this );
      this.activePendulumIndexProperty.reset();
    },

    /**
     * Clears the timer and period traces
     * @private
     */
    clear: function() {
      // resetting the timer
      this.elapsedTimeProperty.value = 0;

      // clearing the period traces
      if ( !this.isRunningProperty.value ) {
        this.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
      }
      this.pendula.forEach( function( pendulum ) {
        pendulum.periodTrace.resetPathPoints();
      } );
    },
    /**
     * Stops the period timer and clear the trace
     * @public
     */
    stop: function() {
      if ( this.isRunningProperty.value === true ) {
        this.clear();
      }
    }
  } );
} );
