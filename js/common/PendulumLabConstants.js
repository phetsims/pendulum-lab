// Copyright 2014-2015, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );

  var PendulumLabConstants = {
    // pendulums
    FIRST_PENDULUM_COLOR: 'rgb( 0, 0, 255 )',
    ICON_PENDULUM_MODE_SIZE: 29,
    SECOND_PENDULUM_COLOR: 'rgb( 255, 0, 0 )',

    // arrows
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',

    // panels
    LEFT_PANELS_MIN_WIDTH: 122,
    PANEL_BACKGROUND_COLOR: 'rgb( 216, 251, 196 )',
    PANEL_CORNER_RADIUS: 5,
    PANEL_MARGIN: 10,

    // sliders
    TRACK_SIZE: new Dimension2( 95, 0.5 ),
    THUMB_SIZE: new Dimension2( 10, 17 ),
    SLIDER_PRECISION: 1,
    TWEAKERS_PRECISION: 2,

    // common
    MODEL_BOUNDS: new Bounds2( 0, -1.34, 1.34 * (768 / 504), 0 ), // Maintains aspect ratio UI   Bounds2( minX, minY, maxX, maxY )
    SIM_BOUNDS: new Bounds2( 0, 0, 768, 504 ),          // Determines bounds for sim   Bounds2( minX, minY, maxX, maxY ) 
    BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
    SCREEN_PADDING: {
      TOP: 15,
      RIGHT: 15,
      BOTTOM: 15,
      LEFT: 15
    }
  };

  pendulumLab.register( 'PendulumLabConstants', PendulumLabConstants );

  return PendulumLabConstants;
} );