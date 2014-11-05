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
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var FONT = new PhetFont( 25 );
  var RECT_SIZE = new Dimension2( 60, 80 );

  /**
   * @param {Array} pendulumsModel - Array of pendulum models.
   * @param {Object} options
   * @constructor
   */
  function PendulumsNode( pendulumsModel, options ) {
    var self = this;
    Node.call( this, options );

    self.lengthToPixels = [];
    pendulumsModel.forEach( function( pendulumModel, pendulumIndex ) {
      // create function to convert length of thread into pixels
      self.lengthToPixels[pendulumIndex] = new LinearFunction( pendulumModel.lengthOptions.range.min, pendulumModel.lengthOptions.range.max, 50, 340 );
    } );

    // add lines
    pendulumsModel.forEach( function( pendulumModel, pendulumIndex ) {
      var lengthToPixels = self.lengthToPixels[pendulumIndex];

      // create solid line
      var solidLine = new Line( 0, 0, 0, lengthToPixels( pendulumModel.length ), {stroke: 'black'} );
      self.addChild( solidLine );

      // create dash line
      var dashLine = new Line( 0, lengthToPixels( pendulumModel.lengthOptions.range.max ), 0, lengthToPixels( pendulumModel.length ), {
        stroke: pendulumModel.color,
        lineDash: [5, 5]
      } );
      self.addChild( dashLine );

      // redraw lines and move pendulum if length property changed
      pendulumModel.property( 'length' ).link( function( length ) {
        solidLine.setY2( lengthToPixels( length ) );
        dashLine.setY2( lengthToPixels( length ) );
      } );
    } );

    // add pendulums
    pendulumsModel.forEach( function( pendulumModel, pendulumIndex ) {
      var lengthToPixels = self.lengthToPixels[pendulumIndex];
      var massToScale = new LinearFunction( pendulumModel.massOptions.range.min, pendulumModel.massOptions.range.max, 0.25, 1 );

      var rectGradient = new LinearGradient( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0 ).
        addColorStop( 0, pendulumModel.color ).
        addColorStop( 0.3, pendulumModel.color ).
        addColorStop( 0.8, 'white' ).
        addColorStop( 1, pendulumModel.color );

      // create pendulum
      var pendulumRect = new Node( {
        children: [
          new Rectangle( -RECT_SIZE.width / 2, -RECT_SIZE.height / 2, RECT_SIZE.width, RECT_SIZE.height, {fill: rectGradient} ),
          new Text( (pendulumIndex + 1).toString(), {font: FONT, fill: 'white', centerY: RECT_SIZE.height / 4, centerX: 0} ),
          new Line( -RECT_SIZE.width / 2, 0, RECT_SIZE.width / 2, 0, {stroke: 'black'} )
        ]
      } );
      self.addChild( pendulumRect );

      // update pendulum position if length property was changed
      pendulumModel.property( 'length' ).link( function( length ) {
        pendulumRect.setY( lengthToPixels( length ) );
      } );

      // update rectangle size if mass property was changed
      pendulumModel.property( 'mass' ).link( function( mass ) {
        pendulumRect.setScaleMagnitude( massToScale( mass ) );
      } );
    } );
  }

  return inherit( Node, PendulumsNode );
} );