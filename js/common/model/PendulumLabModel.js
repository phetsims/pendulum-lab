// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Pendulum = require( 'PENDULUM_LAB/common/model/Pendulum' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Ruler = require( 'PENDULUM_LAB/common/model/Ruler' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function PendulumLabModel( options ) {
    var self = this;

    options = _.extend( {
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
    this.stopwatch = new Stopwatch( false );

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

  return inherit( Object, PendulumLabModel, {
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
        var periodTimerOffsetFactor = 1.007;

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
      if ( this.stopwatch.isRunningProperty.value ) {
        this.stopwatch.elapsedTimeProperty.value += dt;
      }

      // loop over the pendula
      for ( var i = 0; i < this.numberOfPendulaProperty.value; i++ ) {
        var pendulum = this.pendula[ i ]; // get the pendulum from the array

        // if the pendulum is moving
        if ( !pendulum.isStationary() ) {
          // prevent infinite motion after friction.
          var dampMotion = ( Math.abs( pendulum.angleProperty.value ) < 1e-3 ) && ( Math.abs( pendulum.angularAccelerationProperty.value ) < 1e-3 ) && ( Math.abs( pendulum.angularVelocityProperty.value ) < 1e-3 );
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
      this.modelStep( 0.05 ); // advances by 50 ms
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
} );
