// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constructor for the pendulum options sliders.
 * Contains title, left and right arrows, label and slider itself.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var FONT_LABEL = new PhetFont( 9 );
  var VALUE_LABEL_SPACING = 4;
  var TWEAKERS_STEP = Math.pow( 10, -PendulumLabConstants.TWEAKERS_PRECISION );

  /**
   * Constructor for the sliders control.
   *
   * @param {Property<number>} trackProperty - Property to update by slider.
   * @param {Object} trackPropertyRange - Range of track property.
   * @param {string} valuePatternString - String pattern for representation current property value in label.
   * @param {string} color - Base color for thumb and label text in rgb format.
   * @param {Object} [options]
   * @constructor
   */
  function PendulumOptionSliderNode( trackProperty, trackPropertyRange, valuePatternString, color, options ) {
    // create minus button
    var arrowButtonMinus = new ArrowButton( 'left', function() {
      trackProperty.value = Util.toFixedNumber( Math.max( trackPropertyRange.min, trackProperty.value - TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
    }, { scale: 0.5 } );

    // create value label
    var valueLabel = new Text( StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, PendulumLabConstants.TWEAKERS_PRECISION ) ), {
      centerX: 0,
      centerY: -1,
      font: FONT_LABEL
    } );

    // create plus button
    var arrowButtonPlus = new ArrowButton( 'right', function() {
      trackProperty.value = Util.toFixedNumber( Math.min( trackPropertyRange.max, trackProperty.value + TWEAKERS_STEP ), PendulumLabConstants.TWEAKERS_PRECISION );
    }, { scale: 0.5 } );

    var sliderProperty = new Property( trackProperty.value );
    this._property = sliderProperty;

    VBox.call( this, _.extend( {
      spacing: 4,
      resize: false,
      children: [
        // arrow buttons and value panel
        new HBox( {
          spacing: VALUE_LABEL_SPACING, children: [
            arrowButtonMinus,
            new Node( {
              children: [
                new Rectangle( 0, 0, PendulumLabConstants.TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING, arrowButtonMinus.height, 3, 3, {
                  centerY: -1,
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

        new HBox( {
          resize: false,
          children: [
            // necessary to prevent expanding box by thumb
            new HStrut( PendulumLabConstants.THUMB_SIZE.width / 2 ),

            // slider for property
            new HSlider( sliderProperty, trackPropertyRange, {
              trackSize: PendulumLabConstants.TRACK_SIZE,
              thumbSize: PendulumLabConstants.THUMB_SIZE,
              thumbFillEnabled: color
            } ),

            // necessary to prevent expanding box by thumb
            new HStrut( PendulumLabConstants.THUMB_SIZE.width / 2 )
          ]
        } )
      ]
    }, options ) );

    sliderProperty.link( function( sliderValue ) {
      trackProperty.value = sliderValue;
    } );

    trackProperty.link( function( value ) {
      var valueString = value + "";
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
      arrowButtonMinus.enabled = ( sliderProperty.value > trackPropertyRange.min );
      arrowButtonPlus.enabled = ( sliderProperty.value < trackPropertyRange.max );
    } );
  }

  return inherit( VBox, PendulumOptionSliderNode );
} );
