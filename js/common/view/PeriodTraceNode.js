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
   * @param {Object} options for protractor node
   * @constructor
   */
  function PeriodTraceNode( pendulumModels, metersToPixels, options ) {
    var self = this;
    Node.call( this, options );

    this.rotation = Math.PI / 2;

    pendulumModels.forEach( function( pendulumModel ) {
      var intervalId = null, // interval id for fading timer
        isCompleted = false; // flag to control completing of trace view

      // create trace path path
      var pathNode = new Path( EMPTY_SHAPE, { stroke: pendulumModel.color, lineWidth: 2 } );
      self.addChild( pathNode );

      var resetPath = function() {
        pathNode.setShape( EMPTY_SHAPE );
        isCompleted = false;
        if ( intervalId ) {
          Timer.clearInterval( intervalId );
          intervalId = null;
        }
        pathNode.opacity = 1;
      };

      var updateShape = function() {
        var pathPointsStorage = pendulumModel.periodTrace.pathPoints.getArray(),
          shape, traceLength;

        if ( pathPointsStorage.length > 0 ) {
          shape = new Shape();
          traceLength = metersToPixels( pendulumModel.length * 3 / 4 );

          // draw first arc
          if ( pathPointsStorage.length > 1 ) {
            shape.arc( 0, 0, traceLength, 0, pathPointsStorage[ 1 ].angle, pathPointsStorage[ 0 ].anticlockwise );
            shape.lineTo( (traceLength - TRACE_STEP) * Math.cos( pathPointsStorage[ 1 ].angle ), (traceLength - TRACE_STEP) * Math.sin( pathPointsStorage[ 1 ].angle ) );

            // draw second arc
            if ( pathPointsStorage.length > 2 ) {
              shape.arc( 0, 0, traceLength - TRACE_STEP, pathPointsStorage[ 1 ].angle, pathPointsStorage[ 2 ].angle, pathPointsStorage[ 1 ].anticlockwise );
              shape.lineTo( (traceLength - 2 * TRACE_STEP) * Math.cos( pathPointsStorage[ 2 ].angle ), (traceLength - 2 * TRACE_STEP) * Math.sin( pathPointsStorage[ 2 ].angle ) );

              // draw third arc
              if ( pathPointsStorage.length > 3 ) {
                shape.arc( 0, 0, traceLength - 2 * TRACE_STEP, pathPointsStorage[ 2 ].angle, 0, pathPointsStorage[ 2 ].anticlockwise );
                isCompleted = true;
                fadeOutPath( 3 * pendulumModel.getPeriod() / 2 * 10 );
              }
              else {
                shape.arc( 0, 0, traceLength - 2 * TRACE_STEP, pathPointsStorage[ 2 ].angle, pendulumModel.angle, pathPointsStorage[ 2 ].anticlockwise );
              }
            }
            else {
              shape.arc( 0, 0, traceLength - TRACE_STEP, pathPointsStorage[ 1 ].angle, pendulumModel.angle, pathPointsStorage[ 1 ].anticlockwise );
            }
          }
          else {
            shape.arc( 0, 0, traceLength, 0, pendulumModel.angle, pathPointsStorage[ 0 ].anticlockwise );
          }
          pathNode.setShape( shape );
        }
      };

      var fadeOutPath = function( tickTime ) {
        intervalId = Timer.setInterval( function() {
          pathNode.opacity -= 0.01;
          if ( pathNode.opacity <= 0 ) {
            pendulumModel.periodTrace.isVisible = false;

            // show track continuously
            if ( pendulumModel.periodTrace.isRepeat ) {
              pendulumModel.periodTrace.isVisible = true;
            }
          }
        }, tickTime );
      };

      // update path shape
      pendulumModel.property( 'angle' ).link( function() {
        if ( pathNode.visible && !isCompleted ) {
          updateShape();
        }
      } );

      // update visibility of path node
      pendulumModel.periodTrace.property( 'isVisible' ).linkAttribute( pathNode, 'visible' );

      // clear trace if path points was removed
      pendulumModel.periodTrace.pathPoints.addItemRemovedListener( resetPath );
    } );
  }

  return inherit( Node, PeriodTraceNode );
} );