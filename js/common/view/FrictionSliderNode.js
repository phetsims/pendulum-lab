// Copyright 2014-2017, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumNumberControl = require( 'PENDULUM_LAB/common/view/PendulumNumberControl' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var frictionString = require( 'string!PENDULUM_LAB/friction' );
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );

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
    return Util.roundSymmetric( Math.log( friction / 0.0005 + 1 ) / Math.LN2 );
  }

  /**
   * @constructor
   *
   * @param {Property.<number>} frictionProperty - Property to update by slider.
   * @param {Range} frictionRange - Possible range of frictionProperty value.
   * @param {Object} [options]
   */
  function FrictionSliderNode( frictionProperty, frictionRange, options ) {

    var sliderValueProperty = new DynamicProperty( new Property( frictionProperty ), {
      bidirectional: true,
      map: frictionToSliderValue,
      inverseMap: sliderValueToFriction
    } );

    // range the slider can have
    var sliderValueRange = new Range( frictionToSliderValue( frictionRange.min ), frictionToSliderValue( frictionRange.max ) );

    var numberControl = new PendulumNumberControl( frictionString, sliderValueProperty, sliderValueRange, '{0}', 'rgb(50,145,184)', {
      hasReadoutProperty: new BooleanProperty( false ),
      excludeTweakers: true,
      sliderPadding: 14,
      sliderOptions: {
        thumbFillEnabled: '#00C4DF',
        thumbFillHighlighted: '#71EDFF',
        minorTickLength: 5,
        majorTickLength: 10,
        constrainValue: function( value ) {
          return Util.roundSymmetric( value );
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
    Node.call( this, _.extend( {
      children: [ numberControl ]
    }, options ) );
  }

  pendulumLab.register( 'FrictionSliderNode', FrictionSliderNode );

  return inherit( Node, FrictionSliderNode );
} );
