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

    var textOptions = {
      font: PendulumLabConstants.TITLE_FONT,
      maxWidth: MAX_TEXT_WIDTH
    };
    var textHeight = new Text( 'not visible', textOptions ).height;

    var textGroup = new AlignGroup();
    function createCheckBoxContent( labelString, color ) {
      return new HBox( {
        children: [
          new AlignBox( new Text( velocityString, textOptions ), { group: textGroup, xAlign: 'left' } ),
          new ArrowNode( 0, 0, ARROW_LENGTH, 0, {
            fill: color,
            centerY: 0,
            tailWidth: ARROW_TAIL_WIDTH,
            headWidth: ARROW_HEAD_WIDTH
          } )
        ],
        pickable: false
      } );
    }
    // We'll dynamically adjust the spacings in these, so that the full CheckBox expands to the desired size.
    var velocityContent = createCheckBoxContent( velocityString, PendulumLabConstants.VELOCITY_ARROW_COLOR );
    var accelerationContent = createCheckBoxContent( accelerationString, PendulumLabConstants.ACCELERATION_ARROW_COLOR );

    // Currently no better way to handle the fluid layout with checkboxes than to determine the amount of additional
    // space it takes up when it has no spacing (and then add spacing to fit).
    var tmpCheckBox = new CheckBox( velocityContent, new Property( true ), {
      boxWidth: textHeight
    } );
    var widthWithoutSpacing = tmpCheckBox.width;
    tmpCheckBox.dispose();

    var content = new VBox( {
      spacing: PendulumLabConstants.CHECK_RADIO_SPACING
    } );

    // TODO: maxWidths on text so things work out?
    PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP.maxWidthProperty.link( function( width ) {
      content.children.forEach( function( child ) {
        child.dispose();
      } );

      var spacing = width - widthWithoutSpacing;

      velocityContent.spacing = spacing;
      content.addChild( new CheckBox( velocityContent, isVelocityVisibleProperty, {
        boxWidth: textHeight
      } ) );

      accelerationContent.spacing = spacing;
      content.addChild( new CheckBox( accelerationContent, isAccelerationVisibleProperty, {
        boxWidth: textHeight
      } ) );
    } );

    Panel.call( this, content, options );
  }

  pendulumLab.register( 'ArrowsPanelNode', ArrowsPanelNode );

  return inherit( Panel, ArrowsPanelNode );
} );
