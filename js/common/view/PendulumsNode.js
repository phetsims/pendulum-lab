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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var FONT = new PhetFont( 25 );
  var RECT_SIZE = new Dimension2( 60, 80 );

  /**
   * @param {Array} pendulumsModel - Array of pendulum models.
   * @param {Function} metersToPixels - Function to convert meters to pixels.
   * @param {Object} options
   * @constructor
   */
  function PendulumsNode( pendulumsModel, metersToPixels, options ) {
    var self = this,
      samplePendulum = pendulumsModel[0];

    Node.call( this, options );

    if ( samplePendulum ) {
      // create central dash line
      this.addChild( new Line( 0, 0, 0, metersToPixels( samplePendulum.lengthOptions.range.max ), {
        stroke: samplePendulum.color,
        lineDash: [4, 7]
      } ) );

      // create central circles
      this.addChild( new Circle( 2, {fill: 'black'} ) );
      this.addChild( new Circle( 8, {stroke: samplePendulum.color} ) );
    }

    // add pendulums
    pendulumsModel.forEach( function( pendulumModel, pendulumIndex ) {
      var massToScale = new LinearFunction( pendulumModel.massOptions.range.min, pendulumModel.massOptions.range.max, 0.25, 1 );

      // create solid line
      var solidLine = new Line( 0, 0, 0, metersToPixels( pendulumModel.length ), {stroke: 'black'} );

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
          new Text( (pendulumIndex + 1).toString(), {font: FONT, fill: 'white', centerY: RECT_SIZE.height / 4, centerX: 0} ),
          new Line( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0, {stroke: 'black'} )
        ]
      } );

      // join line and rect into one node
      var pendulumNode = new Node( {children: [solidLine, pendulumRect]} );
      self.addChild( pendulumNode );

      // add drag events
      var clickYOffset, clickXOffset;
      pendulumRect.addInputListener( new SimpleDragHandler( {
        start: function( e ) {
          clickXOffset = self.globalToParentPoint( e.pointer.point ).x + metersToPixels( pendulumModel.length ) * Math.sin( pendulumNode.rotation );
          clickYOffset = self.globalToParentPoint( e.pointer.point ).y - metersToPixels( pendulumModel.length ) * Math.cos( pendulumNode.rotation );

          pendulumModel.isUserControlled = true;
        },
        drag: function( e ) {
          var y = self.globalToParentPoint( e.pointer.point ).y - clickYOffset,
            x = self.globalToParentPoint( e.pointer.point ).x - clickXOffset;

          pendulumModel.angle = -Math.atan2( x, y );
        },
        end: function() {
          pendulumModel.isUserControlled = false;
        }
      } ) );

      // update pendulum rotation
      pendulumModel.property( 'angle' ).link( function( angle ) {
        pendulumNode.rotation = angle;
      } );

      // update pendulum position
      pendulumModel.property( 'length' ).link( function( length ) {
        pendulumRect.setY( metersToPixels( length ) );
        solidLine.setY2( metersToPixels( length ) );
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