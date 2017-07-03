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
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Ruler = require( 'PENDULUM_LAB/common/model/Ruler' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @param {boolean} isPeriodTraceRepeating
   * @constructor
   */
  function PendulumLabModel( isPeriodTraceRepeating ) {
    var self = this;

    // @public {Property.<Body>}
    this.bodyProperty = new Property( Body.EARTH );

    //TODO: How separate does this need to be? DerivedProperty possible?
    // @public {Property.<number>} - Gravitational acceleration
    this.gravityProperty = new NumberProperty( Body.EARTH.gravity );

    //TODO: How separate does this need to be? DerivedProperty possible?
    // @public {Property.<number>} - Tracked for the "Custom" body, so that we can revert to this when the user changes
    //                               from "Planet X" to "Custom"
    this.customGravityProperty = new NumberProperty( Body.EARTH.gravity );

    // @public {Property.<number>} - Speed of time.
    this.timeSpeedProperty = new NumberProperty( 1 );

    // @public {Property.<number>} - Number of visible pendula (2 pendula are handled in the model)
    this.numberOfPendulaProperty = new NumberProperty( 1 );

    // TODO: runningProperty?
    // @public {Property.<boolean>}
    this.playProperty = new BooleanProperty( true );

    // @public {Property.<number>} - Friction coefficient
    this.frictionProperty = new NumberProperty( 0 );

    // @public {Property.<boolean}
    this.isPeriodTraceVisibleProperty = new BooleanProperty( false );

    // @public
    // an array of pendulum, apologies to all english majors
    this.pendula = [
      new Pendulum( 1, 0.7, PendulumLabConstants.FIRST_PENDULUM_COLOR, true, this.gravityProperty, this.frictionProperty,
        this.isPeriodTraceVisibleProperty, isPeriodTraceRepeating ),
      new Pendulum( 0.5, 1.0, PendulumLabConstants.SECOND_PENDULUM_COLOR, false, this.gravityProperty, this.frictionProperty,
        this.isPeriodTraceVisibleProperty, isPeriodTraceRepeating )
    ];

    // all of the bodies that are possible
    // @public (read-only)
    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.CUSTOM
    ];

    // @public (read-only) possible gravity range 0m/s^2 to 25m/s^2
    this.gravityRange = new RangeWithValue( 0, 25, this.gravityProperty.value );

    // @public (read-only) possible friction range
    this.frictionRange = new RangeWithValue( 0, 0.5115, 0 );

    // @public (read-only) model for ruler
    this.ruler = new Ruler();

    // @public (read-only) model for stopwatch
    this.stopwatch = new Stopwatch();

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
      if ( !_.some( Body.bodies, function( body ) { return body.gravity === gravity; } ) ) {
        self.bodyProperty.value = Body.CUSTOM;
      }

      if ( self.bodyProperty.value === Body.CUSTOM ) {
        self.customGravityProperty.value = gravity;
      }
    } );

    // change pendulum visibility if number of pendula was changed
    this.numberOfPendulaProperty.link( function( numberOfPendula ) {
      self.pendula.forEach( function( pendulum, pendulumIndex ) {
        pendulum.isVisibleProperty.value = (numberOfPendula > pendulumIndex);
      } );
    } );
  }

  pendulumLab.register( 'PendulumLabModel', PendulumLabModel );

  return inherit( Object, PendulumLabModel, {
    /**
     * function that resets the elements of the simulation, ruler, stopwatch, and pedulums
     * @public
     */
    reset: function() {
      this.bodyProperty.reset();
      this.gravityProperty.reset();
      this.customGravityProperty.reset();
      this.timeSpeedProperty.reset();
      this.numberOfPendulaProperty.reset();
      this.playProperty.reset();
      this.frictionProperty.reset();
      this.isPeriodTraceVisibleProperty.reset();

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
     * function that is stepped over in every frame takes care of stepping through the simulation.
     * @param {number} dt - change in time measured in seconds.
     * @public
     */
    step: function( dt ) {
      if ( this.playProperty.value ) {
        // pick a number as irrational (in the mathematical sense) as possible so that the last digits on the period timer do get stuck to a number
        var periodTimerOffsetFactor = 1.007;

        // For our accuracy guarantees, we cap our DT fairly low. Otherwise the fixed-step model may become inaccurate
        // enough for getting an accurate period timer or speed loss on Jupiter with the shortest length.
        // We apply this BEFORE speed is applied, so that even if we're on a slow device, slow-motion WILL be guaranteed
        // to slow the sim speed down.
        this.modelStep( Math.min( 0.05, dt ) * (this.timeSpeedProperty.value * periodTimerOffsetFactor) );
      }
    },
    /**
     * function that is stepped through every frame. Takes care of stepping through the pendulum motions.
     * @param {number} dt - change in time measured in  seconds
     * @private
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
     * Handler for the step button
     * Called by PendulumLabView
     * @public
     */
    stepManual: function() {
      this.modelStep( 0.05 ); // advances by 50 ms
    },

    /**
     * Handler for return button
     * Called by PendulumLabView
     * @public
     */
    returnHandler: function() {
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
