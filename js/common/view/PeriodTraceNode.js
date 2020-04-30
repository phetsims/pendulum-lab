// Copyright 2014-2020, University of Colorado Boulder

/**
 * Period trace node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import pendulumLab from '../../pendulumLab.js';

// constants
const DEFAULT_TRACE_STEP = 10; // in pixels - JO: No it's not pixels. At all...

/**
 * @constructor
 *
 * @param {Pendulum} pendulum
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options]
 */
function PeriodTraceNode( pendulum, modelViewTransform, options ) {
  const self = this;

  Node.call( this, merge( {
    pickable: false,
    rotation: Math.PI / 2,
    preventFit: true,
    translation: modelViewTransform.modelToViewPosition( Vector2.ZERO )
  }, options ) );

  let isCompleted = false; // flag to control completing of trace view

  const baseColor = new Color( pendulum.color );

  // @private {Pendulum}
  this.pendulum = pendulum;

  // @private {Property.<Color>}
  this.traceColorProperty = new Property( baseColor );

  // @private {number} - The opacity of the trace (not using Node opacity for performance reasons)
  this.colorAlpha = 1;

  // @private {number|null} - If a number, the speed at which things fade out.
  this.fadeOutSpeed = null;

  // create trace path path
  const pathNode = new Path( null, {
    stroke: this.traceColorProperty,
    lineWidth: 2
  } );
  self.addChild( pathNode );

  // reset the path
  const resetPath = function() {
    pathNode.setShape( null );
    isCompleted = false;
    self.colorAlpha = 1;
    self.traceColorProperty.value = baseColor;
    self.fadeOutSpeed = null;
  };

  // draw the path based on the state of the pendulum
  const updateShape = function() {
    const periodTrace = pendulum.periodTrace;
    const numberOfPoints = periodTrace.numberOfPointsProperty.value;

    if ( numberOfPoints > 0 ) { // 0 means we just started the trace
      const shape = new Shape(); // create the new shape

      // trace length is how far away from the pivot the trace will show up.
      const traceLength = modelViewTransform.modelToViewDeltaX( pendulum.lengthProperty.value * 3.2 / 4 - 0.1 / 2 );

      // traceStep is how the distance between two line of the trace
      let traceStep = DEFAULT_TRACE_STEP;
      if ( traceStep * 4 > traceLength ) {
        traceStep = traceLength / 4;
      }

      // draw first arc
      if ( numberOfPoints > 1 ) {
        shape.arc( 0, 0, traceLength, 0, -periodTrace.firstAngle, !periodTrace.counterClockwise );
        shape.lineTo( ( traceLength - traceStep ) * Math.cos( -periodTrace.firstAngle ), ( traceLength - traceStep ) * Math.sin( -periodTrace.firstAngle ) );

        // draw second arc
        if ( numberOfPoints > 2 ) {
          shape.arc( 0, 0, traceLength - traceStep, -periodTrace.firstAngle, -periodTrace.secondAngle, periodTrace.counterClockwise );
          shape.lineTo( ( traceLength - 2 * traceStep ) * Math.cos( -periodTrace.secondAngle ), ( traceLength - 2 * traceStep ) * Math.sin( -periodTrace.secondAngle ) );

          // draw third arc
          if ( numberOfPoints > 3 ) {
            shape.arc( 0, 0, traceLength - 2 * traceStep, -periodTrace.secondAngle, 0, !periodTrace.counterClockwise );
            isCompleted = true;
            self.fadeOutSpeed = 1 / ( 3 * pendulum.getApproximatePeriod() / 2 );
          }
          else {
            shape.arc( 0, 0, traceLength - 2 * traceStep, -periodTrace.secondAngle, -pendulum.angleProperty.value, !periodTrace.counterClockwise );
          }
        }
        else {
          shape.arc( 0, 0, traceLength - traceStep, -periodTrace.firstAngle, -pendulum.angleProperty.value, periodTrace.counterClockwise );
        }
      }
      else {
        shape.arc( 0, 0, traceLength, 0, -pendulum.angleProperty.value, !periodTrace.counterClockwise );
      }
      pathNode.setShape( shape );
    }
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
}

pendulumLab.register( 'PeriodTraceNode', PeriodTraceNode );

inherit( Node, PeriodTraceNode, {
  /**
   * Steps the view.
   * @public
   *
   * @param {number} dt
   */
  step: function( dt ) {
    if ( this.fadeOutSpeed ) {
      this.colorAlpha = Math.max( 0, this.colorAlpha - this.fadeOutSpeed * dt );
      this.traceColorProperty.value = this.traceColorProperty.value.withAlpha( this.colorAlpha );

      if ( this.colorAlpha === 0 ) {
        this.pendulum.periodTrace.onFaded();
        this.fadeOutSpeed = null;
      }
    }
  }
} );

export default PeriodTraceNode;