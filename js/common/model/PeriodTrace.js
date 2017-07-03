// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for period trace of pendulum. Can draw path once or repeat infinite.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

  /**
   * @constructor
   *
   * @param {Pendulum} pendulum
   * @param {Property.<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace
   *                                                            visibility.
   * @param {boolean} isPeriodTraceRepeatable - Seems to be whether the period trace will automatically start up again
   *                                            after it finishes.
   */
  function PeriodTrace( pendulum, isPeriodTraceVisibleProperty, isPeriodTraceRepeatable ) {
    var self = this;

    // @private {Pendulum}
    this.pendulum = pendulum;

    // @public {boolean} - Whether the path gets repeated
    this.isRepeatable = isPeriodTraceRepeatable;

    // @public {Property.<number>}
    // 0: Trace hasn't started recording.
    // 1: Pendulum had its first zero-crossing, but hasn't reached its first peak.
    // 2: Pendulum reached first peak, and is swinging towards second peak.
    // 3: Pendulum had second peak, but hasn't crossed the zero-line since.
    // 4: Pendulum trace completed.
    this.numberOfPointsProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>} - Flag to control visibility of period trace
    // it's necessary because period trace can be hidden even when isPeriodTraceVisibleProperty.value === true
    // (for example, while the pendulum has not yet reached the central portion, and thus there is nothing to display)
    this.isVisibleProperty = new BooleanProperty( false );

    // @public {Property.<number>}
    this.elapsedTimeProperty = new NumberProperty( 0 );

    // properties for drawing path shape
    this.counterClockwise = null;
    this.firstAngle = null;
    this.secondAngle = null;

    pendulum.crossingEmitter.addListener( function( dt, isPositive ) {
      // On the first zero-crossing, detect counterClockwise (direction) and increment. Don't trigger if our pendulum's angle
      // is likely to have been crossing at the top (angle~pi).
      if ( self.numberOfPointsProperty.value === 0 && Math.abs( pendulum.angleProperty.value ) < 0.5 ) {

        // modify numberOfPoints before elapsedTime, so anything waiting for elapsedTime changes while running works
        self.numberOfPointsProperty.value = 1;
        self.counterClockwise = !isPositive;

        // Set our elapsed time to the negative, as this was the elapsed time UNTIL we started. When the next step
        // callback happens, it will increment our elapsedTime to the correct (current) amount.
        self.elapsedTimeProperty.value = -dt;

      }
      // On the third zero-crossing (we passed by the other direction already), increment to end the period trace.
      else if ( self.numberOfPointsProperty.value === 3 ) {

        // modify numberOfPoints after elapsedTime, so anything waiting for elapsedTime changes while running works
        self.elapsedTimeProperty.value += dt;

        self.numberOfPointsProperty.value = 4;
      }
      // Check to see if we looped! Should have peaked before second crossing.
      else if ( self.numberOfPointsProperty.value === 1 ) {
        self.resetPathPoints();
      }
    } );
    pendulum.peakEmitter.addListener( function( theta ) {
      if ( self.numberOfPointsProperty.value === 1 ) {
        self.firstAngle = theta;
        self.numberOfPointsProperty.value = 2;
      }
      else if ( self.numberOfPointsProperty.value === 2 ) {
        self.secondAngle = theta;
        self.numberOfPointsProperty.value = 3;
      }
    } );
    pendulum.stepEmitter.addListener( function( dt ) {
      if ( self.numberOfPointsProperty.value > 0 && self.numberOfPointsProperty.value < 4 ) {
        self.elapsedTimeProperty.value += dt;
      }
    } );

    // clear pendulum path
    var resetPathPoints = this.resetPathPoints.bind( this );
    pendulum.gravityProperty.lazyLink( resetPathPoints );
    pendulum.lengthProperty.lazyLink( resetPathPoints );
    pendulum.isUserControlledProperty.lazyLink( resetPathPoints );
    if ( isPeriodTraceRepeatable ) {
      this.isVisibleProperty.onValue( false, resetPathPoints );
    }

    // add visibility observer
    this.addVisibilityObservers( isPeriodTraceVisibleProperty );
  }

  pendulumLab.register( 'PeriodTrace', PeriodTrace );

  return inherit( Object, PeriodTrace, {
    /**
     * Resets the property set and the path points
     * @public
     */
    reset: function() {
      this.numberOfPointsProperty.reset();
      this.elapsedTimeProperty.reset();
      this.isVisibleProperty.reset();
      this.resetPathPoints();
    },
    /**
     * Resets the path points that are used to draw the period path trace
     * @public
     */
    resetPathPoints: function() {
      this.counterClockwise = null;
      this.firstAngle = null;
      this.secondAngle = null;
      this.numberOfPointsProperty.value = 0;
      this.elapsedTimeProperty.value = 0;
    },

    /**
     * Adds visibility observers to the trace
     * @private
     * @param {Property.<boolean>} checkBoxProperty
     */
    addVisibilityObservers: function( checkBoxProperty ) {
      var self = this;

      // @private
      this._checkBoxProperty = checkBoxProperty;

      // listener
      this.setPeriodTraceVisibility = function() {
        if ( checkBoxProperty.value && self.pendulum.isVisibleProperty.value ) {
          self.isVisibleProperty.value = true;
          self.resetPathPoints();
        }
        else {
          self.isVisibleProperty.value = false;
        }
      };

      checkBoxProperty.lazyLink( this.setPeriodTraceVisibility );
      self.pendulum.isVisibleProperty.lazyLink( this.setPeriodTraceVisibility );
    },

    /**
     * Disposes of the visibility observers
     * @public
     */
    removeVisibilityObservers: function() {
      this._checkBoxProperty.unlink( this.setPeriodTraceVisibility );
      this.pendulum.isVisibleProperty.unlink( this.setPeriodTraceVisibility );
    }
  } );
} );
