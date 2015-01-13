//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Pendulum = require( 'PENDULUM_LAB/common/model/Pendulum' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Planet = require( 'PENDULUM_LAB/common/model/Planet' );
  var Planets = require( 'PENDULUM_LAB/common/Planets' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var Ruler = require( 'PENDULUM_LAB/common/model/Ruler' );
  var Stopwatch = require( 'PENDULUM_LAB/common/model/Stopwatch' );

  // strings
  var CustomString = require( 'string!PENDULUM_LAB/custom' );
  var EarthString = require( 'string!PENDULUM_LAB/earth' );
  var JupiterString = require( 'string!PENDULUM_LAB/jupiter' );
  var MoonString = require( 'string!PENDULUM_LAB/moon' );
  var PlanetXString = require( 'string!PENDULUM_LAB/planetX' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function PendulumLabModel() {
    var self = this;

    PropertySet.call( this, {
      gravity: 9.81, // gravitational acceleration
      planet: Planets.EARTH, // current planet name
      timeSpeed: 1, // speed of time ticking
      numberOfPendulums: 1, // number of visible pendulums,
      play: true, // flag: controls running of time
      isPeriodTraceVisible: false // flag: controls visibility of period trace timer
    } );

    this.pendulumModels = [
      new Pendulum( 1, 1.5, PendulumLabConstants.FIRST_PENDULUM_COLOR, true, this.property( 'gravity' ), this.property( 'isPeriodTraceVisible' ) ),
      new Pendulum( 0.5, 1, PendulumLabConstants.SECOND_PENDULUM_COLOR, false, this.property( 'gravity' ), this.property( 'isPeriodTraceVisible' ) )
    ];

    this.planetModels = [
      new Planet( Planets.MOON, MoonString, 1.62 ), // moon
      new Planet( Planets.EARTH, EarthString, 9.81 ), // earth
      new Planet( Planets.JUPITER, JupiterString, 24.79 ), // jupiter
      new Planet( Planets.PLANET_X, PlanetXString, 14.2 ), // planet x
      new Planet( Planets.CUSTOM, CustomString ) // custom
    ];

    // possible gravity range
    this.gravityRange = new Range( 0, 25, this.gravity );

    // model for ruler
    this.rulerModel = new Ruler();

    // model for stopwatch
    this.stopwatchModel = new Stopwatch();

    // change gravity if planet was changed
    this.property( 'planet' ).lazyLink( function( planet ) {
      // determine planet
      var planetModel = _.find( self.planetModels, {'name': planet} );

      // set new gravity
      if ( planetModel.gravity ) {
        self.gravity = planetModel.gravity;
      }
    } );

    // change planet if gravity was changed
    this.property( 'gravity' ).lazyLink( function( gravity ) {
      // determine planet
      var planetModel = _.find( self.planetModels, function( planetModel ) {
        return Math.abs( planetModel.gravity - gravity ) < 0.1;
      } );

      // set new planet
      if ( planetModel && planetModel.name !== Planets.PLANET_X ) {
        self.planet = planetModel.name;
      }
      else {
        self.planet = Planets.CUSTOM;
      }
    } );

    // change pendulum visibility if number of pendulums was changed
    this.property( 'numberOfPendulums' ).link( function( numberOfPendulums ) {
      self.pendulumModels.forEach( function( pendulumModel, pendulumModelIndex ) {
        pendulumModel.isVisible = (numberOfPendulums > pendulumModelIndex);
      } );
    } );
  }

  return inherit( PropertySet, PendulumLabModel, {

    // 1 meter is equal to 175 pixels
    metersToPixels: new LinearFunction( 0, 1, 0, 175 ),

    reset: function() {
      PropertySet.prototype.reset.call( this );

      // reset ruler model
      PropertySet.prototype.reset.call( this.rulerModel );

      // reset stopwatch model
      PropertySet.prototype.reset.call( this.stopwatchModel );

      // reset pendulum models
      this.pendulumModels.forEach( function( pendulumModel ) {
        pendulumModel.reset();
      } );
    },

    // called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      dt = Math.min( 0.05, dt * this.timeSpeed );

      if ( (this.stopwatchModel.isRunning && this.play) || this.stepManualMode ) {
        this.stopwatchModel.elapsedTime += dt;
      }

      if ( this.periodTimerModel && ((this.periodTimerModel.isCalculate && this.play) || this.stepManualMode) ) {
        this.periodTimerModel.elapsedTime += dt;
      }

      if ( this.play || this.stepManualMode ) {
        var friction = this.friction || 0,
          currentPendulum,
          oldAcceleration;

        for ( var i = 0; i < this.numberOfPendulums; i++ ) {
          currentPendulum = this.pendulumModels[i];

          // update position when pendulum is not selected
          if ( !currentPendulum.isUserControlled ) {
            oldAcceleration = currentPendulum.acceleration;

            currentPendulum.angle = (currentPendulum.angle + currentPendulum.omega * dt + 0.5 * oldAcceleration * dt * dt) % (Math.PI * 2);
            currentPendulum.acceleration = -this.gravity / currentPendulum.length * Math.sin( currentPendulum.angle ) - friction / Math.pow( currentPendulum.mass, 1 / 3 ) * currentPendulum.omega;
            currentPendulum.omega += 0.5 * (currentPendulum.acceleration + oldAcceleration) * dt;

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
    }
  } );
} );