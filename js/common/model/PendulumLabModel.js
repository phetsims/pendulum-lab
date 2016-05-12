// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
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
   * @constructor
   */
  function PendulumLabModel( isPeriodTraceRepeating ) {
    var self = this;

    PropertySet.call( this, {
      body: Body.EARTH,
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

    this.pendulums = [
      new Pendulum( 1, 0.7, PendulumLabConstants.FIRST_PENDULUM_COLOR, true, this.gravityProperty, this.frictionProperty,
        this.isPeriodTraceVisibleProperty, isPeriodTraceRepeating ),
      new Pendulum( 0.5, 0.5, PendulumLabConstants.SECOND_PENDULUM_COLOR, false, this.gravityProperty, this.frictionProperty,
        this.isPeriodTraceVisibleProperty, isPeriodTraceRepeating )
    ];

    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.CUSTOM
    ];

    // possible gravity range
    this.gravityRange = new Range( 0, 25, this.gravity );

    // possible friction range
    this.frictionRange = new Range( 0, 0.5115, 0 );

    // model for ruler
    this.ruler = new Ruler();

    // model for stopwatch
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

      if ( this.periodTimer ) {
        this.periodTimer.reset();
      }
    },

    step: function( dt ) {
      if ( this.play ) {
        // For our accuracy guarantees, we cap our DT fairly low. Otherwise the fixed-step model may become inaccurate
        // enough for getting an accurate period timer or speed loss on Jupiter with the shortest length.
        // We apply this BEFORE speed is applied, so that even if we're on a slow device, slow-motion WILL be guaranteed
        // to slow the sim speed down.
        this.modelStep( Math.min( 0.05, dt ) * this.timeSpeed );
      }
    },

    modelStep: function( dt ) {
      if ( this.stopwatch.isRunning ) {
        this.stopwatch.elapsedTime += dt;
      }

      for ( var i = 0; i < this.numberOfPendulums; i++ ) {
        var pendulum = this.pendulums[ i ];

        if ( !pendulum.isStationary() ) {

          // prevent infinite motion after friction. TODO: could use some cleanup!
          if ( Math.abs( pendulum.angle ) < 1e-3 &&
               Math.abs( pendulum.angularAcceleration ) < 1e-3 &&
               Math.abs( pendulum.angularVelocity ) < 1e-3 ) {
            pendulum.angle = 0;
            pendulum.angularVelocity = 0;
          }

          pendulum.step( dt );
        }
      }
    },

    // handler for step button
    stepManual: function() {
      this.modelStep( 0.05 );
    },

    returnHandler: function() {
      this.pendulums.forEach( function( pendulum ) {
        pendulum.resetThermalEnergy();
        pendulum.resetMotion();
      } );

      if ( this.periodTimer ) {
        this.periodTimer.stop();
      }
    }
  } );
} );