// Copyright 2014-2015, University of Colorado Boulder

/**
 * Protractor node in 'Pendulum Lab' simulation.
 * The protracter node is responsible for displaying ticks
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var pattern0NumberOfDegreesDegreeSymbolString = require( 'string!PENDULUM_LAB/pattern.0numberOfDegrees.degreeSymbol' );

  // constants
  var FONT = new PhetFont( { size: 14, weight: 'bold' } );
  var LINE_LENGTH_DEFAULT = 3;
  var PENDULUM_TICK_LENGTH = 12;
  var RADIUS = 87;
  var TICK_5_LENGTH = 6;
  var TICK_10_LENGTH = 9;

  /**
   * @param {Array.<Pendulum>} pendulums - Array of pendulum models.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options] for protractor node.
   * @constructor
   */
  function ProtractorNode( pendulums, modelViewTransform, options ) {
    var self = this;

    Node.call( this, _.extend( { pickable: false }, options ) );

    var viewOriginPosition = modelViewTransform.modelToViewPosition( new Vector2( 0, 0 ) );
    this.translation = viewOriginPosition;
    // create central dash line
    if ( pendulums[ 0 ] ) {
      this.addChild( new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaX( pendulums[ 0 ].lengthRange.max ), {
        stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR,
        lineDash: [ 4, 7 ]
      } ) );
    }

    // create central circles
    this.addChild( new Circle( 2, { fill: 'black' } ) );
    this.addChild( new Circle( 5, { stroke: PendulumLabConstants.FIRST_PENDULUM_COLOR } ) );

    // create a separate layer to add
    var degreesLayer = new Node();
    this.addChild( degreesLayer );

    // create background ticks
    var protractorShape = new Shape();
    var currentAngleRad;
    var lineLength;
    var x1;
    var y1;
    var x2;
    var y2;

    // loop for 180 degrees
    for ( var currentAngleDeg = 0; currentAngleDeg <= 180; currentAngleDeg += 1 ) {
      // calculate the angle in radians
      currentAngleRad = currentAngleDeg * Math.PI / 180;

      // if the angle is a multiple of 10 then make the tick the longest length
      if ( currentAngleDeg % 10 === 0 ) {
        lineLength = TICK_10_LENGTH;
      }
      else if ( currentAngleDeg % 5 === 0 ) { // if the angle is 5 the give it medium length
        lineLength = TICK_5_LENGTH;
      }
      else { // otherwise make the length short
        lineLength = LINE_LENGTH_DEFAULT;
      }
      // calculate the position of the tick
      x1 = RADIUS * Math.cos( currentAngleRad );
      y1 = RADIUS * Math.sin( currentAngleRad );

      // calculate the end of the tick
      x2 = (RADIUS + lineLength) * Math.cos( currentAngleRad );
      y2 = (RADIUS + lineLength) * Math.sin( currentAngleRad );

      // draw the tick first by finding the two positions then by drawing a line between them
      protractorShape.moveTo( x1, y1 );
      protractorShape.lineTo( x2, y2 );
    }

    // add protractor path
    this.addChild( new Path( protractorShape, { stroke: 'black' } ) );

    // create and add a layer for the ticks (angle of release) associated with each pendulum
    this.firstPendulumTickLayer = new Node();
    this.secondPendulumTickLayer = new Node();
    this.addChild( this.secondPendulumTickLayer );
    this.addChild( this.firstPendulumTickLayer );

    // add ticks for pendulum
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      var tickNodeLeft = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, { stroke: pendulum.color, lineWidth: 2 } );
      var tickNodeRight = new Line( RADIUS - PENDULUM_TICK_LENGTH - 2, 0, RADIUS - 2, 0, { stroke: pendulum.color, lineWidth: 2 } );

      // to make blue ticks upper than red
      if ( pendulumIndex === 0 ) {
        self.firstPendulumTickLayer.addChild( tickNodeLeft );
        self.firstPendulumTickLayer.addChild( tickNodeRight );
      }
      else if ( pendulumIndex === 1 ) {
        self.secondPendulumTickLayer.addChild( tickNodeLeft );
        self.secondPendulumTickLayer.addChild( tickNodeRight );
      }

      /**
       * function that updates the position of the tick associated with a pendulum
       */
      var updateTicksPosition = function() {
        if ( pendulum.isUserControlledProperty.value ) {
          tickNodeLeft.setRotation( Math.PI / 2 - pendulum.angleProperty.value );
          tickNodeRight.setRotation( Math.PI / 2 + pendulum.angleProperty.value );
        }
      };

      // add number of degrees text
      var degreesText = new Text( '0', {
        centerY: 15,
        font: FONT,
        fill: pendulum.color
      } );
      degreesLayer.addChild( degreesText );

      /**
       * function that updates the text of the degrees associated with a pendulum
       */
      var updateDegreesText = function() {
        if ( pendulum.isUserControlledProperty.value ) {
          // pendulum.angle is in radians, convert to degrees
          var angle = pendulum.angleProperty.value * 180 / Math.PI;
          assert && assert( angle <= 180 && angle >= -180, 'Out of range angle' );

          degreesText.text = StringUtils.format( pattern0NumberOfDegreesDegreeSymbolString, Util.toFixed( angle, 0 ) );
          if ( pendulumIndex === 0 ) {
            degreesText.right = -25;
          }
          else {
            // must be pendulumIndex===1
            degreesText.left = 35;
          }
        }
      };

      // update tick position
      // present for the lifetime of the sim
      pendulum.angleProperty.link( function() {
        updateTicksPosition();
        updateDegreesText();
      } );

      // set ticks visibility observer
      // present for the lifetime of the sim
      pendulum.multilink( [ 'isTickVisible', 'isVisible' ], function( ) {
        var isVisible = pendulum.isTickVisibleProperty.value && pendulum.isVisibleProperty.value;
        tickNodeLeft.visible = isVisible;
        tickNodeRight.visible = isVisible;
        updateTicksPosition();
      } );

      // set degrees text visibility observer
      // present for the lifetime of the sim
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
