// Copyright 2014-2020, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import PendulumNumberControl from './PendulumNumberControl.js';

const frictionString = pendulumLabStrings.friction;
const lotsString = pendulumLabStrings.lots;
const noneString = pendulumLabStrings.none;

/**
 * Converts the numerical value of the slider to friction, does not assign to friction property
 * @private
 *
 * @param {number} sliderValue
 * @returns {number}
 */
function sliderValueToFriction( sliderValue ) {
  return 0.0005 * ( Math.pow( 2, sliderValue ) - 1 );
}

/**
 * Converts the numerical value of the friction to a slider value, does not assign to slider property
 * @private
 *
 * @param {number}friction
 * @returns {number}
 */
function frictionToSliderValue( friction ) {
  return Utils.roundSymmetric( Math.log( friction / 0.0005 + 1 ) / Math.LN2 );
}

/**
 * @constructor
 *
 * @param {Property.<number>} frictionProperty - Property to update by slider.
 * @param {Range} frictionRange - Possible range of frictionProperty value.
 * @param {Object} [options]
 */
function FrictionSliderNode( frictionProperty, frictionRange, options ) {

  const sliderValueProperty = new DynamicProperty( new Property( frictionProperty ), {
    bidirectional: true,
    map: frictionToSliderValue,
    inverseMap: sliderValueToFriction
  } );

  // range the slider can have
  const sliderValueRange = new Range( frictionToSliderValue( frictionRange.min ), frictionToSliderValue( frictionRange.max ) );

  //TODO #210 replace '{0}' with SunConstants.VALUE_NAMED_PLACEHOLDER
  const numberControl = new PendulumNumberControl( frictionString, sliderValueProperty, sliderValueRange, '{0}', 'rgb(50,145,184)', {
    hasReadoutProperty: new BooleanProperty( false ),
    includeArrowButtons: false,
    sliderPadding: 14,
    sliderOptions: {
      thumbFill: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      minorTickLength: 5,
      majorTickLength: 10,
      constrainValue: function( value ) {
        return Utils.roundSymmetric( value );
      },

      majorTicks: [
        {
          value: sliderValueRange.min,
          label: new Text( noneString, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
        }, {
          value: sliderValueRange.getCenter(),
          label: null
        }, {
          value: sliderValueRange.max,
          label: new Text( lotsString, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
        }
      ],

      minorTickSpacing: sliderValueRange.getLength() / 10
    }
  } );

  // describes the panel box containing the friction slider
  Node.call( this, merge( {
    children: [ numberControl ]
  }, options ) );
}

pendulumLab.register( 'FrictionSliderNode', FrictionSliderNode );

inherit( Node, FrictionSliderNode );
export default FrictionSliderNode;