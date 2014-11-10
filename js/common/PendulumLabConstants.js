// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );

  return {
    // pendulums
    FIRST_PENDULUM_COLOR: 'rgb( 0, 0, 255 )',
    ICON_PENDULUM_MODE_SIZE: 29,
    SECOND_PENDULUM_COLOR: 'rgb( 255, 0, 0 )',

    // panels
    PANEL_BACKGROUND_COLOR: 'rgb( 216, 251, 196 )',
    PANEL_CORNER_RADIUS: 5,

    // sliders
    TRACK_SIZE: new Dimension2( 95, 0 ),
    THUMB_SIZE: new Dimension2( 10, 19 ),

    // common
    BACKGROUND_COLOR: 'rgb( 254, 254, 182 )',
    SCREEN_PADDING: {
      TOP: 23,
      RIGHT: 23,
      BOTTOM: 23,
      LEFT: 23
    }
  };
} );