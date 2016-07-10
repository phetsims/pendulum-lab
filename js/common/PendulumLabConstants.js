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
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );

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
      SIM_BOUNDS: new Bounds2( 0, 0, 768, 504 ),          // Determines bounds for sim   Bounds2( minX, minY, maxX, maxY )
      BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
      SCREEN_PADDING: {
        TOP: 14,
        RIGHT: 14,
        BOTTOM: 14,
        LEFT: 14
      },
      // create a model view transform (assuming the dev view screen is 768 wide and the 504 high)
      // the height of the screen is 4/3 m = 1.33 m
      MODEL_VIEW_TRANSFORM: ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 768 / 2, 15 ), 504 / 1.33 )

    }
    ;

  pendulumLab.register( 'PendulumLabConstants', PendulumLabConstants );

  return PendulumLabConstants;
} );