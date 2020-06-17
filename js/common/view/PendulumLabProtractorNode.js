// Copyright 2014-2020, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import pendulumLab from '../../pendulumLab.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

const degreesPatternString = pendulumLabStrings.degreesPattern;

// constants
const LINE_LENGTH_DEFAULT = 3.6;
const PENDULUM_TICK_LENGTH = 14.7;
const RADIUS = 106;
const TICK_5_LENGTH = 7.3;
const TICK_10_LENGTH = 11;

/**
 * @constructor
 *
 * @param {Array.<Pendulum>} pendula - Array of pendulum models.
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options] for protractor node.
 */
function PendulumLabProtractorNode( pendula, modelViewTransform, options ) {
  const centralDashLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaX( pendula[ 0 ].lengthRange.max ), {
    stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR,
    lineDash: [ 4, 7 ]
  } );
  const pivotDot = new Circle( 2, { fill: 'black' } );
  const pivotCircle = new Circle( 5, { stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR } );

  // create background ticks
  const protractorShape = new Shape();
  for ( let currentAngleDegrees = 0; currentAngleDegrees <= 180; currentAngleDegrees += 1 ) {
    var tickLength;

    // calculate the angle in radians
    const currentAngle = Utils.toRadians( currentAngleDegrees );

    // if the angle is a multiple of 10 then make the tick the longest length
    if ( currentAngleDegrees % 10 === 0 ) {
      tickLength = TICK_10_LENGTH;
    }
    // if the angle is 5 the give it medium length
    else if ( currentAngleDegrees % 5 === 0 ) {
      tickLength = TICK_5_LENGTH;
    }
    // otherwise make the length short
    else {
      tickLength = LINE_LENGTH_DEFAULT;
    }

    // draw the tick first by finding the two positions then by drawing a line between them
    protractorShape.moveToPoint( Vector2.createPolar( RADIUS, currentAngle ) );
    protractorShape.lineToPoint( Vector2.createPolar( RADIUS + tickLength, currentAngle ) );
  }
  const protractorPath = new Path( protractorShape, {
    stroke: 'black',
    lineWidth: 0.5
  } );

  // Layer for the ticks (angle of release) associated with each pendulum
  const pendulaTickLayers = [ new Node(), new Node() ];

  // Layer for degrees labels
  const degreesLayer = new Node();

  Node.call( this, merge( {
    pickable: false,
    translation: modelViewTransform.modelToViewPosition( Vector2.ZERO ),
    children: [
      centralDashLine,
      pivotDot,
      pivotCircle,
      degreesLayer,
      protractorPath,
      pendulaTickLayers[ 1 ],
      pendulaTickLayers[ 0 ]
    ]
  }, options ) );


  // add ticks for pendulum
  pendula.forEach( function( pendulum, pendulumIndex ) {
    const tickNodeLeft = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, {
      stroke: pendulum.color,
      lineWidth: 2
    } );
    pendulaTickLayers[ pendulumIndex ].addChild( tickNodeLeft );
    const tickNodeRight = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, {
      stroke: pendulum.color,
      lineWidth: 2
    } );
    pendulaTickLayers[ pendulumIndex ].addChild( tickNodeRight );

    const updateTicksPosition = function() {
      if ( pendulum.isUserControlledProperty.value ) {
        tickNodeLeft.setRotation( Math.PI / 2 - pendulum.angleProperty.value );
        tickNodeRight.setRotation( Math.PI / 2 + pendulum.angleProperty.value );
      }
    };

    // add number of degrees text
    const degreesText = new Text( '0', {
      centerY: 15,
      font: PendulumLabConstants.PROTRACTOR_DEGREES_FONT,
      fill: pendulum.color
    } );
    degreesLayer.addChild( degreesText );

    const updateDegreesText = function() {
      if ( pendulum.isUserControlledProperty.value ) {
        const degrees = Utils.toDegrees( pendulum.angleProperty.value );
        assert && assert( degrees <= 180 && degrees >= -180, 'Out of range angle' );

        degreesText.text = StringUtils.fillIn( degreesPatternString, {
          degrees: Utils.toFixed( degrees, 0 )
        } );
        if ( pendulumIndex === 0 ) {
          degreesText.right = -25;
        }
        else {
          // must be pendulumIndex===1
          degreesText.left = 35;
        }
      }
    };

    // update tick position, present for the lifetime of the sim
    pendulum.angleProperty.link( function() {
      updateTicksPosition();
      updateDegreesText();
    } );

    // set ticks visibility observer, present for the lifetime of the sim
    Property.multilink( [ pendulum.isTickVisibleProperty, pendulum.isVisibleProperty ], function( isTickVisible, isVisible ) {
      tickNodeLeft.visible = isTickVisible && isVisible;
      tickNodeRight.visible = isTickVisible && isVisible;
      updateTicksPosition();
    } );

    // set degrees text visibility observer, present for the lifetime of the sim
    pendulum.isUserControlledProperty.link( function( isUserControlled ) {
      degreesText.visible = isUserControlled;
      updateDegreesText();
      updateTicksPosition();
    } );
  } );
}

pendulumLab.register( 'PendulumLabProtractorNode', PendulumLabProtractorNode );

inherit( Node, PendulumLabProtractorNode );
export default PendulumLabProtractorNode;