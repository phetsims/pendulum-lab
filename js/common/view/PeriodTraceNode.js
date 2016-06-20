// Copyright 2014-2015, University of Colorado Boulder

/**
 * Period trace node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Timer = require( 'PHET_CORE/Timer' );

  // constants
  var DEFAULT_TRACE_STEP = 10; // in pixels - JO: No it's not pixels. At all...

  /**
   * @param {Array.<Pendulum>} pendulums - Array of pendulum models.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options] for protractor node
   * @constructor
   */
  function PeriodTraceNode( pendulums, modelViewTransform, options ) {
    var self = this;
    Node.call( this, _.extend( {
      pickable: false,
      rotation: Math.PI / 2,
      preventFit: true
    }, options ) );

    pendulums.forEach( function( pendulum ) {
      var intervalId = null; // interval id for fading timer
      var isCompleted = false; // flag to control completing of trace view

      // create trace path path
      var pathNode = new Path( null, { stroke: pendulum.color, lineWidth: 2 } );
      self.addChild( pathNode );

      // reset the path
      var resetPath = function() {
        pathNode.setShape( null );
        isCompleted = false;
        if ( intervalId ) {
          Timer.clearInterval( intervalId );
          intervalId = null;
        }
        pathNode.opacity = 1;
      };

      // draw the path based on the state of the pendulum
      var updateShape = function() {
        var periodTrace = pendulum.periodTrace;
        var numberOfPoints = periodTrace.numberOfPoints;

        if ( numberOfPoints > 0 ) { // 0 means we just started the trace
          var shape = new Shape(); // create the new shape

          // trace length is how far away from the pivot the trace will show up.
          var traceLength = modelViewTransform.modelToViewDeltaX( pendulum.length * 3.2 / 4 - 0.1 / 2 );

          // traceStep is how the distance between two line of the trace
          var traceStep = DEFAULT_TRACE_STEP;
          if ( traceStep * 4 > traceLength ) {
            traceStep = traceLength / 4;
          }

          // draw first arc
          if ( numberOfPoints > 1 ) {
            shape.arc( 0, 0, traceLength, 0, -periodTrace.firstAngle, !periodTrace.counterClockwise );
            shape.lineTo( (traceLength - traceStep) * Math.cos( -periodTrace.firstAngle ), (traceLength - traceStep) * Math.sin( -periodTrace.firstAngle ) );

            // draw second arc
            if ( numberOfPoints > 2 ) {
              shape.arc( 0, 0, traceLength - traceStep, -periodTrace.firstAngle, -periodTrace.secondAngle, periodTrace.counterClockwise );
              shape.lineTo( (traceLength - 2 * traceStep) * Math.cos( -periodTrace.secondAngle ), (traceLength - 2 * traceStep) * Math.sin( -periodTrace.secondAngle ) );

              // draw third arc
              if ( numberOfPoints > 3 ) {
                shape.arc( 0, 0, traceLength - 2 * traceStep, -periodTrace.secondAngle, 0, !periodTrace.counterClockwise );
                isCompleted = true;
                fadeOutPath( 3 * pendulum.getApproximatePeriod() / 2 * 10 );
              }
              else {
                shape.arc( 0, 0, traceLength - 2 * traceStep, -periodTrace.secondAngle, -pendulum.angle, !periodTrace.counterClockwise );
              }
            }
            else {
              shape.arc( 0, 0, traceLength - traceStep, -periodTrace.firstAngle, -pendulum.angle, periodTrace.counterClockwise );
            }
          }
          else {
            shape.arc( 0, 0, traceLength, 0, -pendulum.angle, !periodTrace.counterClockwise );
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
      pendulum.periodTrace.numberOfPointsProperty.lazyLink( function( numberNew, numberPrev ) {
        if ( numberNew < numberPrev ) {
          resetPath();
        }
      } );
    } );
  }

  pendulumLab.register( 'PeriodTraceNode', PeriodTraceNode );

  return inherit( Node, PeriodTraceNode );
} );