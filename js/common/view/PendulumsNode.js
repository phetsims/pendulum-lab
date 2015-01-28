// Copyright 2002-2014, University of Colorado Boulder

/**
 * Pendulum node in 'Pendulum Lab' simulation.
 * Contains pendulums and threads. Pendulums always above threads.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var ARROW_SIZE_DEFAULT = 25;
  var FONT = new PhetFont( { size: 32, weight: 'bold' } );
  var RECT_SIZE = new Dimension2( 60, 80 );

  /**
   * @param {Array} pendulumModels - Array of pendulum models.
   * @param {Function} metersToPixels - Function to convert meters to pixels.
   * @param {Object} options
   * @constructor
   */
  function PendulumsNode( pendulumModels, metersToPixels, options ) {
    var self = this;

    Node.call( this, options );

    // add pendulums
    pendulumModels.forEach( function( pendulumModel, pendulumIndex ) {
      var massToScale = new LinearFunction( pendulumModel.massRange.min, pendulumModel.massRange.max, 0.25, 1 );

      // create solid line
      var solidLine = new Line( 0, 0, 0, metersToPixels( pendulumModel.length ), { stroke: 'black' } );

      // create pendulum
      var pendulumRect = new Node( {
        cursor: 'pointer',
        children: [
          new Rectangle( -RECT_SIZE.width / 2, -RECT_SIZE.height / 2, RECT_SIZE.width, RECT_SIZE.height, {
            fill: new LinearGradient( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0 ).
              addColorStop( 0, pendulumModel.color ).
              addColorStop( 0.3, pendulumModel.color ).
              addColorStop( 0.8, 'white' ).
              addColorStop( 1, pendulumModel.color )
          } ),
          new Text( (pendulumIndex + 1).toString(), { font: FONT, fill: 'white', centerY: RECT_SIZE.height / 4, centerX: 0 } ),
          new Line( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0, { stroke: 'black', lineCap: 'butt' } )
        ]
      } );

      var pendulumNode = new Node( { children: [ solidLine, pendulumRect ] } );

      // add velocity arrows if necessary
      if ( options.isVelocityVisibleProperty ) {
        var velocityArrow = new ArrowNode( 0, 0, 0, 0, {
          fill: PendulumLabConstants.VELOCITY_ARROW_COLOR,
          tailWidth: ARROW_TAIL_WIDTH,
          headWidth: ARROW_HEAD_WIDTH
        } );
        pendulumNode.addChild( velocityArrow );

        // add visibility observer
        options.isVelocityVisibleProperty.link( function( isVelocityVisible ) {
          velocityArrow.visible = isVelocityVisible;
        } );

        // add arrow size observer
        pendulumModel.property( 'velocityVector' ).link( function( velocityVector ) {
          if ( velocityArrow.visible ) {
            velocityArrow.setTailAndTip( 0, 0, ARROW_SIZE_DEFAULT * velocityVector.x, ARROW_SIZE_DEFAULT * velocityVector.y );
          }
        } );
      }

      // add acceleration arrows if necessary
      if ( options.isAccelerationVisibleProperty ) {
        // create acceleration arrow
        var accelerationArrow = new ArrowNode( 0, 0, 0, 0, {
          fill: PendulumLabConstants.ACCELERATION_ARROW_COLOR,
          tailWidth: ARROW_TAIL_WIDTH,
          headWidth: ARROW_HEAD_WIDTH
        } );
        pendulumNode.addChild( accelerationArrow );
        options.isAccelerationVisibleProperty.linkAttribute( accelerationArrow, 'visible' );

        // add visibility observer
        options.isAccelerationVisibleProperty.link( function( isAccelerationVisible ) {
          accelerationArrow.visible = isAccelerationVisible;
          pendulumModel.updateAccelerationVector();
        } );

        // add arrow size observer
        pendulumModel.property( 'accelerationVector' ).link( function( accelerationVector ) {
          if ( accelerationArrow.visible ) {
            accelerationArrow.setTailAndTip( 0, 0, ARROW_SIZE_DEFAULT * accelerationVector.x, ARROW_SIZE_DEFAULT * accelerationVector.y );
          }
        } );
      }

      // join components into one node
      self.addChild( pendulumNode );

      // add drag events
      var clickYOffset;
      var clickXOffset;
      pendulumRect.addInputListener( new SimpleDragHandler( {
        start: function( e ) {
          clickXOffset = self.globalToParentPoint( e.pointer.point ).x + metersToPixels( pendulumModel.length ) * Math.sin( pendulumNode.rotation );
          clickYOffset = self.globalToParentPoint( e.pointer.point ).y - metersToPixels( pendulumModel.length ) * Math.cos( pendulumNode.rotation );

          pendulumModel.isUserControlled = true;
        },
        drag: function( e ) {
          var x = self.globalToParentPoint( e.pointer.point ).x - clickXOffset;
          var y = self.globalToParentPoint( e.pointer.point ).y - clickYOffset;

          pendulumModel.angle = -Math.atan2( x, y ) % (Math.PI * 2);
        },
        end: function() {
          pendulumModel.isUserControlled = false;
        }
      } ) );

      // update pendulum rotation
      pendulumModel.property( 'angle' ).link( function( angle ) {
        pendulumNode.rotation = angle;
      } );

      // update pendulum components position
      pendulumModel.property( 'length' ).link( function( length ) {
        var lengthMeters = metersToPixels( length );

        pendulumRect.setY( lengthMeters );
        solidLine.setY2( lengthMeters );

        if ( velocityArrow ) {
          velocityArrow.setY( lengthMeters );
        }

        if ( accelerationArrow ) {
          accelerationArrow.setY( lengthMeters );
        }
      } );

      // update rectangle size
      pendulumModel.property( 'mass' ).link( function( mass ) {
        pendulumRect.setScaleMagnitude( massToScale( mass ) );
      } );

      // update visibility
      pendulumModel.property( 'isVisible' ).linkAttribute( pendulumNode, 'visible' );
    } );
  }

  return inherit( Node, PendulumsNode );
} );