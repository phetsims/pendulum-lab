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
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Array} pendulumModel - Pendulum model.
   * @param {Property} isPeriodTraceVisibleProperty - Flag property to track pendulum path.
   *
   * @constructor
   */
  function PeriodTrace( pendulumModel, isPeriodTraceVisibleProperty ) {
    var self = this;

    PropertySet.call( this, {
      isVisible: false, // flag to control visibility
      isRepeat: true // flag to control repeating of drawing path
    } );

    // array to store checkpoints when track path
    this.pathPoints = new ObservableArray();

    // track path of pendulum
    pendulumModel.property( 'angle' ).link( function( newAngle, oldAngle ) {
      if ( self.isVisible && !pendulumModel.isUserControlled ) {
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

    // clear pendulum path
    var clearPathPoints = this.pathPoints.clear.bind( this.pathPoints );
    pendulumModel.property( 'length' ).lazyLink( clearPathPoints );
    pendulumModel.property( 'isUserControlled' ).lazyLink( clearPathPoints );
    this.property( 'isVisible' ).onValue( false, clearPathPoints );

    var setPeriodTraceVisibility = function() {
      if ( isPeriodTraceVisibleProperty.value && pendulumModel.isVisible ) {
        self.isVisible = true;
      }
      else {
        self.isVisible = false;
      }
    };

    isPeriodTraceVisibleProperty.lazyLink( setPeriodTraceVisibility );
    pendulumModel.property( 'isVisible' ).lazyLink( setPeriodTraceVisibility );
  }

  return inherit( PropertySet, PeriodTrace, {
    reset: function() {
      PropertySet.prototype.reset.call( this );

      this.pathPoints.reset();
    }
  } );
} );