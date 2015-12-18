// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for period trace of pendulum. Can draw path once or repeat infinite.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Pendulum} pendulum - Pendulum model.
   * @param {Property<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   * @param {boolean} isPeriodTraceRepeating - Seems to be whether the period trace will automatically start up again after it finishes.
   *
   * @constructor
   */
  function PeriodTrace( pendulum, isPeriodTraceVisibleProperty, isPeriodTraceRepeating ) {
    var self = this;

    PropertySet.call( this, {
      // 0: Trace hasn't started recording.
      // 1: Pendulum had its first zero-crossing, but hasn't reached its first peak.
      // 2: Pendulum reached first peak, and is swinging towards second peak.
      // 3: Pendulum had second peak, but hasn't crossed the zero-line since.
      // 4: Pendulum trace completed.
      numberOfPoints: 0,

      // flag to control visibility of period trace
      // it's necessary because period trace can be hide even when isPeriodTraceVisibleProperty === true (example: while pendulum not reach central position)
      isVisible: false,

      isRepeat: isPeriodTraceRepeating, // flag to control repeating of drawing path

      elapsedTime: 0
    } );

    // save links to properties
    this._pendulum = pendulum;

    // properties for drawing path shape
    this.anticlockwise = null;
    this.firstAngle = null;
    this.secondAngle = null;

    pendulum.on( 'crossing', function( dt, isPositive ) {
      // On the first zero-crossing, detect anticlockwise (direction) and increment
      if ( self.numberOfPoints === 0 ) {

        // modify numberOfPoints before elapsedTime, so anything waiting for elapsedTime changes while running works
        self.numberOfPoints = 1;
        self.anticlockwise = !isPositive;

        // Set our elapsed time to the negative, as this was the elapsed time UNTIL we started. When the next step
        // callback happens, it will increment our elapsedTime to the correct (current) amount.
        self.elapsedTime = -dt;

      }
      // On the third zero-crossing (we passed by the other direction already), increment to end the period trace.
      else if ( self.numberOfPoints === 3 ) {

        // modify numberOfPoints after elapsedTime, so anything waiting for elapsedTime changes while running works
        self.elapsedTime += dt;

        self.numberOfPoints = 4;
      }
    } );
    pendulum.on( 'peak', function( theta ) {
      if ( self.numberOfPoints === 1 ) {
        self.firstAngle = theta;
        self.numberOfPoints = 2;
      }
      else if ( self.numberOfPoints === 2 ) {
        self.secondAngle = theta;
        self.numberOfPoints = 3;
      }
    } );
    pendulum.on( 'step', function( dt ) {
      if ( self.numberOfPoints > 0 && self.numberOfPoints < 4 ) {
        self.elapsedTime += dt;
      }
    } );

    // clear pendulum path
    var resetPathPoints = this.resetPathPoints.bind( this );
    pendulum.gravityProperty.lazyLink( resetPathPoints );
    pendulum.lengthProperty.lazyLink( resetPathPoints );
    pendulum.isUserControlledProperty.lazyLink( resetPathPoints );
    if ( isPeriodTraceRepeating ) {
      this.isVisibleProperty.onValue( false, resetPathPoints );
    }

    // add visibility observer
    this.addVisibilityObservers( isPeriodTraceVisibleProperty );
  }

  return inherit( PropertySet, PeriodTrace, {
    reset: function() {
      PropertySet.prototype.reset.call( this );

      this.resetPathPoints();
    },

    resetPathPoints: function() {
      this.anticlockwise = null;
      this.firstAngle = null;
      this.secondAngle = null;
      this.numberOfPoints = 0;
      this.elapsedTime = 0;
    },

    addVisibilityObservers: function( checkBoxProperty ) {
      var self = this;
      this._checkBoxProperty = checkBoxProperty;

      this.setPeriodTraceVisibility = function() {
        if ( checkBoxProperty.value && self._pendulum.isVisible ) {
          self.isVisible = true;
          self.resetPathPoints();
        }
        else {
          self.isVisible = false;
        }
      };

      checkBoxProperty.lazyLink( this.setPeriodTraceVisibility );
      self._pendulum.isVisibleProperty.lazyLink( this.setPeriodTraceVisibility );
    },
    removeVisibilityObservers: function() {
      this._checkBoxProperty.unlink( this.setPeriodTraceVisibility );
      this._pendulum.isVisibleProperty.unlink( this.setPeriodTraceVisibility );
    }
  } );
} );