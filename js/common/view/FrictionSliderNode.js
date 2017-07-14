// Copyright 2014-2015, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );

  // constants
  var TICK_NUMBER = 10;

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
    var sliderValueRange = new RangeWithValue( frictionToSliderValue( frictionRange.min ), frictionToSliderValue( frictionRange.max ), sliderValueProperty.value );

    // the slider itself
    var hSlider = new HSlider( sliderValueProperty, sliderValueRange, {
      minorTickLength: 5,
      majorTickLength: 10,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE,
      thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
      thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      constrainValue: function( value ) {
        return Util.roundSymmetric( value );
      }
    } );

    // describes the panel box containing the friction slider
    Node.call( this, _.extend( {
      spacing: 6,
      children: [ hSlider ]
    }, options ) );

    // add ticks, we want two major ticks
    hSlider.addMajorTick( sliderValueRange.min, new Text( noneString, { font: PendulumLabConstants.TICK_FONT, pickable: false } ) );
    hSlider.addMajorTick( sliderValueRange.min / 2 + sliderValueRange.max / 2 );
    hSlider.addMajorTick( sliderValueRange.max, new Text( lotsString, { font: PendulumLabConstants.TICK_FONT, pickable: false } ) );

    // add the minor ticks
    var tickStep = ( sliderValueRange.max - sliderValueRange.min ) / TICK_NUMBER;
    for ( var i = sliderValueRange.min + tickStep; i < sliderValueRange.max; i += tickStep ) {
      hSlider.addMinorTick( i );
    }
  }

  pendulumLab.register( 'FrictionSliderNode', FrictionSliderNode );

  return inherit( Node, FrictionSliderNode );
} );
