// Copyright 2014-2015, University of Colorado Boulder

/**
 * Icon node for one pendulum mode in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  // constants
  var ANGLE = Util.toRadians( 10 ); // angle of pendulum deflection
  var ICON_SIZE = PendulumLabConstants.ICON_PENDULUM_MODE_SIZE;
  var LINE_LENGTH = ICON_SIZE * 0.6;
  var RECT_HEIGHT = ICON_SIZE - LINE_LENGTH;
  var RECT_WIDTH = RECT_HEIGHT * 0.8;
  var RECT_GRADIENT = new LinearGradient( 0, 0, RECT_WIDTH, 0 ).
    addColorStop( 0, PendulumLabConstants.FIRST_PENDULUM_COLOR ).
    addColorStop( 0.8, 'white' ).
    addColorStop( 1, PendulumLabConstants.FIRST_PENDULUM_COLOR );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OnePendulumIconNode( options ) {
    Node.call( this, _.extend( { pickable: false }, options ) );

    this.addChild( new Rectangle( 0, 0, ICON_SIZE, ICON_SIZE ) );

    this.content = new Node();
    this.addChild( this.content );

    var line = new Line( 0, 0, 0, LINE_LENGTH, { stroke: 'black', strokeWidth: 1 } );
    line.rotate( -ANGLE );
    this.content.addChild( line );

    var rect = new Rectangle( -RECT_WIDTH / 2, LINE_LENGTH, RECT_WIDTH, RECT_HEIGHT, { stroke: 'black', strokeWidth: 1, fill: RECT_GRADIENT } );
    rect.rotate( -ANGLE );
    this.content.addChild( rect );

    this.centerAndScale( ICON_SIZE );
  }

  return inherit( Node, OnePendulumIconNode, {
    centerAndScale: function( iconSize ) {
      var content = this.content;

      // centering of icon
      content.centerX = iconSize / 2;
      content.centerY = iconSize / 2;

      // scale icon (after rotation bounds can be exceeded)
      if ( content.width > iconSize ) {
        content.scale( iconSize / content.width );
      }

      if ( content.height > iconSize ) {
        content.scale( iconSize / content.height );
      }
    }
  } );
} );