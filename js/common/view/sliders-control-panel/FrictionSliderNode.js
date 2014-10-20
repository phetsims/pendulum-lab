// Copyright 2002-2014, University of Colorado Boulder

/**
 * Friction slider node in 'Pendulum lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var SliderTitleNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/SliderTitleNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var FrictionString = require( 'string!PENDULUM_LAB/friction' );
  var LotsString = require( 'string!PENDULUM_LAB/lots' );
  var NoneString = require( 'string!PENDULUM_LAB/none' );

  // constants
  var FONT = new PhetFont( 11 );
  var TRACK_SIZE = new Dimension2( 113, 0 );
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

    VBox.call( this, _.extend( {
      spacing: 4,
      align: 'left'
    }, options ) );

    // add slider's title
    this.addChild( new SliderTitleNode( FrictionString ) );

    // add slider for gravity property
    var hSlider = new HSlider( sliderValueProperty, sliderValueRange, {
      majorTickLength: 10,
      minorTickLength: 5,
      trackSize: TRACK_SIZE,
      thumbSize: new Dimension2( 10, 19 )
    } );

    // add ticks
    hSlider.addMajorTick( sliderValueRange.min, new Text( NoneString, {font: FONT} ) );
    hSlider.addMajorTick( (sliderValueRange.min + sliderValueRange.max) / 2 );
    hSlider.addMajorTick( sliderValueRange.max, new Text( LotsString, {font: FONT} ) );
    for ( var tickStep = (sliderValueRange.max - sliderValueRange.min) / TICK_NUMBER , i = sliderValueRange.min + tickStep; i < sliderValueRange.max; i += tickStep ) {
      hSlider.addMinorTick( i );
    }

    this.addChild( hSlider );

    sliderValueProperty.link( function( sliderValue ) {
      frictionProperty.value = sliderValueToFriction( sliderValue );
    } );

    frictionProperty.link( function( friction ) {
      sliderValueProperty.value = frictionToSliderValue( friction );
    } );
  }

  // TODO: correct function
  var sliderValueToFriction = function( sliderValue ) {
    return 0.0005 * (Math.pow( 2, sliderValue ) - 1);
  };

  var frictionToSliderValue = function( friction ) {
    return Math.log( friction / 0.0005 + 1 ) / Math.LN2;
  };

  return inherit( VBox, FrictionSliderNode );
} );
