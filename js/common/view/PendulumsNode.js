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
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Pendulum = require( 'PENDULUM_LAB/common/model/Pendulum' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

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

    this.viewOriginPosition = modelViewTransform.modelToViewPosition( Vector2.ZERO );
    this.negativeViewOriginPosition = modelViewTransform.modelToViewPosition( Vector2.ZERO ).times( -1 );
    this.draggableItems = [];

    var pendulumNodes = [];
    var velocityArrows = [];
    var accelerationArrows = [];

    // TODO: there should exist a PendulumNode Type (singular) so that there is a one
    // to one correspondence between pendulum and pendulumNode, nothing here depends on pendulums.
    // pendulumNode should be responsible for the color of the pendulum and other view properties
    // the array pendulums (and the for loop forEach), should be created in the pendulumLabModel

    pendulums.forEach( function( pendulum, pendulumIndex ) {
        var massToScale = function( mass ) {
          // height/width/depth of mass scale by cube-root to maintain density
          return 0.3 + 0.4 * Math.sqrt( mass / 1.5 );
        };

        // create the visual representation of a rod that joins the fulcrum point to the bob
        // initially set to be vertical
        var solidLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaY( pendulum.lengthProperty.value ), {
          stroke: 'black',
          pickable: false
        } );

        // create the visual representation of a pendulum bob (a rectangle with a string and a line across the rectangle)
        var pendulumRect = new Node( {
          children: [
            new Rectangle( -RECT_SIZE.width / 2, -RECT_SIZE.height / 2, RECT_SIZE.width, RECT_SIZE.height, {
              fill: new LinearGradient( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0 ).addColorStop( 0.3, pendulum.color ).addColorStop( 0.8, 'white' ).addColorStop( 1, pendulum.color )
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

        // create the visual representation of a pendulum (bob + rod)
        var pendulumNode = new Node( {
          cursor: 'pointer',
          children: [
            solidLine,
            pendulumRect
          ]
        } );

        // add velocity arrows if necessary
        if ( options.isVelocityVisibleProperty ) {
          var velocityArrow = new ArrowNode( 0, 0, 0, 0, {
            pickable: false,
            fill: PendulumLabConstants.VELOCITY_ARROW_COLOR,
            tailWidth: ARROW_TAIL_WIDTH,
            headWidth: ARROW_HEAD_WIDTH
          } );
          velocityArrows.push( velocityArrow );

          // no need to unlink, present for the lifetime of the sim
          Property.multilink( [ pendulum.isVisibleProperty, options.isVelocityVisibleProperty, pendulum.velocityProperty ], function( pendulumVisible, velocityVisible, velocity ) {
            velocityArrow.visible = pendulumVisible && velocityVisible;
            // update the size of the arrow
            if ( velocityArrow.visible ) {
              var position = modelViewTransform.modelToViewPosition( pendulum.positionProperty.value );
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
            pickable: false,
            fill: PendulumLabConstants.ACCELERATION_ARROW_COLOR,
            tailWidth: ARROW_TAIL_WIDTH,
            headWidth: ARROW_HEAD_WIDTH
          } );
          accelerationArrows.push( accelerationArrow );

          // no need to unlink, present for the lifetime of the sim
          Property.multilink( [ pendulum.isVisibleProperty, options.isAccelerationVisibleProperty, pendulum.accelerationProperty ], function( pendulumVisible, accelerationVisible, acceleration ) {
            accelerationArrow.visible = pendulumVisible && accelerationVisible;
            if ( accelerationArrow.visible ) {
              var position = modelViewTransform.modelToViewPosition( pendulum.positionProperty.value );
              accelerationArrow.setTailAndTip( position.x,
                position.y,
                position.x + ARROW_SIZE_DEFAULT * acceleration.x,
                position.y - ARROW_SIZE_DEFAULT * acceleration.y );
            }
          } );
        }

        pendulumNodes.push( pendulumNode );

        // add drag events
        var angleOffset;
        var dragListener = new SimpleDragHandler( {

          // determine the position of where the pendulum is dragged.
          start: function( event ) {
            var dragAngle = modelViewTransform.viewToModelPosition( self.globalToLocalPoint( event.pointer.point ) ).angle() + Math.PI / 2;
            angleOffset = pendulum.angleProperty.value - dragAngle;

            pendulum.isUserControlledProperty.value = true;
          },

          // set the angle of the pendulum depending on where it is dragged to.
          drag: function( event ) {
            var dragAngle = modelViewTransform.viewToModelPosition( self.globalToLocalPoint( event.pointer.point ) ).angle() + Math.PI / 2;

            pendulum.angleProperty.value = Pendulum.modAngle( angleOffset + dragAngle );
          },

          // release user control
          end: function() {
            pendulum.isUserControlledProperty.value = false;
          }
        } );

        // add a drag listener
        pendulumRect.addInputListener( dragListener );
        self.draggableItems.push( {
          startDrag: dragListener.startDrag.bind( dragListener ),
          computeDistance: function( globalPoint ) {
            if ( pendulum.isUserControlledProperty.value || !pendulum.isVisibleProperty.value ) {
              return Number.POSITIVE_INFINITY;
            }
            else {
              var cursorModelPosition = modelViewTransform.viewToModelPosition( self.globalToLocalPoint( globalPoint ) );
              cursorModelPosition.rotate( -pendulum.angleProperty.value ).add( new Vector2( 0, pendulum.lengthProperty.value ) ); // rotate/length so (0,0) would be mass center
              var massViewWidth = modelViewTransform.viewToModelDeltaX( RECT_SIZE.width * massToScale( pendulum.massProperty.value ) );
              var massViewHeight = modelViewTransform.viewToModelDeltaX( RECT_SIZE.height * massToScale( pendulum.massProperty.value ) );
              var massBounds = new Bounds2( -massViewWidth / 2, -massViewHeight / 2, massViewWidth / 2, massViewHeight / 2 );
              return Math.sqrt( massBounds.minimumDistanceToPointSquared( cursorModelPosition ) );
            }
          }
        } );

        // update pendulum rotation, pendulum.angleProperty.value is radians
        // we are using an inverted modelViewTransform, hence we multiply the view angle by minus one
        pendulum.angleProperty.link( function( angle ) {
          // TODO using a matrix transformation instead?
          pendulumNode.translation = self.negativeViewOriginPosition;
          pendulumNode.rotation = -angle;
          pendulumNode.translation = self.viewOriginPosition;
        } );

        // update pendulum components position
        pendulum.lengthProperty.link( function( length ) {
          var viewPendulumLength = modelViewTransform.modelToViewDeltaX( length );

          pendulumRect.setY( viewPendulumLength );
          solidLine.setY2( viewPendulumLength );
        } );

        // update rectangle size
        pendulum.massProperty.link( function( mass ) {
          pendulumRect.setScaleMagnitude( massToScale( mass ) );
        } );

        // update visibility
        pendulum.isVisibleProperty.linkAttribute( pendulumNode, 'visible' );
      }
    );

    this.children = pendulumNodes.concat( velocityArrows ).concat( accelerationArrows );
  }

  pendulumLab.register( 'PendulumsNode', PendulumsNode );

  return inherit( Node, PendulumsNode );
} );
