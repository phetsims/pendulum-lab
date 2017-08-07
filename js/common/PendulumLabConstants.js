// Copyright 2014-2015, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  var PANEL_CORNER_RADIUS = 5;
  var PANEL_X_MARGIN = 10;
  var PANEL_Y_MARGIN = 8;
  var PANEL_BACKGROUND_COLOR = 'rgb( 230, 230, 230 )';

  var PendulumLabConstants = {
    // Some other colors
    BACKGROUND_COLOR: 'rgb( 255, 255, 255 )',
    FIRST_PENDULUM_COLOR: 'rgb( 0, 0, 255 )',
    SECOND_PENDULUM_COLOR: 'rgb( 255, 0, 0 )',
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',

    // Energy colors
    KINETIC_ENERGY_COLOR: 'rgb( 31, 202, 46 )',
    POTENTIAL_ENERGY_COLOR: 'rgb( 55, 132, 213 )',
    THERMAL_ENERGY_COLOR: 'rgb( 253, 87, 31 )',
    TOTAL_ENERGY_COLOR: 'rgb( 0, 0, 0 )',

    // Fonts
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
    DIALOG_TITLE_FONT: new PhetFont( 22 ),
    LEGEND_ABBREVIATION_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
    LEGEND_DESCRIPTION_FONT: new PhetFont( 16 ),

    TITLE_MAX_WIDTH: 140,
    TICK_LABEL_MAX_WIDTH: 50,

    // Spacing between panels/boxes/sides of layout bounds
    PANEL_PADDING: 10,

    // Corner radius of our normal panels
    PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS,

    // Options for all top-level Panels
    PANEL_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: PANEL_BACKGROUND_COLOR,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN
    },

    // Options for AccordionBoxes
    BOX_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: PANEL_BACKGROUND_COLOR,
      contentXMargin: PANEL_X_MARGIN,
      contentYMargin: PANEL_Y_MARGIN
    },

    // sliders
    PENDULUM_TRACK_SIZE: new Dimension2( 140, 0.5 ),
    GLOBAL_TRACK_SIZE: new Dimension2( 115, 0.5 ),
    THUMB_SIZE: new Dimension2( 11, 20 ),
    THUMB_TOUCH_AREA_X_DILATION: 5,
    THUMB_TOUCH_AREA_Y_DILATION: 4,
    SLIDER_PRECISION: 1,
    TWEAKERS_PRECISION: 2,

    // Spacing between checkboxes, radio buttons, or other items of that nature
    CHECK_RADIO_SPACING: 7,

    // Alignment groups for the left and right panels/boxes
    LEFT_CONTENT_ALIGN_GROUP: new AlignGroup( { matchVertical: false } ),
    RIGHT_CONTENT_ALIGN_GROUP: new AlignGroup( { matchVertical: false } ),

    // create a model view transform (assuming the dev view screen is 1024 wide and the 618 high)
    // the height of the screen is 4/3 m = 1.33 m
    MODEL_VIEW_TRANSFORM: ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, new Vector2( 1024 / 2, 15 ), 618 / 1.33 )
  };

  pendulumLab.register( 'PendulumLabConstants', PendulumLabConstants );

  // @public {Array.<string>}
  PendulumLabConstants.PENDULUM_COLORS = [ PendulumLabConstants.FIRST_PENDULUM_COLOR, PendulumLabConstants.SECOND_PENDULUM_COLOR ];

  return PendulumLabConstants;
} );
