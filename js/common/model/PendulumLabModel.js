//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
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
  function PendulumLabModel() {
    var self = this;

    PropertySet.call( this, {
      gravity: Body.EARTH.gravity, // gravitational acceleration
      body: Body.EARTH, // current body name
      timeSpeed: 1, // speed of time ticking
      numberOfPendulums: 1, // number of visible pendulums,
      play: true, // flag: controls running of time

      // flag: controls check box value of period trace visibility
      isPeriodTraceVisible: false
    } );

    this.pendulums = [
      new Pendulum( 1, 1.5, PendulumLabConstants.FIRST_PENDULUM_COLOR, true, this.gravityProperty, this.isPeriodTraceVisibleProperty ),
      new Pendulum( 0.5, 1, PendulumLabConstants.SECOND_PENDULUM_COLOR, false, this.gravityProperty, this.isPeriodTraceVisibleProperty )
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

    // model for ruler
    this.ruler = new Ruler();

    // model for stopwatch
    this.stopwatch = new Stopwatch();

    // change gravity if body was changed
    var gravityValueBeforePlanetX = this.gravity;
    this.bodyProperty.lazyLink( function( bodyNew, bodyPrev ) {
      if ( bodyNew === Body.PLANET_X ) {
        // save value for further restoring
        gravityValueBeforePlanetX = self.gravity;
      }
      else if ( bodyPrev === Body.PLANET_X ) {
        // restore previous value
        self.gravity = gravityValueBeforePlanetX;
      }
      else {
        // determine body
        var body = _.find( self.bodies, bodyNew );

        // set new gravity
        if ( body && body !== Body.CUSTOM ) {
          self.gravity = body.gravity;
        }
      }
    } );

    // change body if gravity was changed
    this.gravityProperty.lazyLink( function( gravity ) {
      // determine body
      var body = _.find( self.bodies, function( body ) {
        return Math.abs( body.gravity - gravity ) < 0.1;
      } );

      // set new body
      if ( body && body !== Body.PLANET_X ) {
        self.body = body;
      }
      else {
        self.body = Body.CUSTOM;
      }
    } );

    // change pendulum visibility if number of pendulums was changed
    this.numberOfPendulumsProperty.link( function( numberOfPendulums ) {
      self.pendulums.forEach( function( pendulum, pendulumIndex ) {
        pendulum.isVisible = (numberOfPendulums > pendulumIndex);
      } );
    } );
  }

  return inherit( PropertySet, PendulumLabModel, {

    // 1 meter is equal to 175 pixels
    metersToPixels: new LinearFunction( 0, 1, 0, 175 ),

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

    // called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      dt = Math.min( 0.05, dt * this.timeSpeed );

      if ( (this.stopwatch.isRunning && this.play) || this.stepManualMode ) {
        this.stopwatch.elapsedTime += dt;
      }

      if ( this.periodTimer && ((this.periodTimer.isCalculate && this.play) || this.stepManualMode) ) {
        this.periodTimer.elapsedTime += dt;
      }

      if ( this.play || this.stepManualMode ) {
        var friction = this.friction || 0;
        var currentPendulum;
        var oldAlpha;

        for ( var i = 0; i < this.numberOfPendulums; i++ ) {
          currentPendulum = this.pendulums[ i ];

          // update position when pendulum is not selected
          if ( !currentPendulum.isUserControlled ) {
            oldAlpha = currentPendulum.alpha;

            currentPendulum.angle = (currentPendulum.angle + currentPendulum.omega * dt + 0.5 * oldAlpha * dt * dt) % (Math.PI * 2);
            currentPendulum.setAlpha( -friction / Math.pow( currentPendulum.mass, 1 / 3 ) * currentPendulum.omega );
            currentPendulum.omega += 0.5 * (currentPendulum.alpha + oldAlpha) * dt;

            // prevent infinite motion after friction
            if ( Math.abs( currentPendulum.angle ) < 1e-3 && Math.abs( currentPendulum.alpha ) < 1e-3 && Math.abs( currentPendulum.omega ) < 1e-3 ) {
              currentPendulum.angle = 0;
              currentPendulum.alpha = 0;
              currentPendulum.omega = 0;
            }

            currentPendulum.updateVectors();
            currentPendulum.updateEnergiesWithTotalEnergyConstant();
          }
        }
      }
    },

    // handler for step button
    stepManual: function() {
      this.stepManualMode = true;
      this.step( 1 );
      this.stepManualMode = false;
    },

    returnHandler: function() {
      this.pendulums.forEach( function( pendulum ) {
        pendulum.resetMotion();
      } );

      if ( this.periodTimer ) {
        this.periodTimer.stop();
      }
    }
  } );
} );