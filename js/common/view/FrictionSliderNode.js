// Copyright 2014-2015, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );

  // constants
  var FONT = new PhetFont( 9 );
  var TICK_NUMBER = 10;

  function sliderValueToFriction( sliderValue ) {
    return 0.0005 * ( Math.pow( 2, sliderValue ) - 1 );
  }

  function frictionToSliderValue( friction ) {
    return Util.roundSymmetric( Math.log( friction / 0.0005 + 1 ) / Math.LN2 );
  }

  /**
   * Constructor for the gravity slider control.
   *
   * @param {Property.<number>} frictionProperty - Property to update by slider.
   * @param {Range} frictionRange - Possible range of frictionProperty value.
   * @param {Object} [options]
   * @constructor
   */
  function FrictionSliderNode( frictionProperty, frictionRange, options ) {
    var sliderValueProperty = new Property( frictionToSliderValue( frictionProperty.value ) );
    var sliderValueRange = new Range( frictionToSliderValue( frictionRange.min ), frictionToSliderValue( frictionRange.max ), sliderValueProperty.value );

    HSlider.call( this, sliderValueProperty, sliderValueRange, _.extend( {
      minorTickLength: 5,
      majorTickLength: 10,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbNode: new HSlider.ThumbNode( new Property( true ), {
        thumbSize: PendulumLabConstants.THUMB_SIZE,
        thumbFillEnabled: '#888',
        thumbFillHighlighted: '#ccc'
      } )
    }, options ) );

    // add ticks
    this.addMajorTick( sliderValueRange.min, new Text( noneString, { font: FONT, pickable: false } ) );
    this.addMajorTick( (sliderValueRange.min + sliderValueRange.max) / 2 );
    this.addMajorTick( sliderValueRange.max, new Text( lotsString, { font: FONT, pickable: false } ) );

    var tickStep = (sliderValueRange.max - sliderValueRange.min) / TICK_NUMBER;
    for ( var i = sliderValueRange.min + tickStep; i < sliderValueRange.max; i += tickStep ) {
      this.addMinorTick( i );
    }

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

  return inherit( HSlider, FrictionSliderNode );
} );
