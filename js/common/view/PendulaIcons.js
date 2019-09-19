// Copyright 2017, University of Colorado Boulder

/**
 * Icons for one or two pendula.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Node = require( 'SCENERY/nodes/Node' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Util = require( 'DOT/Util' );

  // constants
  var ICON_SIZE = 35;

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
    var rectGradient = new LinearGradient( -rectWidth / 2, 0, rectWidth / 2, 0 )
      .addColorStop( 0, Color.toColor( rectColor ).colorUtilsBrighter( 0.2 ) )
      .addColorStop( 0.2, Color.toColor( rectColor ).colorUtilsBrighter( 0.7 ) )
      .addColorStop( 0.7, rectColor );
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
