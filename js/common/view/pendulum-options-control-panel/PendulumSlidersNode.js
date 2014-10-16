// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var FONT_LABEL = new PhetFont( 10 );
  var FONT_TITLE = new PhetFont( {size: 11, weight: 'bold'} );
  var VALUE_LABEL_SPACING = 4;
  var TRACK_SIZE = new Dimension2( 113, 0 );

  /**
   * Constructor for the sliders control
   * @param {Property} trackProperty - Property to update by slider
   * @param {Object} trackPropertyOptions - Options for track property. Include: range, precision and step value
   * @param {string} titleText - Text for slider title
   * @param {string} valuePatternString - String pattern for representation current property value in label
   * @param {string} color - Base color for thumb and label text in rgb format
   * @param {Object} options
   * @constructor
   */
  function PendulumSlidersNode( trackProperty, trackPropertyOptions, titleText, valuePatternString, color, options ) {
    var arrowButtonMinus, arrowButtonPlus, valueLabel;

    VBox.call( this, _.extend( {
      spacing: 4,
      align: 'left',
      children: [
        // slider's title
        new Text( titleText, { font: FONT_TITLE, fill: color} ),

        // arrow buttons and value panel
        new HBox( {spacing: VALUE_LABEL_SPACING, children: [
          arrowButtonMinus = new ArrowButton( 'left', function() {
            trackProperty.value = Math.max( trackPropertyOptions.range.min, trackProperty.value - trackPropertyOptions.step );
          }, {scale: 0.5} ),
          new Node( {children: [
            new Rectangle( 0, 0, TRACK_SIZE.width - 2 * arrowButtonMinus.width - 2 * VALUE_LABEL_SPACING, arrowButtonMinus.height, 3, 3, {centerY: -1, centerX: 0, fill: '#FFF', stroke: 'black', lineWidth: 1} ),
            valueLabel = new Text( StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, trackPropertyOptions.precision ) ), {centerX: 0, centerY: -1, font: FONT_LABEL} )
          ]} ),
          arrowButtonPlus = new ArrowButton( 'right', function() {
            trackProperty.value = Math.min( trackPropertyOptions.range.max, trackProperty.value + trackPropertyOptions.step );
          }, {scale: 0.5} )
        ]} ),

        // slider for property
        new HSlider( trackProperty, trackPropertyOptions.range, {
          trackSize: TRACK_SIZE,
          thumbSize: new Dimension2( 10, 19 ),
          thumbFillEnabled: color
        } )
      ]
    }, options ) );

    trackProperty.link( function( value ) {
      valueLabel.text = StringUtils.format( valuePatternString, Util.toFixed( trackProperty.value, trackPropertyOptions.precision ) );
      arrowButtonMinus.enabled = ( value > trackPropertyOptions.range.min );
      arrowButtonPlus.enabled = ( value < trackPropertyOptions.range.max );
    } );
  }

  return inherit( VBox, PendulumSlidersNode );
} );
