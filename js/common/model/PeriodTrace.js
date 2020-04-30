// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for period trace of pendulum. Can draw path once or repeat infinite.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import pendulumLab from '../../pendulumLab.js';

/**
 * @constructor
 *
 * @param {Pendulum} pendulum
 */
function PeriodTrace( pendulum ) {
  const self = this;

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

  pendulum.crossingEmitter.addListener( function( dt, isPositive ) {
    // On the first zero-crossing, detect counterClockwise (direction) and increment. Don't trigger if our pendulum's angle
    // is likely to have been crossing at the top (angle~pi).
    if ( self.numberOfPointsProperty.value === 0 && Math.abs( pendulum.angleProperty.value ) < 0.5 ) {

      // modify numberOfPoints before elapsedTime, so anything waiting for elapsedTime changes while running works
      self.numberOfPointsProperty.value = 1;
      self.counterClockwise = !isPositive;

      // Set our elapsed time to the negative, as this was the elapsed time UNTIL we started. When the next step
      // callback happens, it will increment our elapsedTime to the correct (current) amount.
      self.elapsedTimeProperty.value = -dt;

    }
    // On the third zero-crossing (we passed by the other direction already), increment to end the period trace.
    else if ( self.numberOfPointsProperty.value === 3 ) {

      // modify numberOfPoints after elapsedTime, so anything waiting for elapsedTime changes while running works
      self.elapsedTimeProperty.value += dt;

      self.numberOfPointsProperty.value = 4;
    }
    // Check to see if we looped! Should have peaked before second crossing.
    else if ( self.numberOfPointsProperty.value === 1 ) {
      self.resetPathPoints();
    }
  } );

  pendulum.peakEmitter.addListener( function( theta ) {
    if ( self.numberOfPointsProperty.value === 1 ) {
      self.firstAngle = theta;
      self.numberOfPointsProperty.value = 2;
    }
    else if ( self.numberOfPointsProperty.value === 2 ) {
      self.secondAngle = theta;
      self.numberOfPointsProperty.value = 3;
    }
  } );

  pendulum.stepEmitter.addListener( function( dt ) {
    if ( self.numberOfPointsProperty.value > 0 && self.numberOfPointsProperty.value < 4 ) {
      self.elapsedTimeProperty.value += dt;
    }
  } );

  // clear pendulum path
  const resetPathPoints = this.resetPathPoints.bind( this );
  pendulum.gravityProperty.lazyLink( resetPathPoints );
  pendulum.lengthProperty.lazyLink( resetPathPoints );
  pendulum.isUserControlledProperty.lazyLink( resetPathPoints );

  this.isVisibleProperty.lazyLink( resetPathPoints );
}

pendulumLab.register( 'PeriodTrace', PeriodTrace );

inherit( Object, PeriodTrace, {
  /**
   * Called when the trace has fully faded away.
   * @public
   */
  onFaded: function() {
    this.isVisibleProperty.value = false;

    // show track continuously
    if ( !this.pendulum.hasPeriodTimer ) {
      this.isVisibleProperty.value = true;
    }
  },

  /**
   * Resets the property set and the path points
   * @public
   */
  reset: function() {
    this.isVisibleProperty.reset();
    this.resetPathPoints();
  },

  /**
   * Resets the path points that are used to draw the period path trace
   * @public
   */
  resetPathPoints: function() {
    this.counterClockwise = null;
    this.firstAngle = null;
    this.secondAngle = null;
    this.numberOfPointsProperty.reset();
    this.elapsedTimeProperty.reset();
  }
} );

export default PeriodTrace;