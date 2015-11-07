// Copyright 2014-2015, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var PeriodTrace = require( 'PENDULUM_LAB/common/model/PeriodTrace' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  var scratchVector = new Vector2();

  /**
   * Constructor for single pendulum model.
   *
   * @param {number} mass of pendulum, kg.
   * @param {number} length of pendulum, m.
   * @param {string} color of pendulum.
   * @param {boolean} isVisible - Initial visibility of pendulum.
   * @param {Property<number>} gravityProperty - Property with current gravity value.
   * @param {Property<number>} frictionProperty - Property with current friction value.
   * @param {Property<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty, frictionProperty, isPeriodTraceVisibleProperty ) {
    var self = this;

    // save link to global properties
    this.gravityProperty = gravityProperty;
    this.frictionProperty = frictionProperty;

    PropertySet.call( this, {
      // Primary variables
      length: length, // length of pendulum
      mass: mass, // mass of pendulum
      angle: 0, // radians, 0 indicates straight down, pi/2 is to the right
      angularVelocity: 0, // angular velocity

      // Derived variables
      angularAcceleration: 0, // angular acceleration
      position: new Vector2( 0, 0 ), // from the rotation point
      velocity: new Vector2( 0, 0 ),
      acceleration: new Vector2( 0, 0 ),
      kineticEnergy: 0, // Joules
      potentialEnergy: 0, // Joules
      thermalEnergy: 0, // Joules
      totalEnergy: 0, // Joules

      // UI??
      isUserControlled: false, // flag: is pendulum currently dragging
      isTickVisible: false,  // flag: is pendulum tick visible on protractor
      isVisible: isVisible, // flag: is pendulum visible
      energyMultiplier: 10 // coefficient for drawing energy graph
    } );

    this.height = 0; // {number}, height from where the pendulum would be at rest, in meters.

    // default color for this pendulum
    this.color = color;

    // possible length range
    this.lengthRange = new Range( 0.1, 2.0, length );

    // possible mass range
    this.massRange = new Range( 0.1, 2.1, mass );

    this.periodTrace = new PeriodTrace( this, isPeriodTraceVisibleProperty );



    // make tick on protractor visible after first drag
    this.isUserControlledProperty.lazyLink( function( isUserControlled ) {
      if ( isUserControlled ) {
        self.isTickVisible = true; // Seems like an UI-specific issue, not model

        self.angularVelocity = 0;
        self.updateDerivedVariables( false );
      }
    } );

    this.angleProperty.lazyLink( function() {
      if ( self.isUserControlled ) {
        self.angularVelocity = 0; // angular velocity shouldn't be needed?
        self.updateDerivedVariables( false );
      }
    } );

    this.lengthProperty.lazyLink( function( newLength, oldLength ) {
      self.angularVelocity = self.angularVelocity * oldLength / newLength;
      self.updateDerivedVariables( false ); // preserve thermal energy
    } );

    this.updateListener = this.updateDerivedVariables.bind( this, false ); // don't add thermal energy on these callbacks
    this.massProperty.lazyLink( this.updateListener );
    gravityProperty.lazyLink( this.updateListener );
  }

  return inherit( PropertySet, Pendulum, {
    // 2x2 differential system, derived from: t'' + ( c / m ) * t' + ( g / L ) * sin( t ) = 0, with c:coefficient of
    thetaDerivative: function( theta, omega ) {
      return omega;
    },
    omegaDerivative: function( theta, omega ) {
      return -this.frictionTerm( omega ) - ( this.gravityProperty.value / this.length ) * Math.sin( theta );
    },

    frictionTerm: function( omega ) {
      return this.frictionProperty.value * this.length / Math.pow( this.mass, 1 / 3 ) * omega * Math.abs( omega );
    },

    step: function( dt ) {
      var theta = this.angle;
      var omega = this.angularVelocity;

      var numSteps = 10;

      // 10 iterations typically maintains about ~11 digits of precision for total energy
      for ( var i = 0; i < numSteps; i++ ) {
        var step = dt / numSteps;

        // Runge Kutta (order 4)
        var k1 = this.thetaDerivative( theta, omega ) * step;
        var l1 = this.omegaDerivative( theta, omega ) * step;
        var k2 = this.thetaDerivative( theta + 0.5 * k1, omega + 0.5 * l1 ) * step;
        var l2 = this.omegaDerivative( theta + 0.5 * k1, omega + 0.5 * l1 ) * step;
        var k3 = this.thetaDerivative( theta + 0.5 * k2, omega + 0.5 * l2 ) * step;
        var l3 = this.omegaDerivative( theta + 0.5 * k2, omega + 0.5 * l2 ) * step;
        var k4 = this.thetaDerivative( theta + k3, omega + l3 ) * step;
        var l4 = this.omegaDerivative( theta + k3, omega + l3 ) * step;
        theta += ( k1 + 2 * k2 + 2 * k3 + k4 ) / 6;
        omega += ( l1 + 2 * l2 + 2 * l3 + l4 ) / 6;
      }

      this.angle = theta;
      this.angularVelocity = omega;

      this.updateDerivedVariables( this.frictionProperty.value > 0 );
    },

    updateDerivedVariables: function( energyChangeToThermal ) {
      var speed = Math.abs( this.angularVelocity ) * this.length;

      this.angularAcceleration = this.omegaDerivative( this.angle, this.angularVelocity );
      this.height = this.length * ( 1 - Math.cos( this.angle ) );

      var oldKineticEnergy = this.kineticEnergy;
      this.kineticEnergy = 0.5 * this.mass * speed * speed;

      var oldPotentialEnergy = this.potentialEnergy;
      this.potentialEnergy = this.mass * this.gravityProperty.value * this.height;

      if ( energyChangeToThermal ) {
        this.thermalEnergy += ( oldKineticEnergy + oldPotentialEnergy ) - ( this.kineticEnergy + this.potentialEnergy );
      }
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;

      this.position.setPolar( this.length, this.angle - Math.PI / 2 );
      this.velocity.setPolar( this.angularVelocity * this.length, this.angle ); // coordinate frame -pi/2, but perpendicular +pi/2

      // add up net forces for the acceleration

      // tangential friction
      this.acceleration.setPolar( -this.frictionTerm( this.angularVelocity ) / this.mass, this.angle );
      // tangential gravity
      this.acceleration.add( scratchVector.setPolar( -this.gravityProperty.value * Math.sin( this.angle ), this.angle ) );
      // radial (centripetal acceleration)
      this.acceleration.add( scratchVector.setPolar( this.length * this.angularVelocity * this.angularVelocity, this.angle + Math.PI / 2 ) );

      this.velocityProperty.notifyObserversStatic();
      this.accelerationProperty.notifyObserversStatic();
      this.positionProperty.notifyObserversStatic();
    },

    reset: function() {
      PropertySet.prototype.reset.call( this );

      this.updateDerivedVariables( false );
    },

    isStationary: function() {
      return this.isUserControlled || ( this.angle === 0 && this.angularVelocity === 0 && this.angularAcceleration === 0 );
    },

    getApproximatePeriod: function() {
      return 2 * Math.PI * Math.sqrt( this.length / this.gravityProperty.value );
    },
    getFrictionContribution: function() {
      return -this.frictionProperty.value / Math.pow( this.mass, 1 / 3 ) * this.angularVelocity;
    },
    resetMotion: function() {
      this.angleProperty.reset();
      this.angularVelocityProperty.reset();
      this.isTickVisibleProperty.reset(); // TODO: why?

      this.periodTrace.resetPathPoints();

      this.updateDerivedVariables();
    }
  } );
} );