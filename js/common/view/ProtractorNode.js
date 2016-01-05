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
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

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
    for ( var currentAngleDeg = 0; currentAngleDeg <= 180; currentAngleDeg += 1 ) {
      currentAngleRad = currentAngleDeg * Math.PI / 180;

      if ( currentAngleDeg % 10 === 0 ) {
        lineLength = TICK_10_LENGTH;
      }
      else if ( currentAngleDeg % 5 === 0 ) {
        lineLength = TICK_5_LENGTH;
      }
      else {
        lineLength = LINE_LENGTH_DEFAULT;
      }

      x1 = RADIUS * Math.cos( currentAngleRad );
      y1 = RADIUS * Math.sin( currentAngleRad );

      x2 = (RADIUS + lineLength) * Math.cos( currentAngleRad );
      y2 = (RADIUS + lineLength) * Math.sin( currentAngleRad );

      protractorShape.moveTo( x1, y1 );
      protractorShape.lineTo( x2, y2 );
    }

    // add protractor path
    this.addChild( new Path( protractorShape, { stroke: 'black' } ) );
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

      var updateTicksPosition = function() {
        if ( pendulum.isUserControlled ) {
          tickNodeLeft.setRotation( Math.PI / 2 - pendulum.angle );
          tickNodeRight.setRotation( Math.PI / 2 + pendulum.angle );
        }
      };

      // add number of degrees text
      var degreesText = new Text( '0', {
        centerY: 15,
        font: FONT,
        fill: pendulum.color
      } );
      degreesLayer.addChild( degreesText );

      var updateDegreesText = function() {
        if ( pendulum.isUserControlled ) {
          var angle = ( pendulum.angle * 180 / Math.PI ) % 360;

          // angle belongs to an interval from -90 to 270 degrees
          if ( angle < -90 ) {
            angle += 360;
          }
          else if ( angle > 270 ) {
            angle -= 360;
          }

          degreesText.text = StringUtils.format( pattern0NumberOfDegreesDegreeSymbolString, Util.toFixed( angle, 0 ) );
          if ( pendulumIndex === 0 ) {
            degreesText.right = -10;
          }
          else {
            degreesText.left = 10;
          }
        }
      };

      // update tick position
      pendulum.angleProperty.link( function() {
        updateTicksPosition();
        updateDegreesText();
      } );

      // set ticks visibility observer
      pendulum.multilink( [ 'isTickVisible', 'isVisible' ], function() {
        var isVisible = pendulum.isTickVisible && pendulum.isVisible;
        tickNodeLeft.visible = isVisible;
        tickNodeRight.visible = isVisible;
        updateTicksPosition();
      } );

      // set degrees text visibility observer
      pendulum.isUserControlledProperty.link( function( isUserControlled ) {
        degreesText.visible = isUserControlled;
        updateDegreesText();
        updateTicksPosition();
      } );
    } );
  }

  return inherit( Node, ProtractorNode );
} );