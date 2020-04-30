// Copyright 2014-2020, University of Colorado Boulder

/**
 * Period timer model in 'Pendulum Lab' simulation.
 * Calculates the period for the active pendulum, in addition to the normal trace.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Stopwatch from '../../common/model/Stopwatch.js';
import pendulumLab from '../../pendulumLab.js';

/**
 * @constructor
 *
 * @param {Array.<Pendulum>} pendula - Array of pendulum models.
 * @param {Property.<boolean>} isVisibleProperty
 */
function PeriodTimer( pendula, isVisibleProperty ) {
  const self = this;

  // TODO: https://github.com/phetsims/pendulum-lab/issues/216 use SCENERY_PHET/Stopwatch instead of its own Stopwatch which has similar features?
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

  Property.multilink( [ this.isRunningProperty, this.isVisibleProperty ], function( isRunning, isVisible ) {
    if ( isRunning && isVisible ) {
      // clear time when timer revert to init state
      self.elapsedTimeProperty.value = 0;

      // reset and show trace path
      self.clear();
      self.activePendulumProperty.value.periodTrace.isVisibleProperty.value = true;
    }
    else if ( isVisible ) {
      // clear path if it wasn't finished
      if ( self.activePendulumProperty.value.periodTrace.numberOfPointsProperty.value < 4 ) {
        self.clear();
      }

      // hide path if it wasn't started
      if ( self.activePendulumProperty.value.periodTrace.numberOfPointsProperty.value === 0 ) {
        self.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
      }
    }
    else if ( isRunning ) {
      self.isRunningProperty.value = false;
    }
    else {
      self.clear();
      self.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
    }
  } );

  // create listeners
  const pathListeners = [];
  pendula.forEach( function( pendulum, pendulumIndex ) {
    pendulum.periodTrace.isVisibleProperty.value = false;

    function clearIfActive() {
      if ( self.activePendulumProperty.value === pendulum ) {
        self.clear();
      }
    }

    pendulum.lengthProperty.lazyLink( clearIfActive );
    pendulum.gravityProperty.lazyLink( clearIfActive );
    pendulum.isUserControlledProperty.lazyLink( clearIfActive );

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

inherit( Stopwatch, PeriodTimer, {
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

export default PeriodTimer;