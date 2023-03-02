// Copyright 2014-2023, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Circle, Line, Node, Path, Text } from '../../../../scenery/js/imports.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

const degreesPatternString = PendulumLabStrings.degreesPattern;

// constants
const LINE_LENGTH_DEFAULT = 3.6;
const PENDULUM_TICK_LENGTH = 14.7;
const RADIUS = 106;
const TICK_5_LENGTH = 7.3;
const TICK_10_LENGTH = 11;

class PendulumLabProtractorNode extends Node {
  /**
   * @param {Array.<Pendulum>} pendula - Array of pendulum models.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options] for protractor node.
   */
  constructor( pendula, modelViewTransform, options ) {
    const centralDashLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaX( pendula[ 0 ].lengthRange.max ), {
      stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR,
      lineDash: [ 4, 7 ]
    } );
    const pivotDot = new Circle( 2, { fill: 'black' } );
    const pivotCircle = new Circle( 5, { stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR } );

    // create background ticks
    const protractorShape = new Shape();
    for ( let currentAngleDegrees = 0; currentAngleDegrees <= 180; currentAngleDegrees += 1 ) {
      let tickLength;

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

    super( merge( {
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
    pendula.forEach( ( pendulum, pendulumIndex ) => {
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

      const updateTicksPosition = () => {
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

      const updateDegreesText = () => {
        if ( pendulum.isUserControlledProperty.value ) {
          const degrees = Utils.toDegrees( pendulum.angleProperty.value );
          assert && assert( degrees <= 180 && degrees >= -180, 'Out of range angle' );

          degreesText.string = StringUtils.fillIn( degreesPatternString, {
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
      pendulum.angleProperty.link( () => {
        updateTicksPosition();
        updateDegreesText();
      } );

      // set ticks visibility observer, present for the lifetime of the sim
      Multilink.multilink( [ pendulum.isTickVisibleProperty, pendulum.isVisibleProperty ], ( isTickVisible, isVisible ) => {
        tickNodeLeft.visible = isTickVisible && isVisible;
        tickNodeRight.visible = isTickVisible && isVisible;
        updateTicksPosition();
      } );

      // set degrees text visibility observer, present for the lifetime of the sim
      pendulum.isUserControlledProperty.link( isUserControlled => {
        degreesText.visible = isUserControlled;
        updateDegreesText();
        updateTicksPosition();
      } );
    } );
  }
}

pendulumLab.register( 'PendulumLabProtractorNode', PendulumLabProtractorNode );

export default PendulumLabProtractorNode;