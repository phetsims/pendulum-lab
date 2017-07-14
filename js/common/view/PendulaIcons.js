// Copyright 2014-2015, University of Colorado Boulder

/**
 * Icons for one or two pendula.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  // constants
  var ICON_SIZE = PendulumLabConstants.ICON_PENDULUM_MODE_SIZE;

  /**
   * Creates a small node showing a single pendulum.
   * @private
   *
   * @param {number} lineLength
   * @param {number} angle
   * @param {number} rectHeight
   * @param {string} rectColor
   * @returns {Node}
   */
  function createMiniPendulum( lineLength, angle, rectHeight, rectColor ) {
    var rectWidth = rectHeight * 0.8;
    var rectGradient = new LinearGradient( 0, 0, rectWidth, 0 ).addColorStop( 0, rectColor )
                                                               .addColorStop( 0.8, 'white' )
                                                               .addColorStop( 1, rectColor );
    return new Node( {
      children: [
        // string
        new Line( 0, 0, 0, lineLength, {
          stroke: 'black',
          rotation: angle
        } ),
        // mass
        new Rectangle( -rectWidth / 2, lineLength, rectWidth, rectHeight, {
          stroke: 'black',
          fill: rectGradient,
          rotation: angle
        } )
      ]
    } );
  }

  var firstPendulumNode = createMiniPendulum( ICON_SIZE * 0.6, Util.toRadians( -10 ), ICON_SIZE * 0.4, PendulumLabConstants.FIRST_PENDULUM_COLOR );
  var secondPendulumNode = createMiniPendulum( ICON_SIZE * 0.5, Util.toRadians( 20 ), ICON_SIZE * 0.25, PendulumLabConstants.SECOND_PENDULUM_COLOR );
  var iconBounds = new Bounds2( 0, 0, ICON_SIZE, ICON_SIZE );

  var PendulaIcons = {
    // @public {Node} - Icon with just one pendulum
    ONE_PENDULUM_ICON: new AlignBox( new Node( {
      children: [ firstPendulumNode ]
    } ), {
      alignBounds: iconBounds,
      pickable: false
    } ),
    // @public {Node} - Icon with both pendula
    TWO_PENDULA_ICON: new AlignBox( new Node( {
      children: [ firstPendulumNode, secondPendulumNode ]
    } ), {
      alignBounds: iconBounds,
      pickable: false
    } )
  };

  pendulumLab.register( 'PendulaIcons', PendulaIcons );

  return PendulaIcons;
} );
