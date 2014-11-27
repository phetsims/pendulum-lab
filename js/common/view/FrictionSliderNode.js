// Copyright 2002-2014, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var LotsString = require( 'string!PENDULUM_LAB/lots' );
  var NoneString = require( 'string!PENDULUM_LAB/none' );

  // constants
  var FONT = new PhetFont( 9 );
  var TICK_NUMBER = 10;

  /**
   * Constructor for the gravity slider control
   * @param {Property} frictionProperty - Property to update by slider
   * @param {Range} frictionPropertyRange - Possible range of frictionProperty value
   * @param {Object} options
   * @constructor
   */
  function FrictionSliderNode( frictionProperty, frictionPropertyRange, options ) {
    var sliderValueProperty = new Property( frictionToSliderValue( frictionProperty.value ) ),
      sliderValueRange = new Range( frictionToSliderValue( frictionPropertyRange.min ), frictionToSliderValue( frictionPropertyRange.max ), sliderValueProperty.value );

    this._property = sliderValueProperty;

    VBox.call( this, _.extend( {spacing: 4}, options ) );

    // add slider for friction property
    var hSlider = new HSlider( sliderValueProperty, sliderValueRange, {
      majorTickLength: 10,
      minorTickLength: 5,
      trackSize: PendulumLabConstants.TRACK_SIZE,
      thumbSize: PendulumLabConstants.THUMB_SIZE
    } );

    // add ticks
    hSlider.addMajorTick( sliderValueRange.min, new Text( NoneString, {font: FONT} ) );
    hSlider.addMajorTick( (sliderValueRange.min + sliderValueRange.max) / 2 );
    hSlider.addMajorTick( sliderValueRange.max, new Text( LotsString, {font: FONT} ) );
    for ( var tickStep = (sliderValueRange.max - sliderValueRange.min) / TICK_NUMBER, i = sliderValueRange.min + tickStep; i < sliderValueRange.max; i += tickStep ) {
      hSlider.addMinorTick( i );
    }

    this.addChild( hSlider );

    sliderValueProperty.link( function( sliderValue ) {
      // snap to integer values
      if ( sliderValue % 1 === 0 ) {
        frictionProperty.value = sliderValueToFriction( sliderValue );
      }
      else {
        sliderValueProperty.value = Math.round( sliderValue );
      }
    } );
  }

  var sliderValueToFriction = function( sliderValue ) {
    return 0.0005 * (Math.pow( 2, sliderValue ) - 1);
  };

  var frictionToSliderValue = function( friction ) {
    return Math.round( Math.log( friction / 0.0005 + 1 ) / Math.LN2 );
  };

  return inherit( VBox, FrictionSliderNode, {
    reset: function() {
      this._property.reset();
    }
  } );
} );
