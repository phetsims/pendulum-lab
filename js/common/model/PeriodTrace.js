// Copyright 2002-2014, University of Colorado Boulder

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
   * @param {PropertySet} pendulum - Pendulum model.
   * @param {Property<boolean>} isPeriodTraceVisibleProperty - Flag property to track pendulum path.
   *
   * @constructor
   */
  function PeriodTrace( pendulum, isPeriodTraceVisibleProperty ) {
    var self = this;

    PropertySet.call( this, {
      numberOfPoints: 0,
      isVisible: false, // flag to control visibility
      isRepeat: true // flag to control repeating of drawing path
    } );

    // save links to properties
    this._isPeriodTraceVisibleProperty = isPeriodTraceVisibleProperty;
    this._pendulum = pendulum;

    // properties for drawing path shape
    this.anticlockwise = null;
    this.firstAngle = null;
    this.secondAngle = null;

    // track path of pendulum
    pendulum.angleProperty.lazyLink( function( newAngle, oldAngle ) {
      if ( self.isVisible && !pendulum.isUserControlled ) {
        if ( self.numberOfPoints < 4 && Math.abs( newAngle - oldAngle ) < Math.PI / 4 ) {
          // first point
          if ( self.numberOfPoints === 0 && newAngle * oldAngle < 0 ) {
            self.anticlockwise = newAngle < 0;
            self.numberOfPoints = 1;
          }
          // second point
          else if ( self.numberOfPoints === 1 && ((self.anticlockwise && newAngle > oldAngle) || (!self.anticlockwise && newAngle < oldAngle)) ) {
            self.firstAngle = oldAngle;
            self.numberOfPoints = 2;
          }
          // third point
          else if ( self.numberOfPoints === 2 && ((!self.anticlockwise && newAngle > oldAngle) || (self.anticlockwise && newAngle < oldAngle)) ) {
            self.secondAngle = oldAngle;
            self.numberOfPoints = 3;
          }
          // fourth point
          else if ( self.numberOfPoints === 3 && newAngle * oldAngle < 0 ) {
            self.numberOfPoints = 4;
          }
        }
      }
    } );

    // clear pendulum path
    var resetPathPoints = this.resetPathPoints.bind( this );
    pendulum.gravityProperty.lazyLink( resetPathPoints );
    pendulum.lengthProperty.lazyLink( resetPathPoints );
    pendulum.isUserControlledProperty.lazyLink( resetPathPoints );
    this.isVisibleProperty.onValue( false, resetPathPoints );

    // add visibility observer
    this.addVisibilityObservers();
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
    },

    addVisibilityObservers: function() {
      var self = this;

      this.setPeriodTraceVisibility = function() {
        if ( self._isPeriodTraceVisibleProperty.value && self._pendulum.isVisible ) {
          self.isVisible = true;
        }
        else {
          self.isVisible = false;
        }
      };

      self._isPeriodTraceVisibleProperty.lazyLink( this.setPeriodTraceVisibility );
      self._pendulum.isVisibleProperty.lazyLink( this.setPeriodTraceVisibility );
    },
    removeVisibilityObservers: function() {
      this._isPeriodTraceVisibleProperty.unlink( this.setPeriodTraceVisibility );
      this._pendulum.isVisibleProperty.unlink( this.setPeriodTraceVisibility );
    }
  } );
} );