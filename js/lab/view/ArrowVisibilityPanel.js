// Copyright 2014-2019, University of Colorado Boulder

/**
 * Arrow control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of velocity and acceleration arrows.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const accelerationString = require( 'string!PENDULUM_LAB/acceleration' );
  const velocityString = require( 'string!PENDULUM_LAB/velocity' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isVelocityVisibleProperty - Visibility of velocity arrows.
   * @param {Property.<boolean>} isAccelerationVisibleProperty - Visibility of acceleration arrows.
   * @param {Object} [options]
   */
  function ArrowVisibilityPanel( isVelocityVisibleProperty, isAccelerationVisibleProperty, options ) {
    options = _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    const textOptions = {
      font: PendulumLabConstants.TITLE_FONT,
      maxWidth: 80
    };
    const textHeight = new Text( 'not visible', textOptions ).height;

    const textGroup = new AlignGroup();

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
    const velocityContent = createCheckboxContent( velocityString, PendulumLabConstants.VELOCITY_ARROW_COLOR );
    const accelerationContent = createCheckboxContent( accelerationString, PendulumLabConstants.ACCELERATION_ARROW_COLOR );

    // Currently no better way to handle the fluid layout with checkboxes than to determine the amount of additional
    // space it takes up when it has no spacing (and then add spacing to fit).
    const tmpCheckbox = new Checkbox( velocityContent, new Property( true ), {
      boxWidth: textHeight
    } );
    const widthWithoutSpacing = tmpCheckbox.width;
    tmpCheckbox.dispose();

    const content = new VBox( {
      spacing: PendulumLabConstants.CHECK_RADIO_SPACING
    } );

    // Whenever the amount of width available changes, we need to recreate the checkboxes
    PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP.maxWidthProperty.link( function( width ) {
      // Properly remove any old checkboxes
      content.children.forEach( function( child ) {
        child.dispose();
      } );

      const spacing = width - widthWithoutSpacing;

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
