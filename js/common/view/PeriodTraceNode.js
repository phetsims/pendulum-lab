// Copyright 2002-2014, University of Colorado Boulder

/**
 * Period trace node in 'Pendulum Lab' simulation.
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
  var TRACE_STEP = 10; // in pixels

  /**
   * @param {Array} pendulums - Array of pendulum models.
   * @param {LinearFunction} metersToPixels - Function to convert meters to pixels.
   * @param {Object} options for protractor node
   * @constructor
   */
  function PeriodTraceNode( pendulums, metersToPixels, options ) {
    var self = this;
    Node.call( this, options );

    this.rotation = Math.PI / 2;

    pendulums.forEach( function( pendulum ) {
      var intervalId = null; // interval id for fading timer
      var isCompleted = false; // flag to control completing of trace view

      // create trace path path
      var pathNode = new Path( null, { stroke: pendulum.color, lineWidth: 2 } );
      self.addChild( pathNode );

      var resetPath = function() {
        pathNode.setShape( null );
        isCompleted = false;
        if ( intervalId ) {
          Timer.clearInterval( intervalId );
          intervalId = null;
        }
        pathNode.opacity = 1;
      };

      var updateShape = function() {
        var pathPointsStorage = pendulum.periodTrace.pathPoints.getArray(),
          shape, traceLength;

        if ( pathPointsStorage.length > 0 ) {
          shape = new Shape();
          traceLength = metersToPixels( pendulum.length * 3 / 4 );

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
                fadeOutPath( 3 * pendulum.getApproximatePeriod() / 2 * 10 );
              }
              else {
                shape.arc( 0, 0, traceLength - 2 * TRACE_STEP, pathPointsStorage[ 2 ].angle, pendulum.angle, pathPointsStorage[ 2 ].anticlockwise );
              }
            }
            else {
              shape.arc( 0, 0, traceLength - TRACE_STEP, pathPointsStorage[ 1 ].angle, pendulum.angle, pathPointsStorage[ 1 ].anticlockwise );
            }
          }
          else {
            shape.arc( 0, 0, traceLength, 0, pendulum.angle, pathPointsStorage[ 0 ].anticlockwise );
          }
          pathNode.setShape( shape );
        }
      };

      var fadeOutPath = function( tickTime ) {
        intervalId = Timer.setInterval( function() {
          pathNode.opacity -= 0.01;
          if ( pathNode.opacity <= 0 ) {
            pendulum.periodTrace.isVisible = false;

            // show track continuously
            if ( pendulum.periodTrace.isRepeat ) {
              pendulum.periodTrace.isVisible = true;
            }
          }
        }, tickTime );
      };

      // update path shape
      pendulum.angleProperty.link( function() {
        if ( pathNode.visible && !isCompleted ) {
          updateShape();
        }
      } );

      // update visibility of path node
      pendulum.periodTrace.isVisibleProperty.linkAttribute( pathNode, 'visible' );

      // clear trace if path points were removed
      pendulum.periodTrace.pathPoints.addItemRemovedListener( resetPath );
    } );
  }

  return inherit( Node, PeriodTraceNode );
} );