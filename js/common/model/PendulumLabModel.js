// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Pendulum = require( 'PENDULUM_LAB/common/model/Pendulum' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var Ruler = require( 'PENDULUM_LAB/common/model/Ruler' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @param {boolean} isPeriodTraceRepeating
   * @constructor
   */
  function PendulumLabModel( isPeriodTraceRepeating ) {
    var self = this;

    PropertySet.call( this, {
      body: Body.EARTH, // we want the default body to be earth
      gravity: Body.EARTH.gravity, // gravitational acceleration

      // tracked for the "Custom" body, so that we can revert to this when the user changes from "Planet X" to "Custom"
      customGravity: Body.EARTH.gravity,
      timeSpeed: 1, // speed of time ticking
      numberOfPendulums: 1, // number of visible pendulums,
      play: true, // flag: controls running of time
      friction: 0, // friction coefficient

      // flag: controls check box value of period trace visibility
      isPeriodTraceVisible: false
    } );

    // @public
    // an array of pendulum, apologies to all english majors
    this.pendulums = [
      new Pendulum( 1, 1.5, PendulumLabConstants.FIRST_PENDULUM_COLOR, true, this.gravityProperty, this.frictionProperty,
        this.isPeriodTraceVisibleProperty, isPeriodTraceRepeating ),
      new Pendulum( 0.5, 1, PendulumLabConstants.SECOND_PENDULUM_COLOR, false, this.gravityProperty, this.frictionProperty,
        this.isPeriodTraceVisibleProperty, isPeriodTraceRepeating )
    ];

    // all of the bodies that are possible
    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.CUSTOM
    ];

    // @public (read-only) possible gravity range 0m/s^2 to 25m/s^2
    this.gravityRange = new Range( 0, 25, this.gravity );

    // @public (read-only) possible friction range
    this.frictionRange = new Range( 0, 0.5115, 0 );

    // @public (read-only) model for ruler
    this.ruler = new Ruler();

    // @public (read-only) model for stopwatch
    this.stopwatch = new Stopwatch();

    // change gravity if body was changed
    this.bodyProperty.lazyLink( function( body, oldBody ) {
      // If it's not custom, set it to its value
      if ( body !== Body.CUSTOM ) {
        self.gravity = body.gravity;
      }
      else {
        // If we are switching from Planet X to Custom, don't let them cheat (go back to last custom value)
        if ( oldBody === Body.PLANET_X ) {
          self.gravity = self.customGravity;
        }
        // For non-Planet X, update our internal custom gravity
        else {
          self.customGravity = self.gravity;
        }
      }
    } );

    // change body to custom if gravity was changed
    this.gravityProperty.lazyLink( function( gravity ) {
      if ( !_.some( Body.bodies, function( body ) { return body.gravity === gravity; } ) ) {
        self.body = Body.CUSTOM;
      }

      if ( self.body === Body.CUSTOM ) {
        self.customGravity = gravity;
      }
    } );

    // change pendulum visibility if number of pendulums was changed
    this.numberOfPendulumsProperty.link( function( numberOfPendulums ) {
      self.pendulums.forEach( function( pendulum, pendulumIndex ) {
        pendulum.isVisible = (numberOfPendulums > pendulumIndex);
      } );
    } );
  }

  pendulumLab.register( 'PendulumLabModel', PendulumLabModel );

  return inherit( PropertySet, PendulumLabModel, {
    /**
     * function that resets the elements of the simulation, ruler, stopwatch, and pedulums
     * @public
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );

      // reset ruler model
      this.ruler.reset();

      // reset stopwatch model
      this.stopwatch.reset();

      // reset pendulum models
      this.pendulums.forEach( function( pendulum ) {
        pendulum.reset();
      } );

    },
    /**
     * function that is stepped over in every frame takes care of stepping through the simulation.
     * @param {number} dt - change in time measured in seconds.
     * @private
     */
    step: function( dt ) {
      if ( this.play ) {
        // pick a number as irrational (in the mathematical sense) as possible so that the last digits on the period timer do get stuck to a number
        var periodTimerOffsetFactor = 1.007;

        // For our accuracy guarantees, we cap our DT fairly low. Otherwise the fixed-step model may become inaccurate
        // enough for getting an accurate period timer or speed loss on Jupiter with the shortest length.
        // We apply this BEFORE speed is applied, so that even if we're on a slow device, slow-motion WILL be guaranteed
        // to slow the sim speed down.
        this.modelStep( Math.min( 0.05, dt ) * (this.timeSpeed * periodTimerOffsetFactor) );
      }
    },
    /**
     * function that is stepped through every frame. Takes care of stepping through the pendulum motions.
     * @param {number} dt - change in time measured in  seconds
     * @private
     */
    modelStep: function( dt ) {
      // add time to the stopwatch if it is running
      if ( this.stopwatch.isRunning ) {
        this.stopwatch.elapsedTime += dt;
      }

      // loop over the pendula
      for ( var i = 0; i < this.numberOfPendulums; i++ ) {
        var pendulum = this.pendulums[ i ]; // get the pendulum from the array

        // if the pendulum is moving
        if ( !pendulum.isStationary() ) {
          // prevent infinite motion after friction.
          var dampMotion = (Math.abs( pendulum.angle ) < 1e-3) && (Math.abs( pendulum.angularAcceleration ) < 1e-3) && (Math.abs( pendulum.angularVelocity ) < 1e-3);
          if ( dampMotion ) {
            pendulum.angle = 0;
            pendulum.angularVelocity = 0;
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
      this.pendulums.forEach( function( pendulum ) {
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