// Copyright 2014-2020, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../scenery/js/nodes/AlignGroup.js';
import pendulumLab from '../pendulumLab.js';

const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 10;
const PANEL_Y_MARGIN = 8;
const PANEL_BACKGROUND_COLOR = 'rgb( 230, 230, 230 )';

const PendulumLabConstants = {
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
  TITLE_FONT: new PhetFont( 14 ),
  TITLE_FONT_BOLD: new PhetFont( { size: 14, weight: 'bold' } ),
  TICK_FONT: new PhetFont( 12 ),
  READOUT_FONT: new PhetFont( 14 ),
  RULER_FONT: new PhetFont( 10 ),
  PERIOD_TIMER_TITLE_FONT: new PhetFont( 14 ),
  PERIOD_TIMER_READOUT_FONT: new PhetFont( 14 ),
  VALUE_OF_GRAVITY_FONT: new PhetFont( 14 ),
  GRAVITY_COMBO_FONT: new PhetFont( 12 ),
  PENDULUM_LABEL_FONT: new PhetFont( { size: 32, weight: 'bold' } ),
  PROTRACTOR_DEGREES_FONT: new PhetFont( { size: 14, weight: 'bold' } ),
  RETURN_BUTTON_FONT: new PhetFont( 14 ),
  ENERGY_HEADER_FONT: new PhetFont( { size: 11, weight: 'bold' } ),
  DIALOG_TITLE_FONT: new PhetFont( 22 ),
  LEGEND_ABBREVIATION_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  LEGEND_DESCRIPTION_FONT: new PhetFont( 16 ),

  TITLE_MAX_WIDTH: 140,
  TICK_LABEL_MAX_WIDTH: 50,

  RIGHT_CONTENT_WIDTH: 170,

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
  TRACK_HEIGHT: 0.5,
  THUMB_SIZE: new Dimension2( 13, 22 ),
  THUMB_TOUCH_AREA_X_DILATION: 5,
  THUMB_TOUCH_AREA_Y_DILATION: 4,
  SLIDER_PRECISION: 1,
  TWEAKERS_PRECISION: 2,

  // Spacing between checkboxes, radio buttons, or other items of that nature
  CHECK_RADIO_SPACING: 7,

  // Alignment groups for the left and right panels/boxes
  LEFT_CONTENT_ALIGN_GROUP: new AlignGroup( { matchVertical: false } ),

  // create a model view transform (assuming the dev view screen is 1024 wide and the 618 high)
  // the height of the screen is 4/3 m = 1.33 m
  MODEL_VIEW_TRANSFORM: ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, new Vector2( 1024 / 2, 15 ), 618 / 1.33 )
};

pendulumLab.register( 'PendulumLabConstants', PendulumLabConstants );

// @public {Array.<string>}
PendulumLabConstants.PENDULUM_COLORS = [ PendulumLabConstants.FIRST_PENDULUM_COLOR, PendulumLabConstants.SECOND_PENDULUM_COLOR ];

export default PendulumLabConstants;