// Copyright 2014-2015, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  var PANEL_CORNER_RADIUS = 5;
  var PANEL_MARGIN = 10;
  var PANEL_BACKGROUND_COLOR = 'rgb( 230, 230, 230 )';

  var PendulumLabConstants = {
    BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
    FIRST_PENDULUM_COLOR: 'rgb( 0, 0, 255 )',
    SECOND_PENDULUM_COLOR: 'rgb( 255, 0, 0 )',
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',

    ICON_PENDULUM_MODE_SIZE: 35,

    // TODO: adjust to fit
    TITLE_FONT: new PhetFont( 13 ),
    TITLE_FONT_BOLD: new PhetFont( { size: 13, weight: 'bold' } ),
    TICK_FONT: new PhetFont( 10 ),
    READOUT_FONT: new PhetFont( 10 ),
    RULER_FONT: new PhetFont( 10 ),
    PERIOD_TIMER_TITLE_FONT: new PhetFont( 14 ),
    PERIOD_TIMER_READOUT_FONT: new PhetFont( 14 ),
    VALUE_OF_GRAVITY_FONT: new PhetFont( 10 ),
    GRAVITY_COMBO_FONT: new PhetFont( 12 ),
    PENDULUM_LABEL_FONT: new PhetFont( { size: 32, weight: 'bold' } ),
    PROTRACTOR_DEGREES_FONT: new PhetFont( { size: 14, weight: 'bold' } ),
    RETURN_BUTTON_FONT: new PhetFont( 14 ),
    ENERGY_HEADER_FONT: new PhetFont( { size: 11, weight: 'bold' } ),
    ENERGY_BAR_FONT: new PhetFont( { size: 11, weight: 'bold' } ),

    PANEL_PADDING: 10,

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
    TRACK_SIZE: new Dimension2( 116, 0.5 ),
    THUMB_SIZE: new Dimension2( 11, 20 ),
    THUMB_TOUCH_AREA_X_DILATION: 5,
    THUMB_TOUCH_AREA_Y_DILATION: 4,
    SLIDER_PRECISION: 1,
    TWEAKERS_PRECISION: 2,

    // create a model view transform (assuming the dev view screen is 1024 wide and the 618 high)
    // the height of the screen is 4/3 m = 1.33 m
    MODEL_VIEW_TRANSFORM: ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, new Vector2( 1024 / 2, 15 ), 618 / 1.33 )
  };

  pendulumLab.register( 'PendulumLabConstants', PendulumLabConstants );

  return PendulumLabConstants;
} );
