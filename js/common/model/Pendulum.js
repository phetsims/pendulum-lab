// Copyright 2002-2014, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );
  var PeriodTrace = require( 'PENDULUM_LAB/common/model/PeriodTrace' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for single pendulum model.
   *
   * @param {number} mass of pendulum, kg.
   * @param {number} length of pendulum, m.
   * @param {string} color of pendulum.
   * @param {boolean} isVisible - Initial visibility of pendulum.
   * @param {Property<number>} gravityProperty - Property with current gravity value.
   * @param {Property<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty, isPeriodTraceVisibleProperty ) {
    var self = this;

    // save link to gravity property
    this.gravityProperty = gravityProperty;

    Movable.call( this, {
      // value of the angular displacement
      // acceptable range for angle is [ -2 * pi ; 2 * pi ], it is rounded in PendulumLabModel.step function.
      angle: 0,

      length: length, // length of pendulum
      mass: mass, // mass of pendulum
      alpha: 0, // angular acceleration of pendulum
      omega: 0, // angular velocity
      accelerationVector: new Vector2( 0, 0 ), // acceleration vector of pendulum
      velocityVector: new Vector2( 0, 0 ), // velocity vector of pendulum
      isUserControlled: false, // flag: is pendulum currently dragging
      isTickVisible: false,  // flag: is pendulum tick visible on protractor
      isVisible: isVisible, // flag: is pendulum visible

      // energies are in Joules
      kineticEnergy: 0,
      potentialEnergy: 0,
      thermalEnergy: 0,
      totalEnergy: 0
    } );

    // default color for this pendulum
    this.color = color;

    // possible length range
    this.lengthRange = new Range( 0.1, 2.0, length );

    // possible mass range
    this.massRange = new Range( 0.1, 2.1, mass );

    this.periodTrace = new PeriodTrace( this, isPeriodTraceVisibleProperty );

    // make tick on protractor visible after first drag
    this.isUserControlledProperty.link( function( isUserControlled ) {
      if ( isUserControlled ) {
        self.isTickVisible = true;
        self.totalEnergy = self.mass * self.gravityProperty.value * self.getHeight();
        self.resetVectorParameters();

        self.updateVectors();
        self.updateEnergiesWithTotalEnergyConstant();
      }
    } );

    this.angleProperty.link( function() {
      if ( self.isUserControlled ) {
        self.totalEnergy = self.mass * self.gravityProperty.value * self.getHeight();
        self.resetVectorParameters();
        self.updateVectors();
        self.updateEnergiesWithTotalEnergyConstant();
      }
    } );

    this.lengthProperty.lazyLink( function( newLength, oldLength ) {
      self.omega = self.omega * oldLength / newLength;
      self.updateVectors();
      self.updateEnergiesWithThermalEnergyConstant();
    } );

    this.massProperty.link( this.updateEnergiesWithThermalEnergyConstant.bind( this ) );
    gravityProperty.link( this.updateEnergiesWithThermalEnergyConstant.bind( this ) );
  }

  return inherit( Movable, Pendulum, {
    getHeight: function() {
      return this.length * (1 - Math.cos( this.angle ));
    },
    getVelocity: function() {
      return this.length * this.omega;
    },
    getApproximatePeriod: function() {
      return 2 * Math.PI * Math.sqrt( this.length / this.gravityProperty.value );
    },
    resetMotion: function() {
      this.angleProperty.reset();
      this.alphaProperty.reset();
      this.omegaProperty.reset();
      this.kineticEnergyProperty.reset();
      this.potentialEnergyProperty.reset();
      this.thermalEnergyProperty.reset();
      this.totalEnergyProperty.reset();
      this.isTickVisibleProperty.reset();

      this.periodTrace.resetPathPoints();

      this.updateVectors();
      this.updateEnergiesWithTotalEnergyConstant();
    },
    setAlpha: function( frictionContribution ) {
      this.alpha = -this.gravityProperty.value / this.length * Math.sin( this.angle ) + frictionContribution;
    },
    updateVectors: function() {
      this.updateVelocityVector();
      this.updateAccelerationVector();
    },
    updateVelocityVector: function() {
      this.velocityVector.setXY( -this.getVelocity(), 0 );
      this.velocityVectorProperty.notifyObserversStatic();
    },
    updateAccelerationVector: function() {
      var omegaSq = this.omega * this.omega;
      var accelerationMagnitude = this.length * Math.sqrt( this.alpha * this.alpha + omegaSq * omegaSq );
      var accelerationAngle = Math.atan2( omegaSq, this.alpha );

      this.accelerationVector.setPolar( -accelerationMagnitude, accelerationAngle );
      this.accelerationVectorProperty.notifyObserversStatic();
    },
    updateEnergiesWithTotalEnergyConstant: function() {
      this.potentialEnergy = this.mass * this.gravityProperty.value * this.getHeight();
      this.kineticEnergy = 0.5 * this.mass * this.getVelocity() * this.getVelocity();
      this.thermalEnergy = Math.max( 0, this.totalEnergy - (this.kineticEnergy + this.potentialEnergy) );
    },
    updateEnergiesWithThermalEnergyConstant: function() {
      this.potentialEnergy = this.mass * this.gravityProperty.value * this.getHeight();
      this.kineticEnergy = 0.5 * this.mass * this.getVelocity() * this.getVelocity();
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;
    },
    resetVectorParameters: function() {
      this.omega = 0;
      this.alpha = -this.gravityProperty.value / this.length * Math.sin( this.angle );
    }
  } );
} );