// Copyright 2014-2020, University of Colorado Boulder

/**
 * Gravity slider and body list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import pendulumLab from '../../pendulumLab.js';
import Body from '../model/Body.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import PendulumNumberControl from './PendulumNumberControl.js';

const gravitationalAccelerationPatternString = pendulumLabStrings.gravitationalAccelerationPattern;
const gravityString = pendulumLabStrings.gravity;
const lotsString = pendulumLabStrings.lots;
const noneString = pendulumLabStrings.none;
const whatIsTheValueOfGravityString = pendulumLabStrings.whatIsTheValueOfGravity;

/**
 * @constructor
 *
 * @param {Property.<number>} gravityProperty - Property to update by slider.
 * @param {Range} gravityRange - Range of gravity property.
 * @param {Property.<Body>} bodyProperty - Property to update by combo box.
 * @param {Node} popupLayer
 * @param {Object} [options]
 */
function GravityControlNode( gravityProperty, gravityRange, bodyProperty, popupLayer, options ) {
  options = merge( {
    useTextSliderLabels: true
  }, options );

  //TODO #210 replace '{0}' with SunConstants.VALUE_NAMED_PLACEHOLDER
  const labelPattern = StringUtils.fillIn( gravitationalAccelerationPatternString, {
    gravity: '{0}'
  } );

  const comboBoxItems = Body.BODIES.map( function( body ) {
    return new ComboBoxItem( new Text( body.title, {
      font: PendulumLabConstants.GRAVITY_COMBO_FONT,
      maxWidth: 50
    } ), body );
  } );

  const comboBox = new ComboBox( comboBoxItems, bodyProperty, popupLayer, {
    cornerRadius: 3,
    xMargin: 13,
    yMargin: 5
  } );

  const questionText = new Text( whatIsTheValueOfGravityString, { font: PendulumLabConstants.VALUE_OF_GRAVITY_FONT } );

  bodyProperty.link( function( body ) {
    questionText.visible = body === Body.PLANET_X;
  } );

  const numberControl = new PendulumNumberControl( gravityString, gravityProperty, gravityRange, labelPattern, 'rgb(50,145,184)', {
    hasReadoutProperty: new DerivedProperty( [ bodyProperty ], function( body ) {
      return !options.useTextSliderLabels && body !== Body.PLANET_X;
    } ),
    minTick: options.useTextSliderLabels ? noneString : null,
    maxTick: options.useTextSliderLabels ? lotsString : null,
    createBottomContent: function( bottomBox ) {

      // Supports Pendulum Lab's questionText where a question is substituted for the slider
      const bottomContent = new Node( {
        children: [
          bottomBox,
          questionText
        ]
      } );
      questionText.maxWidth = bottomBox.width;
      questionText.center = bottomBox.center;
      questionText.visibleProperty.lazyLink( function() {
        bottomBox.visible = !questionText.visible;
      } );

      return bottomContent;
    },
    includeArrowButtons: !options.useTextSliderLabels,
    sliderPadding: options.useTextSliderLabels ? 14 : 0,

    // subcomponent options
    sliderOptions: {
      thumbFill: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      // See https://github.com/phetsims/pendulum-lab/issues/183 for rounding
      constrainValue: function( value ) {
        return Utils.roundSymmetric( value * 2 ) / 2;
      }
    }
  } );

  VBox.call( this, merge( {
    spacing: 5,
    children: [ numberControl, comboBox ]
  }, options ) );
}

pendulumLab.register( 'GravityControlNode', GravityControlNode );

inherit( VBox, GravityControlNode );
export default GravityControlNode;