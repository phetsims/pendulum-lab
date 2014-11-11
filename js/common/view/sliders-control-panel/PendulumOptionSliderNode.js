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
  var FONT_LABEL = new PhetFont( 10 );
  var VALUE_LABEL_SPACING = 4;

  /**
   * Constructor for the sliders control
   * @param {Property} trackProperty - Property to update by slider
   * @param {Object} trackPropertyOptions - Options for track property. Include: range, precision and step value
   * @param {string} valuePatternString - String pattern for representation current property value in label
   * @param {string} color - Base color for thumb and label text in rgb format
   * @param {Object} options
   * @constructor
   */
  function PendulumOptionSliderNode( trackProperty, trackPropertyOptions, valuePatternString, color, options ) {
    var arrowButtonMinus, arrowButtonPlus, valueLabel, sliderProperty = new Property( trackProperty.value );

    this._property = sliderProperty;

    VBox.call( this, _.extend( {
      spacing: 4,
      resize: false,
      children: [
        // arrow buttons and value panel
        new HBox( {
          spacing: VALUE_LABEL_SPACING, children: [
            arrowButtonMinus = new ArrowButton( 'left', function() {
              trackProperty.value = Util.toFixedNumber( Math.max( trackPropertyOptions.range.min, trackProperty.value - trackPropertyOptions.step ), trackPropertyOptions.precision );
            }, {scale: 0.5} ),
            new Node( {
              children: [
                new Rectangle( 0, 0, PendulumLabConstants.TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING, arrowButtonMinus.height, 3, 3, {
                  centerY: -1,
                  centerX: 0,
                  fill: '#FFF',
                  stroke: 'black',
                  lineWidth: 1
                } ),
                valueLabel = new Text( StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, trackPropertyOptions.precision ) ), {
                  centerX: 0,
                  centerY: -1,
                  font: FONT_LABEL
                } )
              ]
            } ),
            arrowButtonPlus = new ArrowButton( 'right', function() {
              trackProperty.value = Util.toFixedNumber( Math.min( trackPropertyOptions.range.max, trackProperty.value + trackPropertyOptions.step ), trackPropertyOptions.precision );
            }, {scale: 0.5} )
          ]
        } ),

        new HBox( {
          resize: false,
          children: [
            // necessary to prevent expanding box by thumb
            new HStrut( PendulumLabConstants.THUMB_SIZE.width / 2 ),

            // slider for property
            new HSlider( sliderProperty, trackPropertyOptions.range, {
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
      trackProperty.value = Util.toFixedNumber( sliderValue, trackPropertyOptions.precision );
    } );

    trackProperty.link( function( value ) {
      valueLabel.text = StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, trackPropertyOptions.precision ) );
      arrowButtonMinus.enabled = ( value > trackPropertyOptions.range.min );
      arrowButtonPlus.enabled = ( value < trackPropertyOptions.range.max );
    } );
  }

  return inherit( VBox, PendulumOptionSliderNode, {
    reset: function() {
      this._property.reset();
    }
  } );
} );
