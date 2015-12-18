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
      gravity: Body.EARTH.gravity, // gravitational acceleration
      bodyTitle: Body.EARTH.title, // current body title
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
    var gravityValueBeforePlanetX = this.gravity;
    this.bodyTitleProperty.lazyLink( function( bodyTitleNew, bodyTitlePrev ) {
      var body;

      if ( bodyTitleNew === Body.PLANET_X.title ) {
        // save value for further restoring
        gravityValueBeforePlanetX = self.gravity;
      }

      if ( bodyTitleNew !== Body.CUSTOM.title ) {
        body = _.find( self.bodies, { title: bodyTitleNew } );
        self.gravity = body.gravity;
      }
      else if ( bodyTitlePrev === Body.PLANET_X.title ) {
        // restore previous value
        self.gravity = gravityValueBeforePlanetX;
      }
    } );

    // change body to custom if gravity was changed
    this.gravityProperty.lazyLink( function( gravityValue ) {
      var body;

      if ( self.bodyTitle !== Body.CUSTOM.title ) {
        body = _.find( self.bodies, { gravity: gravityValue } );

        if ( !body ) {
          self.bodyTitle = Body.CUSTOM.title;
        }
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
        this.modelStep( Math.min( 0.5, dt * this.timeSpeed ) );
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
      this.modelStep( 0.25 );
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