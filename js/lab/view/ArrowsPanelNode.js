// Copyright 2014-2015, University of Colorado Boulder

/**
 * Arrow control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of velocity and acceleration arrows.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var accelerationString = require( 'string!PENDULUM_LAB/acceleration' );
  var velocityString = require( 'string!PENDULUM_LAB/velocity' );

  // constants
  var ARROW_LENGTH = 22;
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var PANEL_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;
  var MAX_TEXT_WIDTH = PANEL_WIDTH * 0.60;  // allows for 60% of the horizontal space in the panel for text.

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isVelocityVisibleProperty - Property to control visibility of velocity arrows.
   * @param {Property.<boolean>} isAccelerationVisibleProperty - Property to control visibility of acceleration arrows.
   * @param {Object} [options] for tools control panel node
   */
  function ArrowsPanelNode( isVelocityVisibleProperty, isAccelerationVisibleProperty, options ) {
    options = _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    var textGroup = new AlignGroup();
    var velocityText = new AlignBox( new Text( velocityString, {
      font: PendulumLabConstants.TITLE_FONT,
      maxWidth: MAX_TEXT_WIDTH
    } ), { group: textGroup, xAlign: 'left' } );
    var accelerationText = new AlignBox( new Text( accelerationString, {
      font: PendulumLabConstants.TITLE_FONT,
      maxWidth: MAX_TEXT_WIDTH
    } ), { group: textGroup, xAlign: 'left' } );

    var velocityArrow = new ArrowNode( 0, 0, ARROW_LENGTH, 0, {
      fill: PendulumLabConstants.VELOCITY_ARROW_COLOR,
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    var accelerationArrow = new ArrowNode( 0, 0, ARROW_LENGTH, 0, {
      fill: PendulumLabConstants.ACCELERATION_ARROW_COLOR,
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );

    // Currently no better way to handle the fluid layout with checkboxes than to determine the amount of additional
    // space they take up.
    var tmpContent = new HBox( { children: [ velocityText, velocityArrow ] } );
    var minContentWidth = tmpContent.width;
    var checkBoxChromeWidth = new CheckBox( tmpContent, new Property( true ), {
      boxWidth: velocityText.height
    } ).width - tmpContent.width;
    tmpContent.dispose();

    var velocityContent = new HBox( { children: [ velocityText, velocityArrow ], pickable: false } );
    var accelerationContent = new HBox( { children: [ accelerationText, accelerationArrow ], pickable: false } );

    var content = new VBox( {
      spacing: 7
    } );

    var velocityCheckBox;
    var accelerationCheckBox;

    // TODO: maxWidths on text so things work out?
    PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP.maxWidthProperty.link( function( width ) {
      if ( velocityCheckBox ) {
        velocityCheckBox.dispose();
      }
      if ( accelerationCheckBox ) {
        accelerationCheckBox.dispose();
      }
      velocityContent.spacing = width - checkBoxChromeWidth - minContentWidth;
      accelerationContent.spacing = width - checkBoxChromeWidth - minContentWidth;
      velocityCheckBox = new CheckBox( velocityContent, isVelocityVisibleProperty, {
        boxWidth: velocityText.height
      } );
      accelerationCheckBox = new CheckBox( accelerationContent, isAccelerationVisibleProperty, {
        boxWidth: accelerationText.height
      } );
      content.children = [ velocityCheckBox, accelerationCheckBox ];
    } );

    Panel.call( this, content, options );
  }

  pendulumLab.register( 'ArrowsPanelNode', ArrowsPanelNode );

  return inherit( Panel, ArrowsPanelNode );
} );
