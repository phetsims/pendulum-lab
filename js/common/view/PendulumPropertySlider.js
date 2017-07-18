// Copyright 2014-2015, University of Colorado Boulder

/**
 * Constructor for the pendulum options sliders.
 * Contains title, left and right arrows, label and slider itself.
 *`
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var Color = require( 'SCENERY/util/Color' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var VALUE_LABEL_SPACING = 4;
  var TWEAKERS_STEP = Math.pow( 10, -PendulumLabConstants.TWEAKERS_PRECISION );
  var ARROW_TOUCH_PADDING_TOP = 15;
  var ARROW_TOUCH_PADDING_OUT = 18;
  var ARROW_TOUCH_PADDING_IN = 7;
  var ARROW_TOUCH_PADDING_BOTTOM = 5;

  /**
   * @constructor
   *
   * @param {Property.<number>} trackProperty - Property to update by slider.
   * @param {Range} trackRange - Range of track property.
   * @param {string} valuePatternString - String pattern for representation current property value in label.
   * @param {string} color - Base color for thumb and label text in rgb format.
   * @param {Object} [options]
   */
  function PendulumPropertySlider( trackProperty, trackRange, valuePatternString, color, options ) {
    // create minus button
    var arrowButtonMinus = new ArrowButton( 'left', function() {
      trackProperty.value = Util.toFixedNumber( Math.max( trackRange.min, trackProperty.value - TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
    }, { scale: 0.5 } );
    // adds a touch area around the minus arrow
    arrowButtonMinus.touchArea = arrowButtonMinus.localBounds.withOffsets( ARROW_TOUCH_PADDING_OUT,
      ARROW_TOUCH_PADDING_TOP,
      ARROW_TOUCH_PADDING_IN,
      ARROW_TOUCH_PADDING_BOTTOM );

    // create plus button
    var arrowButtonPlus = new ArrowButton( 'right', function() {
      trackProperty.value = Util.toFixedNumber( Math.min( trackRange.max, trackProperty.value + TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
    }, { scale: 0.5 } );
    // add a touch area to the plus arrow
    arrowButtonPlus.touchArea = arrowButtonPlus.localBounds.withOffsets( ARROW_TOUCH_PADDING_IN,
      ARROW_TOUCH_PADDING_TOP,
      ARROW_TOUCH_PADDING_OUT,
      ARROW_TOUCH_PADDING_BOTTOM );

    // create a property to take care of the slider value
    var sliderProperty = new Property( trackProperty.value );

    // sets width for white box containing pendulum length and width
    var labelBackgroundWidth = PendulumLabConstants.PENDULUM_TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING;

    // create value label
    var valueLabel = new Text( StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, PendulumLabConstants.TWEAKERS_PRECISION ) ), {
      centerX: 0,
      centerY: 0,
      font: PendulumLabConstants.READOUT_FONT,
      maxWidth: labelBackgroundWidth - 6
    } );

    // describes panel box for pendulum mass and length
    VBox.call( this, _.extend( {
      spacing: 4,
      children: [
        // arrow buttons and value panel
        new HBox( {
          spacing: VALUE_LABEL_SPACING, children: [
            arrowButtonMinus,
            new Node( {
              pickable: false,
              children: [
                new Rectangle( 0, 0, labelBackgroundWidth, arrowButtonMinus.height, 3, 3, {
                  centerY: 0,
                  centerX: 0,
                  fill: '#FFF',
                  stroke: 'black',
                  lineWidth: 1
                } ),
                valueLabel
              ]
            } ),
            arrowButtonPlus
          ]
        } ),

        // slider for property
        new HSlider( sliderProperty, trackRange, {
          trackSize: PendulumLabConstants.PENDULUM_TRACK_SIZE,
          thumbSize: PendulumLabConstants.THUMB_SIZE,
          thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
          thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
          thumbFillEnabled: color,
          thumbFillHighlighted: Color.toColor( color ).colorUtilsBrighter( 0.6 )
        } )
      ]
    }, options ) );

    // keep track of the value of the sliders
    sliderProperty.link( function( sliderValue ) {
      trackProperty.value = sliderValue;
    } );

    // change the text when the property changes
    trackProperty.link( function( value ) {
      var valueString = value + '';
      var dotPosition = valueString.indexOf( '.' ) + 1;
      var valuePrecision;

      // find value precision
      if ( dotPosition ) {
        valuePrecision = valueString.length - dotPosition;
      }
      else {
        valuePrecision = 0;
      }

      // set slider value
      if ( valuePrecision > 2 ) {
        sliderProperty.value = Util.toFixedNumber( value, PendulumLabConstants.SLIDER_PRECISION );
      }
      else {
        sliderProperty.value = value;
      }

      // update label and tweakers
      valueLabel.text = StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, PendulumLabConstants.TWEAKERS_PRECISION ) );
      arrowButtonMinus.enabled = ( sliderProperty.value > trackRange.min );
      arrowButtonPlus.enabled = ( sliderProperty.value < trackRange.max );
    } );
  }

  pendulumLab.register( 'PendulumPropertySlider', PendulumPropertySlider );

  return inherit( VBox, PendulumPropertySlider );
} );
