// Copyright 2014-2015, University of Colorado Boulder

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
    this.preventFit = true;

    var pendulumNodes = [];
    var velocityArrows = [];
    var accelerationArrows = [];

    // add pendulums
    pendulums.forEach( function( pendulum, pendulumIndex ) {
      var massToScale = function( mass ) {
        // height/width/depth of mass scale by cube-root to maintain density
        return 0.3 + 0.4 * Math.sqrt( mass / 1.5 );
      };

      // create solid line
      var solidLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaX( pendulum.length ), { stroke: 'black', pickabe: false } );

      // create pendulum
      var pendulumRect = new Node( {
        children: [
          new Rectangle( -RECT_SIZE.width / 2, -RECT_SIZE.height / 2, RECT_SIZE.width, RECT_SIZE.height, {
            fill: new LinearGradient( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0 ).
              addColorStop( 0.3, pendulum.color ).
              addColorStop( 0.8, 'white' ).
              addColorStop( 1, pendulum.color )
          } ),
          new Text( (pendulumIndex + 1).toString(), {
            font: FONT,
            fill: 'white',
            centerY: RECT_SIZE.height / 4,
            centerX: 0,
            pickable: false
          } ),
          new Line( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0, {
            stroke: 'black',
            lineCap: 'butt',
            pickable: false
          } )
        ]
      } );

      var pendulumNode = new Node( {
        cursor: 'pointer',
        children: [
          solidLine,
          pendulumRect
        ],
        cssTransform: true
      } );

      // add velocity arrows if necessary
      if ( options.isVelocityVisibleProperty ) {
        var velocityArrow = new ArrowNode( 0, 0, 0, 0, {
          pickabe: false,
          fill: PendulumLabConstants.VELOCITY_ARROW_COLOR,
          tailWidth: ARROW_TAIL_WIDTH,
          headWidth: ARROW_HEAD_WIDTH
        } );
        velocityArrows.push( velocityArrow );
        options.isVelocityVisibleProperty.linkAttribute( velocityArrow, 'visible' );

        options.isVelocityVisibleProperty.lazyLink( function( isVelocityVisible ) {
          velocityArrow.visible = isVelocityVisible;
        } );

        // add arrow size observer
        pendulum.velocityProperty.link( function( velocity ) {
          if ( velocityArrow.visible ) {
            var position = modelViewTransform.modelToViewPosition( pendulum.position );
            velocityArrow.setTailAndTip( position.x,
                                         position.y,
                                         position.x + ARROW_SIZE_DEFAULT * velocity.x,
                                         position.y - ARROW_SIZE_DEFAULT * velocity.y );
          }
        } );
      }

      // add acceleration arrows if necessary
      if ( options.isAccelerationVisibleProperty ) {
        // create acceleration arrow
        var accelerationArrow = new ArrowNode( 0, 0, 0, 0, {
          pickabe: false,
          fill: PendulumLabConstants.ACCELERATION_ARROW_COLOR,
          tailWidth: ARROW_TAIL_WIDTH,
          headWidth: ARROW_HEAD_WIDTH
        } );
        accelerationArrows.push( accelerationArrow );
        options.isAccelerationVisibleProperty.linkAttribute( accelerationArrow, 'visible' );

        // add visibility observer
        options.isAccelerationVisibleProperty.lazyLink( function( isAccelerationVisible ) {
          accelerationArrow.visible = isAccelerationVisible;
        } );

        // add arrow size observer
        pendulum.accelerationProperty.link( function( acceleration ) {
          if ( accelerationArrow.visible ) {
            var position = modelViewTransform.modelToViewPosition( pendulum.position );
            accelerationArrow.setTailAndTip( position.x,
                                             position.y,
                                             position.x + ARROW_SIZE_DEFAULT * acceleration.x,
                                             position.y - ARROW_SIZE_DEFAULT * acceleration.y );
          }
        } );
      }

      pendulumNodes.push( pendulumNode );

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

          pendulum.angle = Math.atan2( x, y ) % (Math.PI * 2);
        },
        end: function() {
          pendulum.isUserControlled = false;
        }
      } ) );

      // update pendulum rotation
      pendulum.angleProperty.link( function( angle ) {
        pendulumNode.rotation = -angle;
      } );

      // update pendulum components position
      pendulum.lengthProperty.link( function( length ) {
        var lengthMeters = modelViewTransform.modelToViewDeltaX( length );

        pendulumRect.setY( lengthMeters );
        solidLine.setY2( lengthMeters );
      } );

      // update rectangle size
      pendulum.massProperty.link( function( mass ) {
        pendulumRect.setScaleMagnitude( massToScale( mass ) );
      } );

      // update visibility
      pendulum.isVisibleProperty.linkAttribute( pendulumNode, 'visible' );
    } );

    this.children = pendulumNodes.concat( velocityArrows ).concat( accelerationArrows );
  }

  return inherit( Node, PendulumsNode );
} );