// Copyright 2002-2014, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Timer = require( 'JOIST/Timer' );

  // constants
  var EMPTY_SHAPE = new Shape();
  var TRACE_STEP = 10; // in pixels

  /**
   * @param {Array} pendulumModels - Array of pendulum models.
   * @param {Function} metersToPixels - Function to convert meters to pixels.
   * @param {Property} isPeriodTraceVisibleProperty - Property to control visibility of period trace path.
   * @param {Object} options for protractor node
   * @constructor
   */
  function PeriodTraceNode( pendulumModels, metersToPixels, isPeriodTraceVisibleProperty, options ) {
    var self = this;
    Node.call( this, options );

    this.rotation = Math.PI / 2;

    pendulumModels.forEach( function( pendulumModel ) {
      var pathPointsStorage = [], // array for store passed points
        anticlockwise, // trace direction flag
        intervalId, // interval id for fading timer
        traceLength, // trace initial length
        isCompleted = false; // flag to control completing of trace

      // create trace path path
      var pathNode = new Path( EMPTY_SHAPE, {stroke: pendulumModel.color, lineWidth: 2} );
      self.addChild( pathNode );

      var reloadPath = function() {
        pathNode.setShape( EMPTY_SHAPE );
        pathPointsStorage = [];
        isCompleted = false;
        Timer.clearInterval( intervalId );
        pathNode.opacity = 1;
      };

      var updateShape = function() {
        var shape = new Shape();

        if ( pathPointsStorage.length > 0 ) {
          // draw first arc
          if ( pathPointsStorage.length > 1 ) {
            shape.arc( 0, 0, traceLength, 0, pathPointsStorage[1].angle, pathPointsStorage[0].anticlockwise );
            shape.lineTo( (traceLength - TRACE_STEP) * Math.cos( pathPointsStorage[1].angle ), (traceLength - TRACE_STEP) * Math.sin( pathPointsStorage[1].angle ) );

            // draw second arc
            if ( pathPointsStorage.length > 2 ) {
              shape.arc( 0, 0, traceLength - TRACE_STEP, pathPointsStorage[1].angle, pathPointsStorage[2].angle, pathPointsStorage[1].anticlockwise );
              shape.lineTo( (traceLength - 2 * TRACE_STEP) * Math.cos( pathPointsStorage[2].angle ), (traceLength - 2 * TRACE_STEP) * Math.sin( pathPointsStorage[2].angle ) );

              // draw third arc
              if ( pathPointsStorage.length > 3 ) {
                shape.arc( 0, 0, traceLength - 2 * TRACE_STEP, pathPointsStorage[2].angle, 0, pathPointsStorage[2].anticlockwise );
                isCompleted = true;
                fadeOutPath( 3 / 2 * Math.PI / Math.abs( pendulumModel.omega ) * 10 );
              }
              else {
                shape.arc( 0, 0, traceLength - 2 * TRACE_STEP, pathPointsStorage[2].angle, pendulumModel.angle, pathPointsStorage[2].anticlockwise );
              }
            }
            else {
              shape.arc( 0, 0, traceLength - TRACE_STEP, pathPointsStorage[1].angle, pendulumModel.angle, pathPointsStorage[1].anticlockwise );
            }
          }
          else {
            shape.arc( 0, 0, traceLength, 0, pendulumModel.angle, pathPointsStorage[0].anticlockwise );
          }
          pathNode.setShape( shape );
        }
      };

      var fadeOutPath = function( tickTime ) {
        intervalId = Timer.setInterval( function() {
          pathNode.opacity -= 0.01;
          if ( pathNode.opacity <= 0 ) {
            reloadPath();
          }
        }, tickTime );
      };

      // update visibility of path node
      isPeriodTraceVisibleProperty.link( function( isPeriodTraceVisible ) {
        pathNode.visible = isPeriodTraceVisible;
        reloadPath();
      } );

      // update path shape
      pendulumModel.property( 'angle' ).link( function( newAngle, oldAngle ) {
        if ( pathNode.visible && !pendulumModel.isUserControlled && !isCompleted ) {
          // first point
          if ( pathPointsStorage.length === 0 && newAngle * oldAngle < 0 ) {
            anticlockwise = newAngle < 0;
            traceLength = metersToPixels( pendulumModel.length * 3 / 4 );
            pathPointsStorage.push( {anticlockwise: anticlockwise} );
          }
          // second point
          else if ( pathPointsStorage.length === 1 && ((anticlockwise && newAngle > oldAngle) || (!anticlockwise && newAngle < oldAngle)) ) {
            anticlockwise = !anticlockwise;
            pathPointsStorage.push( {angle: oldAngle, anticlockwise: anticlockwise} );
          }
          // third point
          else if ( pathPointsStorage.length === 2 && ((anticlockwise && newAngle > oldAngle) || (!anticlockwise && newAngle < oldAngle)) ) {
            anticlockwise = !anticlockwise;
            pathPointsStorage.push( {angle: oldAngle, anticlockwise: anticlockwise} );
          }
          // fourth point
          else if ( pathPointsStorage.length === 3 && newAngle * oldAngle < 0 ) {
            pathPointsStorage.push( {anticlockwise: anticlockwise} );
          }

          updateShape();
        }
      } );

      // clear trace if length was changed or moved by user
      pendulumModel.property( 'length' ).lazyLink( reloadPath );
      pendulumModel.property( 'isUserControlled' ).lazyLink( reloadPath );
    } );
  }

  return inherit( Node, PeriodTraceNode );
} );