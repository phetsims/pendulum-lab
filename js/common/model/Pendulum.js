// Copyright 2014-2015, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PeriodTrace = require( 'PENDULUM_LAB/common/model/PeriodTrace' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TWO_PI = Math.PI * 2;

  // scratch vector for convenience
  var scratchVector = new Vector2();

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
   * @param {boolean} isPeriodTraceRepeatable
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty, frictionProperty, isPeriodTraceVisibleProperty, isPeriodTraceRepeatable ) {
    var self = this;

    // @public {Property.<number>} - Length of the pendulum (in meters)
    this.lengthProperty = new NumberProperty( length );

    // @public {Property.<number>} - Mass of the pendulum (in kilograms)
    this.massProperty = new NumberProperty( mass );

    // @public {Property.<number>} - Angle in radians (0 is straight down, positive is to the right)
    this.angleProperty = new NumberProperty( 0 );

    // @public {Property.<number>} - Angular velocity (in radians/second)
    this.angularVelocityProperty = new NumberProperty( 0 );

    // @public {boolean}
    this.isPeriodTraceRepeatable = isPeriodTraceRepeatable;

    /*---------------------------------------------------------------------------*
    * Derived variables
    *----------------------------------------------------------------------------*/

    // @public {Property.<number>} - Angular acceleration in rad/s^2
    this.angularAccelerationProperty = new NumberProperty( 0 );

    // @public {Property.<Vector2>} - Position from the rotation point
    this.positionProperty = new Property( Vector2.ZERO );

    // @public {Property.<Vector2>}
    this.velocityProperty = new Property( Vector2.ZERO );

    // @public {Property.<Vector2>}
    this.accelerationProperty = new Property( Vector2.ZERO );

    // @public {Property.<number>} - In Joules
    this.kineticEnergyProperty = new NumberProperty( 0 );

    // @public {Property.<number>} - In Joules
    this.potentialEnergyProperty = new NumberProperty( 0 );

    // @public {Property.<number>} - In Joules
    this.thermalEnergyProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>} - Whether the pendulum is currently being dragged.
    this.isUserControlledProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} - Whether the pendulum tick is visible on the protractor.
    this.isTickVisibleProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} - Whether the entire pendulum is visible or not
    this.isVisibleProperty = new BooleanProperty( false );

    // @public {Property.<number>} - Coefficient for drawing the energy graph
    this.energyMultiplierProperty = new NumberProperty( 40 );

    // save link to global properties
    // @private
    this.gravityProperty = gravityProperty;
    this.frictionProperty = frictionProperty;

    // @public
    this.stepEmitter = new Emitter();
    this.userMovedEmitter = new Emitter();
    this.crossingEmitter = new Emitter();
    this.peakEmitter = new Emitter();
    this.resetEmitter = new Emitter();

    // default color for this pendulum
    // @public (read-only)
    this.color = color; // {string}

    // @public {Range} (read-only)
    this.lengthRange = new Range( 0.1, 1.0 );

    // @public {Range} (read-only)
    this.massRange = new Range( 0.1, 1.50 );

    // @public {PeriodTrace}
    this.periodTrace = new PeriodTrace( this );

    // If it NOT repeatable, the PeriodTimer type will control the visibility.
    if ( isPeriodTraceRepeatable ) {
      Property.multilink( [ isPeriodTraceVisibleProperty, this.isVisibleProperty ], function( isPeriodTraceVisible, isVisible ) {
        self.periodTrace.isVisibleProperty.value = isPeriodTraceVisible && isVisible;
      } );
    }

    // make tick on protractor visible after first drag
    this.isUserControlledProperty.lazyLink( function( isUserControlled ) {
      if ( isUserControlled ) {
        self.isTickVisibleProperty.value = true; // Seems like an UI-specific issue, not model

        self.angularVelocityProperty.value = 0;
        self.updateDerivedVariables( false );
      }
    } );

    // make the angle value visible after the first drag
    this.angleProperty.lazyLink( function() {
      if ( self.isUserControlledProperty.value ) {
        self.updateDerivedVariables( false );
        self.userMovedEmitter.emit();
      }
    } );

    // update the angular velocity when the length changes
    this.lengthProperty.lazyLink( function( newLength, oldLength ) {
      self.angularVelocityProperty.value = self.angularVelocityProperty.value * oldLength / newLength;
      self.updateDerivedVariables( false ); // preserve thermal energy
    } );

    this.updateListener = this.updateDerivedVariables.bind( this, false ); // don't add thermal energy on these callbacks
    this.massProperty.lazyLink( this.updateListener );
    gravityProperty.lazyLink( this.updateListener );
  }

  pendulumLab.register( 'Pendulum', Pendulum );

  return inherit( Object, Pendulum, {
    /**
     * Function that returns the instantaneous angular acceleration
     * @private
     *
     * @param {number} theta - angular position
     * @param {number} omega - angular velocity
     * @returns {number}
     */
    omegaDerivative: function( theta, omega ) {
      return -this.frictionTerm( omega ) - ( this.gravityProperty.value / this.lengthProperty.value ) * Math.sin( theta );
    },

    /**
     * Function that returns the tangential drag force on the pendulum per unit mass per unit length
     * The friction term has units of angular acceleration.
     * The friction has a linear and quadratic component (with speed)
     * @private
     *
     * @param {number} omega - the angular velocity of the pendulum
     * @returns {number}
     */
    frictionTerm: function( omega ) {
      return this.frictionProperty.value * this.lengthProperty.value / Math.pow( this.massProperty.value, 1 / 3 ) * omega * Math.abs( omega ) +
             this.frictionProperty.value / Math.pow( this.massProperty.value, 2 / 3 ) * omega;
    },

    /**
     * Stepper function for the pendulum model.
     * It uses a Runge-Kutta approach to solve the angular differential equation
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      var theta = this.angleProperty.value;

      var omega = this.angularVelocityProperty.value;

      var numSteps = Math.max( 7, dt * 120 );

      // 10 iterations typically maintains about ~11 digits of precision for total energy
      for ( var i = 0; i < numSteps; i++ ) {
        var step = dt / numSteps;

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

        // did the pendulum crossed the vertical axis (from below)
        // is the pendulum going from left to right or vice versa, or (is the pendulum on the vertical axis and changed position )
        if ( ( newTheta * theta < 0 ) || ( newTheta === 0 && theta !== 0 ) ) {
          this.cross( i * step, ( i + 1 ) * step, newOmega > 0, theta, newTheta );
        }

        // did the pendulum reach a turning point
        // is the pendulum changing is speed from left to right or is the angular speed zero but wasn't zero on the last update
        if ( ( newOmega * omega < 0 ) || ( newOmega === 0 && omega !== 0 ) ) {
          this.peak( theta, newTheta );
        }

        theta = newTheta;
        omega = newOmega;
      }

      // update the angular variables
      this.angleProperty.value = theta;
      this.angularVelocityProperty.value = omega;

      // update the derived variables, taking into account the transfer to thermal energy if friction is present
      this.updateDerivedVariables( this.frictionProperty.value > 0 );

      this.stepEmitter.emit1( dt );
    },

    /**
     * Function that emits when the pendulum is crossing the equilibrium point (theta=0)
     * Given that the time step is finite, we attempt to do a linear interpolation, to find the
     * precise time at which the pendulum cross the vertical.
     * @private
     *
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
     * Sends a signal that the peak angle (turning angle) has been reached
     * It sends the value of the peak angle
     * @private
     *
     * @param {number} oldTheta
     * @param {number} newTheta
     */
    peak: function( oldTheta, newTheta ) {
      // a slightly better estimate is turningAngle =  ( oldTheta + newTheta ) / 2 + (dt/2)*(oldOmega^2+newOmega^2)/(oldOmega-newOmega)
      var turningAngle = (oldTheta + newTheta > 0) ? Math.max( oldTheta, newTheta ) : Math.min( oldTheta, newTheta );
      this.peakEmitter.emit1( turningAngle );
    },

    /**
     * Given the angular position and velocity, this function updates derived variables :
     * namely the various energies( kinetic, thermal, potential and total energy)
     * and the linear variables (position, velocity, acceleration) of the pendulum
     * @private
     *
     * @param {boolean} energyChangeToThermal - is Friction present in the model
     */
    updateDerivedVariables: function( energyChangeToThermal ) {
      var speed = Math.abs( this.angularVelocityProperty.value ) * this.lengthProperty.value;

      this.angularAccelerationProperty.value = this.omegaDerivative( this.angleProperty.value, this.angularVelocityProperty.value );
      var height = this.lengthProperty.value * ( 1 - Math.cos( this.angleProperty.value ) );

      var oldKineticEnergy = this.kineticEnergyProperty.value;
      this.kineticEnergyProperty.value = 0.5 * this.massProperty.value * speed * speed;

      var oldPotentialEnergy = this.potentialEnergyProperty.value;
      this.potentialEnergyProperty.value = this.massProperty.value * this.gravityProperty.value * height;

      if ( energyChangeToThermal ) {
        this.thermalEnergyProperty.value += ( oldKineticEnergy + oldPotentialEnergy ) - ( this.kineticEnergyProperty.value + this.potentialEnergyProperty.value );
      }

      this.positionProperty.value = Vector2.createPolar( this.lengthProperty.value, this.angleProperty.value - Math.PI / 2 );
      this.velocityProperty.value = Vector2.createPolar( this.angularVelocityProperty.value * this.lengthProperty.value, this.angleProperty.value ); // coordinate frame -pi/2, but perpendicular +pi/2

      // add up net forces for the acceleration

      // tangential friction
      this.accelerationProperty.value = Vector2.createPolar( -this.frictionTerm( this.angularVelocityProperty.value ) / this.massProperty.value, this.angleProperty.value );
      // tangential gravity
      this.accelerationProperty.value.add( scratchVector.setPolar( -this.gravityProperty.value * Math.sin( this.angleProperty.value ), this.angleProperty.value ) );
      // radial (centripetal acceleration)
      this.accelerationProperty.value.add( scratchVector.setPolar( this.lengthProperty.value * this.angularVelocityProperty.value * this.angularVelocityProperty.value, this.angleProperty.value + Math.PI / 2 ) );

      this.velocityProperty.notifyObserversStatic();
      this.accelerationProperty.notifyObserversStatic();
    },

    /**
     * Reset all the properties of this model.
     * @public
     */
    reset: function() {
      this.lengthProperty.reset();
      this.massProperty.reset();
      this.angleProperty.reset();
      this.angularVelocityProperty.reset();
      this.angularAccelerationProperty.reset();
      this.positionProperty.reset();
      this.velocityProperty.reset();
      this.accelerationProperty.reset();
      this.kineticEnergyProperty.reset();
      this.potentialEnergyProperty.reset();
      this.thermalEnergyProperty.reset();
      this.isUserControlledProperty.reset();
      this.isTickVisibleProperty.reset();
      this.isVisibleProperty.reset();
      this.energyMultiplierProperty.reset();

      this.updateDerivedVariables( false );
    },

    /**
     * Function that determines if the pendulum is stationary, i.e. is controlled by the user or not moving
     * @public
     *
     * @returns {boolean}
     */
    isStationary: function() {
      return this.isUserControlledProperty.value || ( this.angleProperty.value === 0 &&
                                                      this.angularVelocityProperty.value === 0 &&
                                                      this.angularAccelerationProperty.value === 0 );
    },

    /**
     * Functions returns an approximate period of the pendulum
     * The so-called small angle approximation is a lower bound to the true period in absence of friction
     * This function is currently used to fade out the path of the period trace
     * @public
     *
     * @returns {number}
     */
    getApproximatePeriod: function() {
      return 2 * Math.PI * Math.sqrt( this.lengthProperty.value / this.gravityProperty.value );
    },

    /**
     * Resets the motion of the Pendulum
     * @public
     */
    resetMotion: function() {
      this.angleProperty.reset();
      this.angularVelocityProperty.reset();

      // ticks are initially invisible
      this.isTickVisibleProperty.reset();

      this.periodTrace.resetPathPoints();

      this.updateDerivedVariables( false );

      this.resetEmitter.emit();
    },

    /**
     * Resets the thermal energy to zero
     * @public
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
