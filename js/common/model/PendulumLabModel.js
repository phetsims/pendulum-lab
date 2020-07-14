// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import pendulumLab from '../../pendulumLab.js';
import Body from './Body.js';
import Pendulum from './Pendulum.js';
import Ruler from './Ruler.js';

/**
 * @constructor
 *
 * @param {Object} [options]
 */
function PendulumLabModel( options ) {
  const self = this;

  options = merge( {
    // {boolean} - Should be true if there is a PeriodTimer handling the trace's visibility.
    hasPeriodTimer: false,

    // {boolean}
    rulerInitiallyVisible: true
  }, options );

  // @public {Property.<Body>}
  this.bodyProperty = new Property( Body.EARTH );

  // @public {Property.<number>} - Gravitational acceleration
  this.gravityProperty = new NumberProperty( Body.EARTH.gravity );

  // @public {Property.<number>} - Tracked for the "Custom" body, so that we can revert to this when the user changes
  //                               from "Planet X" to "Custom"
  this.customGravityProperty = new NumberProperty( Body.EARTH.gravity );

  // @public {Property.<number>} - Speed of time.
  this.timeSpeedProperty = new NumberProperty( 1 );

  // @public {Property.<number>} - Number of visible pendula (2 pendula are handled in the model)
  this.numberOfPendulaProperty = new NumberProperty( 1 );

  // @public {Property.<boolean>}
  this.isPlayingProperty = new BooleanProperty( true );

  // @public {Property.<number>} - Friction coefficient
  this.frictionProperty = new NumberProperty( 0 );

  // @public {Property.<boolean}
  this.isPeriodTraceVisibleProperty = new BooleanProperty( false );

  // @public {Property.<number>}
  this.energyZoomProperty = new NumberProperty( 1 );

  // @public {Array.<Pendulum>}
  this.pendula = [
    new Pendulum( 0, 1, 0.7, true, this.gravityProperty, this.frictionProperty, this.isPeriodTraceVisibleProperty, options.hasPeriodTimer ),
    new Pendulum( 1, 0.5, 1.0, false, this.gravityProperty, this.frictionProperty, this.isPeriodTraceVisibleProperty, options.hasPeriodTimer )
  ];

  // @public (read-only) possible gravity range 0m/s^2 to 25m/s^2
  this.gravityRange = new RangeWithValue( 0, 25, this.gravityProperty.value );

  // @public (read-only) possible friction range
  this.frictionRange = new RangeWithValue( 0, 0.5115, 0 );

  // @public (read-only) model for ruler
  this.ruler = new Ruler( options.rulerInitiallyVisible );

  // @public (read-only) model for stopwatch
  this.stopwatch = new Stopwatch({
    timePropertyOptions: {
      range: Stopwatch.ZERO_TO_ALMOST_SIXTY
    }
  });

  // change gravity if body was changed
  this.bodyProperty.lazyLink( function( body, oldBody ) {
    // If it's not custom, set it to its value
    if ( body !== Body.CUSTOM ) {
      self.gravityProperty.value = body.gravity;
    }
    else {
      // If we are switching from Planet X to Custom, don't let them cheat (go back to last custom value)
      if ( oldBody === Body.PLANET_X ) {
        self.gravityProperty.value = self.customGravityProperty.value;
      }
      // For non-Planet X, update our internal custom gravity
      else {
        self.customGravityProperty.value = self.gravityProperty.value;
      }
    }
  } );

  // change body to custom if gravity was changed
  this.gravityProperty.lazyLink( function( gravity ) {
    if ( !_.some( Body.BODIES, function( body ) { return body.gravity === gravity; } ) ) {
      self.bodyProperty.value = Body.CUSTOM;
    }

    if ( self.bodyProperty.value === Body.CUSTOM ) {
      self.customGravityProperty.value = gravity;
    }
  } );

  // change pendulum visibility if number of pendula was changed
  this.numberOfPendulaProperty.link( function( numberOfPendula ) {
    self.pendula.forEach( function( pendulum, pendulumIndex ) {
      pendulum.isVisibleProperty.value = ( numberOfPendula > pendulumIndex );
    } );
  } );
}

pendulumLab.register( 'PendulumLabModel', PendulumLabModel );

inherit( Object, PendulumLabModel, {
  /**
   * Resets the model.
   * @public
   */
  reset: function() {
    this.bodyProperty.reset();
    this.gravityProperty.reset();
    this.customGravityProperty.reset();
    this.timeSpeedProperty.reset();
    this.numberOfPendulaProperty.reset();
    this.isPlayingProperty.reset();
    this.frictionProperty.reset();
    this.isPeriodTraceVisibleProperty.reset();
    this.energyZoomProperty.reset();

    // reset ruler model
    this.ruler.reset();

    // reset stopwatch model
    this.stopwatch.reset();

    // reset pendulum models
    this.pendula.forEach( function( pendulum ) {
      pendulum.reset();
    } );
  },

  /**
   * Steps the model forward in time.
   * @public
   *
   * @param {number} dt
   */
  step: function( dt ) {
    if ( this.isPlayingProperty.value ) {
      // pick a number as irrational (in the mathematical sense) as possible so that the last digits on the period timer do get stuck to a number
      const periodTimerOffsetFactor = 1.007;

      // For our accuracy guarantees, we cap our DT fairly low. Otherwise the fixed-step model may become inaccurate
      // enough for getting an accurate period timer or speed loss on Jupiter with the shortest length.
      // We apply this BEFORE speed is applied, so that even if we're on a slow device, slow-motion WILL be guaranteed
      // to slow the sim speed down.
      this.modelStep( Math.min( 0.05, dt ) * ( this.timeSpeedProperty.value * periodTimerOffsetFactor ) );
    }
  },

  /**
   * Steps in model time.
   * @private
   *
   * @param {number} dt - change in time measured in seconds
   */
  modelStep: function( dt ) {

    // add time to the stopwatch if it is running
    this.stopwatch.step( dt );

    // loop over the pendula
    for ( let i = 0; i < this.numberOfPendulaProperty.value; i++ ) {
      const pendulum = this.pendula[ i ]; // get the pendulum from the array

      // if the pendulum is moving
      if ( !pendulum.isStationary() ) {
        // prevent infinite motion after friction.
        const dampMotion = ( Math.abs( pendulum.angleProperty.value ) < 1e-3 ) && ( Math.abs( pendulum.angularAccelerationProperty.value ) < 1e-3 ) && ( Math.abs( pendulum.angularVelocityProperty.value ) < 1e-3 );
        if ( dampMotion ) {
          pendulum.angleProperty.value = 0;
          pendulum.angularVelocityProperty.value = 0;
        }
        // step through the pendulum model
        pendulum.step( dt );
      }
    }
  },

  /**
   * Steps forward by a specific amount of time (even if paused).
   * @public
   */
  stepManual: function() {
    this.modelStep( 0.01 ); // advances by 10 ms, see https://github.com/phetsims/pendulum-lab/issues/182
  },

  /**
   * Returns the pendula to rest.
   * @public
   */
  returnPendula: function() {
    //reset the pendula
    this.pendula.forEach( function( pendulum ) {
      pendulum.resetThermalEnergy();
      pendulum.resetMotion();
    } );

    // stop the timer
    if ( this.periodTimer ) {
      this.periodTimer.stop();
    }
  }
} );

export default PendulumLabModel;