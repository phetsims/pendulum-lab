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
   * @param {Array.<Pendulum>} pendulums - Array of pendulum models.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function PendulumsNode( pendulums, modelViewTransform, options ) {
    var self = this;

    Node.call( this, options );

    // add pendulums
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      var massToScale = new LinearFunction( pendulum.massRange.min, pendulum.massRange.max, 0.25, 1 );

      // create solid line
      var solidLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaX( pendulum.length ), { stroke: 'black' } );

      // create pendulum
      var pendulumRect = new Node( {
        cursor: 'pointer',
        children: [
          new Rectangle( -RECT_SIZE.width / 2, -RECT_SIZE.height / 2, RECT_SIZE.width, RECT_SIZE.height, {
            fill: new LinearGradient( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0 ).
              addColorStop( 0, pendulum.color ).
              addColorStop( 0.3, pendulum.color ).
              addColorStop( 0.8, 'white' ).
              addColorStop( 1, pendulum.color )
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
        options.isVelocityVisibleProperty.linkAttribute( velocityArrow, 'visible' );

        // updateVelocityVector call necessary to update view when turning on vector while pause
        options.isVelocityVisibleProperty.lazyLink( function( isVelocityVisible ) {
          velocityArrow.visible = isVelocityVisible;
          pendulum.updateVelocityVector();
        } );

        // add arrow size observer
        pendulum.velocityVectorProperty.link( function( velocityVector ) {
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
        // updateAccelerationVector call necessary to update view when turning on vector while pause
        options.isAccelerationVisibleProperty.lazyLink( function( isAccelerationVisible ) {
          accelerationArrow.visible = isAccelerationVisible;
          pendulum.updateAccelerationVector();
        } );

        // add arrow size observer
        pendulum.accelerationVectorProperty.link( function( accelerationVector ) {
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
          clickXOffset = self.globalToParentPoint( e.pointer.point ).x + modelViewTransform.modelToViewDeltaX( pendulum.length ) * Math.sin( pendulumNode.rotation );
          clickYOffset = self.globalToParentPoint( e.pointer.point ).y - modelViewTransform.modelToViewDeltaX( pendulum.length ) * Math.cos( pendulumNode.rotation );

          pendulum.isUserControlled = true;
        },
        drag: function( e ) {
          var x = self.globalToParentPoint( e.pointer.point ).x - clickXOffset;
          var y = self.globalToParentPoint( e.pointer.point ).y - clickYOffset;

          pendulum.angle = -Math.atan2( x, y ) % (Math.PI * 2);
        },
        end: function() {
          pendulum.isUserControlled = false;
        }
      } ) );

      // update pendulum rotation
      pendulum.angleProperty.link( function( angle ) {
        pendulumNode.rotation = angle;
      } );

      // update pendulum components position
      pendulum.lengthProperty.link( function( length ) {
        var lengthMeters = modelViewTransform.modelToViewDeltaX( length );

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
      pendulum.massProperty.link( function( mass ) {
        pendulumRect.setScaleMagnitude( massToScale( mass ) );
      } );

      // update visibility
      pendulum.isVisibleProperty.linkAttribute( pendulumNode, 'visible' );
    } );
  }

  return inherit( Node, PendulumsNode );
} );