// Copyright 2002-2014, University of Colorado Boulder

/**
 * Icon node for two pendulum mode in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var OnePendulumIconNode = require( 'PENDULUM_LAB/common/view/OnePendulumIconNode' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  // constants
  var ANGLE = Util.toRadians( 20 ); // angle of pendulum deflection
  var ICON_SIZE = PendulumLabConstants.ICON_PENDULUM_MODE_SIZE;
  var LINE_LENGTH = ICON_SIZE * 0.5;
  var RECT_HEIGHT = ICON_SIZE * 0.25;
  var RECT_WIDTH = RECT_HEIGHT * 0.8;
  var RECT_GRADIENT = new LinearGradient( 0, 0, RECT_WIDTH, 0 ).
    addColorStop( 0, PendulumLabConstants.SECOND_PENDULUM_COLOR ).
    addColorStop( 0.8, 'white' ).
    addColorStop( 1, PendulumLabConstants.SECOND_PENDULUM_COLOR );

  /**
   * {Object} options
   * @constructor
   */
  function TwoPendulumIconNode( options ) {
    OnePendulumIconNode.call( this, options );

    var line = new Line( 0, 0, 0, LINE_LENGTH, {stroke: 'black', strokeWidth: 1 } );
    line.rotate( ANGLE );
    this.content.addChild( line );

    var rect = new Rectangle( -RECT_WIDTH / 2, LINE_LENGTH, RECT_WIDTH, RECT_HEIGHT, {stroke: 'black', strokeWidth: 1, fill: RECT_GRADIENT} );
    rect.rotate( ANGLE );
    this.content.addChild( rect );

    this.centeringAndScaling( ICON_SIZE );
  }

  return inherit( OnePendulumIconNode, TwoPendulumIconNode );
} );