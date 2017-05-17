// Copyright 2014-2015, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Util = require( 'DOT/Util' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );

  // constants
  var FONT = new PhetFont( 9 );
  var TICK_NUMBER = 10;

  /**
   * converts the numerical value of the slider to friction, does not assign to friction property
   * @private
   * @param {number} sliderValue
   * @returns {number}
   */
  function sliderValueToFriction( sliderValue ) {
    return 0.0005 * ( Math.pow( 2, sliderValue ) - 1 );
  }

  /**
   * converts the numerical value of the friction to a slider value, does not assign to slider property
   * @private
   * @param {number}friction
   * @returns {number}
   */
  function frictionToSliderValue( friction ) {
    return Util.roundSymmetric( Math.log( friction / 0.0005 + 1 ) / Math.LN2 );
  }

  /**
   * Constructor for the gravity slider control.
   * @public
   * @param {Property.<number>} frictionProperty - Property to update by slider.
   * @param {Range} frictionRange - Possible range of frictionProperty value.
   * @param {Object} [options]
   * @constructor
   */
  function FrictionSliderNode( frictionProperty, frictionRange, options ) {
    // property for the slider value
    var sliderValueProperty = new Property( frictionToSliderValue( frictionProperty.value ) );

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
      thumbFillHighlighted: '#71EDFF'
    } );

    // describes the panel box containing the friction slider
    Node.call( this, _.extend( {
      spacing: 6,
      resize: false,
      children: [ hSlider ]
    }, options ) );

    // add ticks, we want two major ticks
    hSlider.addMajorTick( sliderValueRange.min, new Text( noneString, { font: FONT, pickable: false } ) );
    hSlider.addMajorTick( sliderValueRange.min / 2 + sliderValueRange.max / 2 );
    hSlider.addMajorTick( sliderValueRange.max, new Text( lotsString, { font: FONT, pickable: false } ) );

    // add the minor ticks
    var tickStep = (sliderValueRange.max - sliderValueRange.min) / TICK_NUMBER;
    for ( var i = sliderValueRange.min + tickStep; i < sliderValueRange.max; i += tickStep ) {
      hSlider.addMinorTick( i );
    }
    
    // TODO: Consider using hSlider.constrainValue as an option for snapping values.
    // Check BatteryResistanceControl.js line 57
    // slider link to friction value
    sliderValueProperty.link( function( sliderValue ) {
      // snap to integer values
      if ( sliderValue % 1 === 0 ) {
        frictionProperty.value = sliderValueToFriction( sliderValue );
      }
      else {
        sliderValueProperty.value = Util.roundSymmetric( sliderValue );
      }
    } );

    frictionProperty.lazyLink( function( frictionValue ) {
      sliderValueProperty.value = Util.roundSymmetric( frictionToSliderValue( frictionValue ) );
    } );
  }

  pendulumLab.register( 'FrictionSliderNode', FrictionSliderNode );

  return inherit( Node, FrictionSliderNode );
} );
