// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for period trace of pendulum. Can draw path once or repeat infinite.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import pendulumLab from '../../pendulumLab.js';

class PeriodTrace {
  /**
   * @param {Pendulum} pendulum
   */
  constructor( pendulum ) {

    // @private {Pendulum}
    this.pendulum = pendulum;

    // @public {Property.<number>}
    // 0: Trace hasn't started recording.
    // 1: Pendulum had its first zero-crossing, but hasn't reached its first peak.
    // 2: Pendulum reached first peak, and is swinging towards second peak.
    // 3: Pendulum had second peak, but hasn't crossed the zero-line since.
    // 4: Pendulum trace completed.
    this.numberOfPointsProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>}
    this.isVisibleProperty = new BooleanProperty( false );

    // @public {Property.<number>}
    this.elapsedTimeProperty = new NumberProperty( 0 );

    // @public {boolean|null}
    this.counterClockwise = null;

    // @public {number|null}
    this.firstAngle = null;
    this.secondAngle = null;

    pendulum.crossingEmitter.addListener( ( dt, isPositive ) => {
      // On the first zero-crossing, detect counterClockwise (direction) and increment. Don't trigger if our pendulum's angle
      // is likely to have been crossing at the top (angle~pi).
      if ( this.numberOfPointsProperty.value === 0 && Math.abs( pendulum.angleProperty.value ) < 0.5 ) {

        // modify numberOfPoints before elapsedTime, so anything waiting for elapsedTime changes while running works
        this.numberOfPointsProperty.value = 1;
        this.counterClockwise = !isPositive;

        // Set our elapsed time to the negative, as this was the elapsed time UNTIL we started. When the next step
        // callback happens, it will increment our elapsedTime to the correct (current) amount.
        this.elapsedTimeProperty.value = -dt;

      }
      // On the third zero-crossing (we passed by the other direction already), increment to end the period trace.
      else if ( this.numberOfPointsProperty.value === 3 ) {

        // modify numberOfPoints after elapsedTime, so anything waiting for elapsedTime changes while running works
        this.elapsedTimeProperty.value += dt;

        this.numberOfPointsProperty.value = 4;
      }
      // Check to see if we looped! Should have peaked before second crossing.
      else if ( this.numberOfPointsProperty.value === 1 ) {
        this.resetPathPoints();
      }
    } );

    pendulum.peakEmitter.addListener( theta => {
      if ( this.numberOfPointsProperty.value === 1 ) {
        this.firstAngle = theta;
        this.numberOfPointsProperty.value = 2;
      }
      else if ( this.numberOfPointsProperty.value === 2 ) {
        this.secondAngle = theta;
        this.numberOfPointsProperty.value = 3;
      }
    } );

    pendulum.stepEmitter.addListener( dt => {
      if ( this.numberOfPointsProperty.value > 0 && this.numberOfPointsProperty.value < 4 ) {
        this.elapsedTimeProperty.value += dt;
      }
    } );

    // clear pendulum path
    const resetPathPoints = this.resetPathPoints.bind( this );
    pendulum.gravityProperty.lazyLink( resetPathPoints );
    pendulum.lengthProperty.lazyLink( resetPathPoints );
    pendulum.isUserControlledProperty.lazyLink( resetPathPoints );

    this.isVisibleProperty.lazyLink( resetPathPoints );
  }

  /**
   * Called when the trace has fully faded away.
   * @public
   */
  onFaded() {
    this.isVisibleProperty.value = false;

    // show track continuously
    if ( !this.pendulum.hasPeriodTimer ) {
      this.isVisibleProperty.value = true;
    }
  }

  /**
   * Resets the property set and the path points
   * @public
   */
  reset() {
    this.isVisibleProperty.reset();
    this.resetPathPoints();
  }

  /**
   * Resets the path points that are used to draw the period path trace
   * @public
   */
  resetPathPoints() {
    this.counterClockwise = null;
    this.firstAngle = null;
    this.secondAngle = null;
    this.numberOfPointsProperty.reset();
    this.elapsedTimeProperty.reset();
  }
}

pendulumLab.register( 'PeriodTrace', PeriodTrace );

export default PeriodTrace;