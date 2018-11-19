// Copyright 2014-2018, University of Colorado Boulder

/**
 * Arrow control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of velocity and acceleration arrows.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Checkbox = require( 'SUN/Checkbox' );
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

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isVelocityVisibleProperty - Visibility of velocity arrows.
   * @param {Property.<boolean>} isAccelerationVisibleProperty - Visibility of acceleration arrows.
   * @param {Object} [options]
   */
  function ArrowVisibilityPanel( isVelocityVisibleProperty, isAccelerationVisibleProperty, options ) {
    options = _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    var textOptions = {
      font: PendulumLabConstants.TITLE_FONT,
      maxWidth: 80
    };
    var textHeight = new Text( 'not visible', textOptions ).height;

    var textGroup = new AlignGroup();

    function createCheckboxContent( labelString, color ) {
      return new HBox( {
        children: [
          new AlignBox( new Text( labelString, textOptions ), { group: textGroup, xAlign: 'left' } ),
          new ArrowNode( 0, 0, 22, 0, {
            fill: color,
            centerY: 0,
            tailWidth: 6,
            headWidth: 12
          } )
        ],
        pickable: false
      } );
    }

    // We'll dynamically adjust the spacings in these, so that the full Checkbox expands to the desired size.
    var velocityContent = createCheckboxContent( velocityString, PendulumLabConstants.VELOCITY_ARROW_COLOR );
    var accelerationContent = createCheckboxContent( accelerationString, PendulumLabConstants.ACCELERATION_ARROW_COLOR );

    // Currently no better way to handle the fluid layout with checkboxes than to determine the amount of additional
    // space it takes up when it has no spacing (and then add spacing to fit).
    var tmpCheckbox = new Checkbox( velocityContent, new Property( true ), {
      boxWidth: textHeight
    } );
    var widthWithoutSpacing = tmpCheckbox.width;
    tmpCheckbox.dispose();

    var content = new VBox( {
      spacing: PendulumLabConstants.CHECK_RADIO_SPACING
    } );

    // Whenever the amount of width available changes, we need to recreate the checkboxes
    PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP.maxWidthProperty.link( function( width ) {
      // Properly remove any old checkboxes
      content.children.forEach( function( child ) {
        child.dispose();
      } );

      var spacing = width - widthWithoutSpacing;

      // Create new checkboxes with the proper spacing. Checkbox currently doesn't support resizing content.
      velocityContent.spacing = spacing;
      content.addChild( new Checkbox( velocityContent, isVelocityVisibleProperty, {
        boxWidth: textHeight
      } ) );

      accelerationContent.spacing = spacing;
      content.addChild( new Checkbox( accelerationContent, isAccelerationVisibleProperty, {
        boxWidth: textHeight
      } ) );
    } );

    Panel.call( this, content, options );
  }

  pendulumLab.register( 'ArrowVisibilityPanel', ArrowVisibilityPanel );

  return inherit( Panel, ArrowVisibilityPanel );
} );
