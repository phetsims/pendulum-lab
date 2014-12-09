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

    // arrows
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',

    // panels
    PANEL_BACKGROUND_COLOR: 'rgb( 216, 251, 196 )',
    PANEL_CORNER_RADIUS: 5,

    // sliders
    TRACK_SIZE: new Dimension2( 95, 0.5 ),
    THUMB_SIZE: new Dimension2( 10, 19 ),

    // common
    BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
    SCREEN_PADDING: {
      TOP: 20,
      RIGHT: 20,
      BOTTOM: 20,
      LEFT: 20
    }
  };
} );