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
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} mass of pendulum, kg
   * @param {number} length of pendulum, m
   * @param {string} color of pendulum
   * @param {boolean} isVisible - Initial visibility of pendulum.
   * @param {Property} gravityProperty - Property with current gravity value.
   * @param {Property} isPeriodTraceVisibleProperty - Flag property to track pendulum path.
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty, isPeriodTraceVisibleProperty ) {
    var self = this;

    // save link to gravity property
    this._gravityProperty = gravityProperty;

    Movable.call( this, {
      angle: 0, // value of the angular displacement
      length: length, // length of pendulum
      height: 0, // height above lowest point
      mass: mass, // mass of pendulum
      acceleration: 0, // acceleration value of pendulum
      omega: 0, // angular velocity
      velocity: 0, // tangential velocity
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
      range: new Range( 0.1, 2.0, length ), // possible length range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // additional properties for pendulum mass
    this.massOptions = {
      range: new Range( 0.1, 2.1, mass ), // possible mass range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // array to store checkpoints when track path
    this.pathPoints = new ObservableArray();

    // make tick on protractor visible after first drag
    this.property( 'isUserControlled' ).link( function( isUserControlled ) {
      if ( isUserControlled ) {
        self.isTickVisible = true;
        self.totalEnergy = self.mass * self._gravityProperty.value * self.getHeight();
        self.resetVectorParameters();

        self.updateVectors();
        self.updateEnergiesWithTotalEnergyConstant();

        self.pathPoints.clear();
      }
    } );

    this.property( 'angle' ).link( function( newAngle, oldAngle ) {
      if ( self.isUserControlled ) {
        self.totalEnergy = self.mass * self._gravityProperty.value * self.getHeight();
        self.resetVectorParameters();
        self.updateVectors();
        self.updateEnergiesWithTotalEnergyConstant();
      }
      // track path of pendulum
      else if ( self.isVisible && isPeriodTraceVisibleProperty.value ) {
        var pathArray = self.pathPoints.getArray();

        if ( self.pathPoints.length < 4 ) {
          // first point
          if ( self.pathPoints.length === 0 && newAngle * oldAngle < 0 ) {
            self.pathPoints.push( {anticlockwise: newAngle < 0} );
          }
          // second point
          else if ( self.pathPoints.length === 1 && ((pathArray[0].anticlockwise && newAngle > oldAngle) || (!pathArray[0].anticlockwise && newAngle < oldAngle)) ) {
            self.pathPoints.push( {angle: oldAngle, anticlockwise: !pathArray[0].anticlockwise} );
          }
          // third point
          else if ( self.pathPoints.length === 2 && ((pathArray[1].anticlockwise && newAngle > oldAngle) || (!pathArray[1].anticlockwise && newAngle < oldAngle)) ) {
            self.pathPoints.push( {angle: oldAngle, anticlockwise: !pathArray[1].anticlockwise} );
          }
          // fourth point
          else if ( self.pathPoints.length === 3 && newAngle * oldAngle < 0 ) {
            self.pathPoints.push( {anticlockwise: pathArray[2].anticlockwise} );
          }
        }
      }
    } );

    this.property( 'length' ).lazyLink( function( newLength, oldLength ) {
      self.omega = self.omega * oldLength / newLength;
      self.updateVectors();
      self.updateEnergiesWithThermalEnergyConstant();
      self.pathPoints.clear();
    } );

    this.property( 'mass' ).link( this.updateEnergiesWithThermalEnergyConstant.bind( this ) );
    gravityProperty.link( this.updateEnergiesWithThermalEnergyConstant.bind( this ) );

    // clear pendulum path
    isPeriodTraceVisibleProperty.onValue( false, function() {
      self.pathPoints.clear();
    } );
  }

  return inherit( Movable, Pendulum, {
    getHeight: function() {
      return this.length * (1 - Math.cos( this.angle ));
    },
    getVelocity: function() {
      return this.length * this.omega;
    },
    getPeriod: function() {
      return 2 * Math.PI * Math.sqrt( this.length / this._gravityProperty.value );
    },
    reset: function() {
      Movable.prototype.reset.call( this );

      this.pathPoints.reset();
    },
    resetMotion: function() {
      this.property( 'angle' ).reset();
      this.property( 'acceleration' ).reset();
      this.property( 'omega' ).reset();
      this.property( 'velocity' ).reset();
      this.property( 'kineticEnergy' ).reset();
      this.property( 'potentialEnergy' ).reset();
      this.property( 'thermalEnergy' ).reset();
      this.property( 'totalEnergy' ).reset();
      this.property( 'isTickVisible' ).reset();

      this.updateVectors();
      this.updateEnergiesWithTotalEnergyConstant();
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
      this.thermalEnergy = Math.max( 0, this.totalEnergy - (this.kineticEnergy + this.potentialEnergy) );
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