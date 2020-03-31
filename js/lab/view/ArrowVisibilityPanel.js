// Copyright 2014-2020, University of Colorado Boulder

/**
 * Arrow control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of velocity and acceleration arrows.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import PendulumLabConstants from '../../common/PendulumLabConstants.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import pendulumLab from '../../pendulumLab.js';

const accelerationString = pendulumLabStrings.acceleration;
const velocityString = pendulumLabStrings.velocity;

/**
 * @constructor
 *
 * @param {Property.<boolean>} isVelocityVisibleProperty - Visibility of velocity arrows.
 * @param {Property.<boolean>} isAccelerationVisibleProperty - Visibility of acceleration arrows.
 * @param {Object} [options]
 */
function ArrowVisibilityPanel( isVelocityVisibleProperty, isAccelerationVisibleProperty, options ) {
  options = merge( {}, PendulumLabConstants.PANEL_OPTIONS, options );

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

inherit( Panel, ArrowVisibilityPanel );
export default ArrowVisibilityPanel;