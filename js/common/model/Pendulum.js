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
      mass: mass, // mass of pendulum
      omega: 0, // angular velocity
      acceleration: 0, // acceleration value of pendulum
      accelerationVector: new Vector2( 0, 0 ),
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
        self.omega = 0;
        self.acceleration = 0;
        self.updateAccelerationVector();
        self.updateVelocityVector();
        self.totalEnergy = self.mass * self._gravityProperty.value * self.getHeight();
      }
    } );

    this.property( 'length' ).link( function( newLength, oldLength ) {
      self.omega = self.omega * oldLength / newLength;
    } );
  }

  return inherit( Movable, Pendulum, {
    getHeight: function() {
      return this.length * (1 - Math.cos( this.angle ));
    },
    updateAccelerationVector: function() {
      var omegaSq = this.omega * this.omega,
        accelerationMagnitude = this.length * Math.sqrt( this.acceleration * this.acceleration + omegaSq * omegaSq ),
        accelerationAngle = Math.atan2( omegaSq, this.acceleration );

      this.accelerationVector.setXY( -accelerationMagnitude * Math.cos( accelerationAngle ), -accelerationMagnitude * Math.sin( accelerationAngle ) );
      this.property( 'accelerationVector' ).notifyObserversStatic();
    },
    updateVelocityVector: function() {
      var velocityMagnitude = this.length * this.omega;
      this.velocityVector.setXY( -velocityMagnitude * Math.cos( this.angle ), velocityMagnitude * Math.sin( this.angle ) );
      this.property( 'velocityVector' ).notifyObserversStatic();
    },
    updateEnergies: function() {
      var h = this.getHeight(),
        tanVel = this.length * this.omega;

      this.potentialEnergy = this.mass * this._gravityProperty.value * h;
      this.kineticEnergy = 0.5 * this.mass * tanVel * tanVel;
      this.thermalEnergy = this.totalEnergy - (this.kineticEnergy + this.potentialEnergy);
    }
  } );
} );