// Copyright 2014-2022, University of Colorado Boulder

/**
 * Period timer model in 'Pendulum Lab' simulation.
 * Calculates the period for the active pendulum, in addition to the normal trace.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Stopwatch from '../../common/model/Stopwatch.js';
import pendulumLab from '../../pendulumLab.js';

class PeriodTimer extends Stopwatch {
  /**
   * @param {Array.<Pendulum>} pendula - Array of pendulum models.
   * @param {Property.<boolean>} isVisibleProperty
   */
  constructor( pendula, isVisibleProperty ) {
    // TODO: https://github.com/phetsims/pendulum-lab/issues/216 use SCENERY_PHET/Stopwatch instead of its own Stopwatch which has similar features?
    super( isVisibleProperty.value );

    // Forward our invisibleProperty over to the MovableComponent visibility.
    isVisibleProperty.linkAttribute( this.isVisibleProperty, 'value' );

    // @public {Property.<number>}
    this.activePendulumIndexProperty = new NumberProperty( 0 ); // Start with the first pendulum

    // @public {Property.<pendulum>} - The active pendulum that we'll record the period/trace on.
    this.activePendulumProperty = new DerivedProperty( [ this.activePendulumIndexProperty ], index => pendula[ index ] );

    // @private {Array.<Pendulum>}
    this.pendula = pendula;

    Multilink.multilink( [ this.isRunningProperty, this.isVisibleProperty ], ( isRunning, isVisible ) => {
      if ( isRunning && isVisible ) {
        // clear time when timer revert to init state
        this.elapsedTimeProperty.value = 0;

        // reset and show trace path
        this.clear();
        this.activePendulumProperty.value.periodTrace.isVisibleProperty.value = true;
      }
      else if ( isVisible ) {
        // clear path if it wasn't finished
        if ( this.activePendulumProperty.value.periodTrace.numberOfPointsProperty.value < 4 ) {
          this.clear();
        }

        // hide path if it wasn't started
        if ( this.activePendulumProperty.value.periodTrace.numberOfPointsProperty.value === 0 ) {
          this.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
        }
      }
      else if ( isRunning ) {
        this.isRunningProperty.value = false;
      }
      else {
        this.clear();
        this.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
      }
    } );

    // create listeners
    const pathListeners = [];
    pendula.forEach( ( pendulum, pendulumIndex ) => {
      pendulum.periodTrace.isVisibleProperty.value = false;

      const clearIfActive = () => {
        if ( this.activePendulumProperty.value === pendulum ) {
          this.clear();
        }
      };

      pendulum.lengthProperty.lazyLink( clearIfActive );
      pendulum.gravityProperty.lazyLink( clearIfActive );
      pendulum.isUserControlledProperty.lazyLink( clearIfActive );

      pendulum.periodTrace.elapsedTimeProperty.lazyLink( time => {
        if ( pendulum === this.activePendulumProperty.value && this.isRunningProperty.value ) {
          this.elapsedTimeProperty.value = time;
        }
      } );

      pathListeners[ pendulumIndex ] = () => {
        if ( pendulum.periodTrace.numberOfPointsProperty.value === 4 && this.isRunningProperty.value ) {
          this.isRunningProperty.value = false;
        }
      };
    } );

    // add path listeners
    this.activePendulumProperty.value.periodTrace.numberOfPointsProperty.link( pathListeners[ this.activePendulumIndexProperty.value ] );
    this.activePendulumIndexProperty.lazyLink( ( index, oldIndex ) => {
      this.clear();

      this.pendula[ oldIndex ].periodTrace.isVisibleProperty.value = false;
      this.pendula[ oldIndex ].periodTrace.numberOfPointsProperty.unlink( pathListeners[ oldIndex ] );

      this.pendula[ index ].periodTrace.numberOfPointsProperty.link( pathListeners[ index ] );
      this.pendula[ index ].periodTrace.isVisibleProperty.value = this.isRunningProperty.value;
    } );
  }

  /**
   * Resets the PeriodTimer
   * @public
   */
  reset() {
    super.reset();
    this.activePendulumIndexProperty.reset();
  }

  /**
   * Clears the timer and period traces
   * @private
   */
  clear() {
    // resetting the timer
    this.elapsedTimeProperty.value = 0;

    // clearing the period traces
    if ( !this.isRunningProperty.value ) {
      this.activePendulumProperty.value.periodTrace.isVisibleProperty.value = false;
    }
    this.pendula.forEach( pendulum => {
      pendulum.periodTrace.resetPathPoints();
    } );
  }

  /**
   * Stops the period timer and clear the trace
   * @public
   */
  stop() {
    if ( this.isRunningProperty.value === true ) {
      this.clear();
    }
  }
}

pendulumLab.register( 'PeriodTimer', PeriodTimer );

export default PeriodTimer;