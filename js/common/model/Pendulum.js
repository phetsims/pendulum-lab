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
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} mass of pendulum, kg
   * @param {number} length of pendulum, m
   * @param {string} color of pendulum
   * @param {boolean} isVisible - Initial visibility of pendulum
   * @param {Property} gravityProperty - Property with current gravity value
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty ) {
    var self = this;

    // save link to gravity property
    this._gravityProperty = gravityProperty;

    Movable.call( this, {
      angle: 0, // value of the angular displacement
      length: length, // length of pendulum
      height: 0, // height above lowest point
      mass: mass, // mass of pendulum
      omega: 0, // angular velocity
      acceleration: 0, // acceleration value of pendulum
      accelerationVector: new Vector2( 0, 0 ),
      velocity: 0, // tangential velocity
      velocityVector: new Vector2( 0, 0 ), // velocity value of pendulum
      isUserControlled: false, // flag: is pendulum currently dragging
      isTickVisible: false,  // flag: is pendulum tick visible on protractor
      isVisible: isVisible,// flag: is pendulum visible

      // energies are in Joules
      kineticEnergy: 0,
      potentialEnergy: 0,
      thermalEnergy: 0,
      totalEnergy: 0
    } );

    // default color for this pendulum
    this.color = color;

    // additional properties for pendulum length
    this.lengthOptions = {
      range: new Range( 0.5, 2.5, length ), // possible length range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // additional properties for pendulum mass
    this.massOptions = {
      range: new Range( 0.1, 2.1, mass ), // possible mass range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // make tick on protractor visible after first drag
    this.property( 'isUserControlled' ).link( function( isUserControlled ) {
      if ( isUserControlled ) {
        self.isTickVisible = true;
        self.totalEnergy = self.mass * self._gravityProperty.value * self.getHeight();
        self.resetVectorParameters();

        self.updateVectors();
        self.updateEnergiesWithTotalEnergyConstant();
      }
    } );

    this.property( 'angle' ).link( function() {
      if ( self.isUserControlled ) {
        self.totalEnergy = self.mass * self._gravityProperty.value * self.getHeight();
        self.resetVectorParameters();
        self.updateVectors();
        self.updateEnergiesWithTotalEnergyConstant();
      }
    } );

    this.property( 'length' ).lazyLink( function( newLength, oldLength ) {
      self.omega = self.omega * oldLength / newLength;
      self.updateVectors();
      self.updateEnergiesWithThermalEnergyConstant();
    } );

    this.property( 'mass' ).link( this.updateEnergiesWithThermalEnergyConstant.bind( this ) );
    gravityProperty.link( this.updateEnergiesWithThermalEnergyConstant.bind( this ) );
  }

  return inherit( Movable, Pendulum, {
    getHeight: function() {
      return this.length * (1 - Math.cos( this.angle ));
    },
    getVelocity: function() {
      return this.length * this.omega;
    },
    updateVectors: function() {
      this.updateVelocityVector();
      this.updateAccelerationVector();
    },
    updateVelocityVector: function() {
      this.velocityVector.setXY( -this.getVelocity(), 0 );
      this.property( 'velocityVector' ).notifyObserversStatic();
    },
    updateAccelerationVector: function() {
      var omegaSq = this.omega * this.omega,
        accelerationMagnitude = this.length * Math.sqrt( this.acceleration * this.acceleration + omegaSq * omegaSq ),
        accelerationAngle = Math.atan2( omegaSq, this.acceleration );

      this.accelerationVector.setXY( -accelerationMagnitude * Math.cos( accelerationAngle ), -accelerationMagnitude * Math.sin( accelerationAngle ) );
      this.property( 'accelerationVector' ).notifyObserversStatic();
    },
    updateEnergiesWithTotalEnergyConstant: function() {
      this.potentialEnergy = this.mass * this._gravityProperty.value * this.getHeight();
      this.kineticEnergy = 0.5 * this.mass * this.getVelocity() * this.getVelocity();
      this.thermalEnergy = this.totalEnergy - (this.kineticEnergy + this.potentialEnergy);
    },
    updateEnergiesWithThermalEnergyConstant: function() {
      this.potentialEnergy = this.mass * this._gravityProperty.value * this.getHeight();
      this.kineticEnergy = 0.5 * this.mass * this.getVelocity() * this.getVelocity();
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;
    },
    resetVectorParameters: function() {
      this.omega = 0;
      this.acceleration = -this._gravityProperty.value / this.length * Math.sin( this.angle );
    }
  } );
} );