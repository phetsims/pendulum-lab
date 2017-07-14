// Copyright 2014-2015, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var pattern0NumberOfDegreesDegreeSymbolString = require( 'string!PENDULUM_LAB/pattern.0numberOfDegrees.degreeSymbol' );

  // constants
  var LINE_LENGTH_DEFAULT = 3.6;
  var PENDULUM_TICK_LENGTH = 14.7;
  var RADIUS = 106;
  var TICK_5_LENGTH = 7.3;
  var TICK_10_LENGTH = 11;

  /**
   * @constructor
   *
   * @param {Array.<Pendulum>} pendula - Array of pendulum models.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options] for protractor node.
   */
  function ProtractorNode( pendula, modelViewTransform, options ) {
    var centralDashLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaX( pendula[ 0 ].lengthRange.max ), {
      stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR,
      lineDash: [ 4, 7 ]
    } );
    var pivotDot = new Circle( 2, { fill: 'black' } );
    var pivotCircle = new Circle( 5, { stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR } );

    // create background ticks
    var protractorShape = new Shape();
    for ( var currentAngleDegrees = 0; currentAngleDegrees <= 180; currentAngleDegrees += 1 ) {
      var tickLength;

      // calculate the angle in radians
      var currentAngle = Util.toRadians( currentAngleDegrees );

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
    var protractorPath = new Path( protractorShape, {
      stroke: 'black',
      lineWidth: 0.5
    } );

    // Layer for the ticks (angle of release) associated with each pendulum
    var pendulaTickLayers = [ new Node(), new Node() ];

    // Layer for degrees labels
    var degreesLayer = new Node();

    Node.call( this, _.extend( {
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
      var tickNodeLeft = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, {
        stroke: pendulum.color,
        lineWidth: 2
      } );
      pendulaTickLayers[ pendulumIndex ].addChild( tickNodeLeft );
      var tickNodeRight = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, {
        stroke: pendulum.color,
        lineWidth: 2
      } );
      pendulaTickLayers[ pendulumIndex ].addChild( tickNodeRight );

      var updateTicksPosition = function() {
        if ( pendulum.isUserControlledProperty.value ) {
          tickNodeLeft.setRotation( Math.PI / 2 - pendulum.angleProperty.value );
          tickNodeRight.setRotation( Math.PI / 2 + pendulum.angleProperty.value );
        }
      };

      // add number of degrees text
      var degreesText = new Text( '0', {
        centerY: 15,
        font: PendulumLabConstants.PROTRACTOR_DEGREES_FONT,
        fill: pendulum.color
      } );
      degreesLayer.addChild( degreesText );

      var updateDegreesText = function() {
        if ( pendulum.isUserControlledProperty.value ) {
          var degrees = Util.toDegrees( pendulum.angleProperty.value );
          assert && assert( degrees <= 180 && degrees >= -180, 'Out of range angle' );

          degreesText.text = StringUtils.format( pattern0NumberOfDegreesDegreeSymbolString, Util.toFixed( degrees, 0 ) );
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

  pendulumLab.register( 'ProtractorNode', ProtractorNode );

  return inherit( Node, ProtractorNode );
} );
