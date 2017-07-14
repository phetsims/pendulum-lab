// Copyright 2014-2015, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  var PANEL_CORNER_RADIUS = 5;
  var PANEL_MARGIN = 10;
  var PANEL_BACKGROUND_COLOR = 'rgb( 230, 230, 230 )';

  var PendulumLabConstants = {
    // Pendula
    FIRST_PENDULUM_COLOR: 'rgb( 0, 0, 255 )',
    ICON_PENDULUM_MODE_SIZE: 29,
    SECOND_PENDULUM_COLOR: 'rgb( 255, 0, 0 )',

    // arrows
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',

    TITLE_FONT: new PhetFont( 11 ),

    PANEL_PADDING: 8,

    // panels
    PANEL_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: PANEL_BACKGROUND_COLOR,
      xMargin: PANEL_MARGIN,
      yMargin: 8 // TODO: clean this up
    },
    LEFT_PANELS_MIN_WIDTH: 122,
    PANEL_BACKGROUND_COLOR: PANEL_BACKGROUND_COLOR,
    PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS,
    PANEL_MARGIN: PANEL_MARGIN,

    // sliders
    TRACK_SIZE: new Dimension2( 95, 0.5 ),
    THUMB_SIZE: new Dimension2( 10, 17 ),
    THUMB_TOUCH_AREA_X_DILATION: 5,
    THUMB_TOUCH_AREA_Y_DILATION: 4,
    SLIDER_PRECISION: 1,
    TWEAKERS_PRECISION: 2,

    // common
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 504 ),
    BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
    SCREEN_PADDING: 14,
    // create a model view transform (assuming the dev view screen is 768 wide and the 504 high)
    // the height of the screen is 4/3 m = 1.33 m
    MODEL_VIEW_TRANSFORM: ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2(), new Vector2( 768 / 2, 15 ), 504 / 1.33 )
  };

  pendulumLab.register( 'PendulumLabConstants', PendulumLabConstants );

  return PendulumLabConstants;
} );
