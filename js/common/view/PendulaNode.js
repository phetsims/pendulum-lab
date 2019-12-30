// Copyright 2014-2019, University of Colorado Boulder

/**
 * Pendulum node in 'Pendulum Lab' simulation.
 * Contains pendula and threads. Pendula always above threads.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Pendulum = require( 'PENDULUM_LAB/common/model/Pendulum' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const ARROW_HEAD_WIDTH = 12;
  const ARROW_TAIL_WIDTH = 6;
  const ARROW_SIZE_DEFAULT = 25;
  const RECT_SIZE = new Dimension2( 73, 98 );

  /**
   * @constructor
   *
   * @param {Array.<Pendulum>} pendula - Array of pendulum models.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  function PendulaNode( pendula, modelViewTransform, options ) {
    const self = this;

    options = merge( {
      preventFit: true
    }, options );

    Node.call( this, options );

    const viewOriginPosition = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // @public {startDrag: {function}, computeDistance: {function}} - To identify how close a draggable object is.
    this.draggableItems = [];

    const pendulumNodes = [];
    const velocityArrows = [];
    const accelerationArrows = [];

    pendula.forEach( function( pendulum, pendulumIndex ) {
      const massToScale = function( mass ) {
        // height/width/depth of mass scale by cube-root to maintain density
        return 0.3 + 0.4 * Math.sqrt( mass / 1.5 );
      };

      // create the visual representation of a rod that joins the fulcrum point to the bob
      // initially set to be vertical
      const solidLine = new Line( 0, 0, 0, modelViewTransform.modelToViewDeltaY( pendulum.lengthProperty.value ), {
        stroke: 'black',
        pickable: false
      } );

      // create the visual representation of a pendulum bob (a rectangle with a string and a line across the rectangle)
      const pendulumRect = new Node( {
        children: [
          new Rectangle( -RECT_SIZE.width / 2, -RECT_SIZE.height / 2, RECT_SIZE.width, RECT_SIZE.height, {
            fill: new LinearGradient( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0 ).addColorStop( 0, Color.toColor( pendulum.color ).colorUtilsBrighter( 0.4 ) )
                                                                                       .addColorStop( 0.2, Color.toColor( pendulum.color ).colorUtilsBrighter( 0.9 ) )
                                                                                       .addColorStop( 0.7, pendulum.color )
          } ),
          new Text( ( pendulumIndex + 1 ).toString(), {
            font: PendulumLabConstants.PENDULUM_LABEL_FONT,
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
      const pendulumNode = new Node( {
        cursor: 'pointer',
        children: [
          solidLine,
          pendulumRect
        ]
      } );

      // add velocity arrows if necessary
      if ( options.isVelocityVisibleProperty ) {
        const velocityArrow = new ArrowNode( 0, 0, 0, 0, {
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
            const position = modelViewTransform.modelToViewPosition( pendulum.positionProperty.value );
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
        const accelerationArrow = new ArrowNode( 0, 0, 0, 0, {
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
            const position = modelViewTransform.modelToViewPosition( pendulum.positionProperty.value );
            accelerationArrow.setTailAndTip( position.x,
              position.y,
              position.x + ARROW_SIZE_DEFAULT * acceleration.x,
              position.y - ARROW_SIZE_DEFAULT * acceleration.y );
          }
        } );
      }

      pendulumNodes.push( pendulumNode );

      // add drag events
      let angleOffset;
      const dragListener = new SimpleDragHandler( {
        allowTouchSnag: true,

        // determine the position of where the pendulum is dragged.
        start: function( event ) {
          const dragAngle = modelViewTransform.viewToModelPosition( self.globalToLocalPoint( event.pointer.point ) ).angle + Math.PI / 2;
          angleOffset = pendulum.angleProperty.value - dragAngle;

          pendulum.isUserControlledProperty.value = true;
        },

        // set the angle of the pendulum depending on where it is dragged to.
        drag: function( event ) {
          const dragAngle = modelViewTransform.viewToModelPosition( self.globalToLocalPoint( event.pointer.point ) ).angle + Math.PI / 2;
          const continuousAngle = Pendulum.modAngle( angleOffset + dragAngle );

          // Round angles to nearest degree, see https://github.com/phetsims/pendulum-lab/issues/195
          let roundedAngleDegrees = Utils.roundSymmetric( Utils.toDegrees( continuousAngle ) );

          // Don't allow snapping to 180, see https://github.com/phetsims/pendulum-lab/issues/195
          if ( Math.abs( roundedAngleDegrees ) === 180 ) {
            roundedAngleDegrees = Utils.sign( roundedAngleDegrees ) * 179;
          }

          const roundedAngle = Utils.toRadians( roundedAngleDegrees );
          pendulum.angleProperty.value = roundedAngle;
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
            const cursorModelPosition = modelViewTransform.viewToModelPosition( self.globalToLocalPoint( globalPoint ) );
            cursorModelPosition.rotate( -pendulum.angleProperty.value ).add( new Vector2( 0, pendulum.lengthProperty.value ) ); // rotate/length so (0,0) would be mass center
            const massViewWidth = modelViewTransform.viewToModelDeltaX( RECT_SIZE.width * massToScale( pendulum.massProperty.value ) );
            const massViewHeight = modelViewTransform.viewToModelDeltaX( RECT_SIZE.height * massToScale( pendulum.massProperty.value ) );
            const massBounds = new Bounds2( -massViewWidth / 2, -massViewHeight / 2, massViewWidth / 2, massViewHeight / 2 );
            return Math.sqrt( massBounds.minimumDistanceToPointSquared( cursorModelPosition ) );
          }
        }
      } );

      // update pendulum rotation, pendulum.angleProperty.value is radians
      // we are using an inverted modelViewTransform, hence we multiply the view angle by minus one
      pendulum.angleProperty.link( function( angle ) {
        pendulumNode.rotation = -angle;
        pendulumNode.translation = viewOriginPosition;
      } );

      // update pendulum components position
      pendulum.lengthProperty.link( function( length ) {
        const viewPendulumLength = modelViewTransform.modelToViewDeltaX( length );

        pendulumRect.setY( viewPendulumLength );
        solidLine.setY2( viewPendulumLength );
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

  pendulumLab.register( 'PendulaNode', PendulaNode );

  return inherit( Node, PendulaNode );
} );
