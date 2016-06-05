// Copyright 2014-2015, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Emitter = require( 'AXON/Emitter' );
  var PeriodTrace = require( 'PENDULUM_LAB/common/model/PeriodTrace' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  var scratchVector = new Vector2();

  // constants
  var TWO_PI = Math.PI * 2;

  /**
   * Constructor for single pendulum model.
   *
   * @param {number} mass - mass of pendulum, kg.
   * @param {number} length - length of pendulum, m.
   * @param {string} color - color of pendulum.
   * @param {boolean} isVisible - Initial visibility of pendulum.
   * @param {Property.<number>} gravityProperty - Property with current gravity value.
   * @param {Property.<number>} frictionProperty - Property with current friction value.
   * @param {Property.<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   * @param {boolean} isPeriodTraceRepeating
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty, frictionProperty, isPeriodTraceVisibleProperty, isPeriodTraceRepeating ) {
    var self = this;

    // save link to global properties
    this.gravityProperty = gravityProperty;
    this.frictionProperty = frictionProperty;

    PropertySet.call( this, {
      // Primary variables
      length: length, // length of pendulum in meters
      mass: mass, // mass of pendulum in kg
      angle: 0, // radians, 0 indicates straight down, pi/2 is to the right
      angularVelocity: 0, // angular velocity in rad/s

      // Derived variables
      angularAcceleration: 0, // angular acceleration in rad/s^2
      position: new Vector2( 0, 0 ), // from the rotation point
      velocity: new Vector2( 0, 0 ),
      acceleration: new Vector2( 0, 0 ),
      kineticEnergy: 0, // Joules
      potentialEnergy: 0, // Joules
      thermalEnergy: 0, // Joules
      totalEnergy: 0, // Joules

      // UI??
      isUserControlled: false, // flag: is pendulum currently being dragged
      isTickVisible: false,  // flag: is pendulum tick visible on protractor
      isVisible: isVisible, // flag: is pendulum visible
      energyMultiplier: 40 // coefficient for drawing energy graph
    } );

    this.stepEmitter = new Emitter();
    this.userMovedEmitter = new Emitter();
    this.crossingEmitter = new Emitter();
    this.peakEmitter = new Emitter();
    this.resetEmitter = new Emitter();

    this.height = 0; // {number}, height from where the pendulum would be at rest, in meters.

    // default color for this pendulum
    this.color = color;

    // possible length range in meters
    this.lengthRange = new Range( 0.1, 1.0, length );

    // possible mass range in kg
    this.massRange = new Range( 0.1, 1.5, mass );

    this.periodTrace = new PeriodTrace( this, isPeriodTraceVisibleProperty, isPeriodTraceRepeating );



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
        self.userMovedEmitter.emit();
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

  pendulumLab.register( 'Pendulum', Pendulum );

  return inherit( PropertySet, Pendulum, {
    /**
     * Function that return the instantaneous angular acceleration
     * @param {number} theta - angular position
     * @param {number} omega - angular velocity
     * @returns {number} 
     */
    omegaDerivative: function( theta, omega ) {
      return -this.frictionTerm( omega ) - ( this.gravityProperty.value / this.length ) * Math.sin( theta );
    },

    // TODO need more conventional names for this function
    /**
     * 
     * @param omega
     * @returns {number}
     */
    frictionTerm: function( omega ) {
      return this.frictionProperty.value * this.length / Math.pow( this.mass, 1 / 3 ) * omega * Math.abs( omega );
    },

    /**
     * Stepper function for the pendulum model.
     * It uses a Runge-Kutta approach to solve the angular differential equation
     * @param {number} dt
     */
    step: function( dt ) {
      var theta = Pendulum.modAngle( this.angle );
      var omega = this.angularVelocity;

      var numSteps = Math.max( 7, dt * 120 );

      // 10 iterations typically maintains about ~11 digits of precision for total energy
      for ( var i = 0; i < numSteps; i++ ) {
        var step = dt / numSteps;

        // 2x2 differential system, derived from: t'' + ( c / m ) * t' + ( g / L ) * sin( t ) = 0, with c:coefficient of

        // Runge Kutta (order 4), where the derivative of theta is omega.
        var k1 = omega * step;
        var l1 = this.omegaDerivative( theta, omega ) * step;
        var k2 = ( omega + 0.5 * l1 ) * step;
        var l2 = this.omegaDerivative( theta + 0.5 * k1, omega + 0.5 * l1 ) * step;
        var k3 = ( omega + 0.5 * l2 ) * step;
        var l3 = this.omegaDerivative( theta + 0.5 * k2, omega + 0.5 * l2 ) * step;
        var k4 = ( omega + l3 ) * step;
        var l4 = this.omegaDerivative( theta + k3, omega + l3 ) * step;
        var newTheta = Pendulum.modAngle( theta + ( k1 + 2 * k2 + 2 * k3 + k4 ) / 6 );
        var newOmega = omega + ( l1 + 2 * l2 + 2 * l3 + l4 ) / 6;

        if ( newTheta * theta < 0 ) {
          this.cross( i * step, ( i + 1 ) * step, newOmega > 0, theta, newTheta );
        }
        else if ( newTheta === 0 && theta !== 0 ) {
          this.cross( i * step, ( i + 1 ) * step, newOmega > 0, theta, newTheta );
        }

        if ( newOmega * omega < 0 ) {
          this.peak( theta, newTheta );
        }
        else if ( newOmega === 0 && omega !== 0 ) {
          this.peak( theta, newTheta );
        }

        theta = newTheta;
        omega = newOmega;
      }

      this.angle = theta;
      this.angularVelocity = omega;

      this.updateDerivedVariables( this.frictionProperty.value > 0 );

      this.stepEmitter.emit1( dt );
    },
    
    /**
     * Function that emits when the pendulum is crossing the equilibrium point (theta=0)
     * Given that the time step is finite, we attempt to do a linear interpolation, to find the 
     * precise time at which the pendulum cross the vertical.
     * @param {number} oldDT
     * @param {number} newDT
     * @param {boolean} isPositiveDirection
     * @param {number} oldTheta
     * @param {number} newTheta
     */
    cross: function( oldDT, newDT, isPositiveDirection, oldTheta, newTheta ) {
      // If we crossed near oldTheta, our crossing DT is near oldDT. If we crossed near newTheta, our crossing DT is close
      // to newDT.
      var crossingDT = Util.linear( oldTheta, newTheta, oldDT, newDT, 0 );

      this.crossingEmitter.emit2( crossingDT, isPositiveDirection );
    },

    /**
     * @private
     * @param {number} oldTheta
     * @param {number} newTheta
     */
    peak: function( oldTheta, newTheta ) {
      // TODO: we could get a much better theta estimate.
      this.peakEmitter.emit1( ( oldTheta + newTheta ) / 2 );
    },

    /**
     * Given the angular position and velocity, this function updates derived variables : 
     * namely the various energies( kinetic , thermal, potential and total energy)  
     * and the linear variable (position, velocity, acceleration) of the pendulum
     * @private
     * @param {boolean} energyChangeToThermal
     */
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

    /**
     * Reset all the property of this model.
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );

      // let's prevent an unnecessary update of the derivatives
      this.updateDerivedVariables( false );
    },

    /**
     * Function that determines if the pendulum is stationary, i.e. is controlled by the user or not moving
     * @returns {boolean}
     */
    isStationary: function() {
      return this.isUserControlled || ( this.angle === 0 && this.angularVelocity === 0 && this.angularAcceleration === 0 );
    },

    /**
     * Functions returns an approximate period of the pendulum 
     * The so-called small angle approximation is a lower bound to the true period in absence of friction
     * Function is currently used to fade out the path 
     * @public
     * @returns {number}
     */
    getApproximatePeriod: function() {
      return 2 * Math.PI * Math.sqrt( this.length / this.gravityProperty.value );
    },
    // TODO: it this function used anywhere??
    /**
     * 
     * @returns {number}
     */
    getFrictionContribution: function() {
      return -this.frictionProperty.value / Math.pow( this.mass, 1 / 3 ) * this.angularVelocity;
    },
    /**
     * 
     */
    resetMotion: function() {
      this.angleProperty.reset();
      this.angularVelocityProperty.reset();
      this.isTickVisibleProperty.reset(); // TODO: why?

      this.periodTrace.resetPathPoints();

      this.updateDerivedVariables();

      this.resetEmitter.emit();
    },
    /**
     * 
     */
    resetThermalEnergy: function() {
      this.thermalEnergyProperty.reset();
    }
  }, {
    /**
     * Takes our angle modulo 2pi between -pi and pi.
     * @public
     *
     * @param {number} angle
     * @returns {number}
     */
    modAngle: function( angle ) {
      angle = angle % TWO_PI;

      if ( angle < -Math.PI ) {
        angle += TWO_PI;
      }
      if ( angle > Math.PI ) {
        angle -= TWO_PI;
      }

      return angle;
    }
  } );
} );