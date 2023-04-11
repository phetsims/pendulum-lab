// Copyright 2014-2023, University of Colorado Boulder

/**
 * Gravity slider and body list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';
import Body from '../model/Body.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import PendulumNumberControl from './PendulumNumberControl.js';

const gravitationalAccelerationPatternString = PendulumLabStrings.gravitationalAccelerationPattern;
const gravityString = PendulumLabStrings.gravity;
const lotsString = PendulumLabStrings.lots;
const noneString = PendulumLabStrings.none;
const whatIsTheValueOfGravityString = PendulumLabStrings.whatIsTheValueOfGravity;

class GravityControlNode extends VBox {
  /**
   * @param {Property.<number>} gravityProperty - Property to update by slider.
   * @param {Range} gravityRange - Range of gravity property.
   * @param {Property.<Body>} bodyProperty - Property to update by combo box.
   * @param {Node} popupLayer
   * @param {Object} [options]
   */
  constructor( gravityProperty, gravityRange, bodyProperty, popupLayer, options ) {
    options = merge( {
      useTextSliderLabels: true
    }, options );

    //TODO #210 replace '{0}' with SunConstants.VALUE_NAMED_PLACEHOLDER
    const labelPattern = StringUtils.fillIn( gravitationalAccelerationPatternString, {
      gravity: '{0}'
    } );

    const comboBoxItems = Body.BODIES.map( body => {
      return {
        value: body,
        createNode: () => new Text( body.title, {
          font: PendulumLabConstants.GRAVITY_COMBO_FONT,
          maxWidth: 50
        } )
      };
    } );

    const comboBox = new ComboBox( bodyProperty, comboBoxItems, popupLayer, {
      cornerRadius: 3,
      xMargin: 13,
      yMargin: 5
    } );

    const questionText = new Text( whatIsTheValueOfGravityString, { font: PendulumLabConstants.VALUE_OF_GRAVITY_FONT } );

    bodyProperty.link( body => {
      questionText.visible = body === Body.PLANET_X;
    } );

    const numberControl = new PendulumNumberControl( gravityString, gravityProperty, gravityRange, labelPattern, 'rgb(50,145,184)', {
      hasReadoutProperty: new DerivedProperty( [ bodyProperty ], body => !options.useTextSliderLabels && body !== Body.PLANET_X ),
      minTick: options.useTextSliderLabels ? noneString : null,
      maxTick: options.useTextSliderLabels ? lotsString : null,
      createBottomContent: bottomBox => {

        // Supports Pendulum Lab's questionText where a question is substituted for the slider
        const bottomContent = new Node( {
          children: [
            bottomBox,
            questionText
          ]
        } );
        questionText.maxWidth = bottomBox.width;
        questionText.center = bottomBox.center;
        questionText.visibleProperty.lazyLink( () => {
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
        constrainValue: value => Utils.roundSymmetric( value * 2 ) / 2
      }
    } );

    super( merge( {
      spacing: 5,
      children: [ numberControl, comboBox ]
    }, options ) );
  }
}

pendulumLab.register( 'GravityControlNode', GravityControlNode );

export default GravityControlNode;