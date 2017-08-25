// Copyright 2017, University of Colorado Boulder

/**
 * NumberControl with custom Pendulum Lab options
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   *
   * @param {string} title
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {string} pattern
   * @param {Object} [options]
   */
  function PendulumNumberControl( title, property, range, pattern, color, options ) {
    options = _.extend( {
      excludeTweakers: false,
      alternateSlider: null,
      hasReadoutProperty: null,
      minTick: null,
      maxTick: null,
      sliderPadding: 0
    }, options );

    var numberControlOptions = _.extend( {
      titleFont: PendulumLabConstants.TITLE_FONT_BOLD,
      valueFont: PendulumLabConstants.READOUT_FONT,
      titleMaxWidth: 90,
      valuePattern: pattern,
      valueMaxWidth: 80,
      decimalPlaces: 2,
      delta: 0.01,
      layoutFunction: function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
        var bottomBox = new HBox( {
          resize: false, // prevent slider from causing resize?
          spacing: 5,
          children: options.excludeTweakers ? [ slider ] : [
            leftArrowButton,
            slider,
            rightArrowButton
          ]
        } );
        var bottomContent = bottomBox;
        if ( options.alternateSlider ) {
          var alternateSlider = options.alternateSlider;
          bottomContent = new Node( {
            children: [
              bottomBox,
              alternateSlider
            ]
          } );
          alternateSlider.maxWidth = bottomBox.width;
          alternateSlider.center = bottomBox.center;
          alternateSlider.onStatic( 'visibility', function() {
            bottomBox.visible = !alternateSlider.visible;
          } );
        }
        var group = new AlignGroup( { matchHorizontal: false } );
        var titleBox = new AlignBox( titleNode, {
          group: group
        } );
        var numberBox = new AlignBox( numberDisplay, {
          group: group
        } );
        titleBox.bottom = numberBox.bottom = bottomContent.top - 5;
        titleBox.left = bottomContent.left - options.sliderPadding;
        numberBox.right = bottomContent.right + options.sliderPadding;
        var node = new Node( { children: [ bottomContent, titleBox, numberBox ] } );
        if ( options.hasReadoutProperty ) {
          options.hasReadoutProperty.link( function( hasReadout ) {
            numberBox.visible = hasReadout;
          } );
        }
        return node;
      },
      useRichText: true,
      majorTickLength: 5,
      arrowButtonScale: 0.56,
      constrainValue: function( value ) {
        return Util.roundSymmetric( value * 10 ) / 10;
      },
      thumbSize: PendulumLabConstants.THUMB_SIZE,
      thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
      thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
      thumbFillEnabled: color,
      thumbFillHighlighted: Color.toColor( color ).colorUtilsBrighter( 0.6 ),
      majorTicks: [ {
        value: range.min,
        label: new Text( options.minTick || range.min, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
      }, {
        value: range.max,
        label: new Text( options.maxTick || range.max, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
      } ]
    }, options );

    var trackWidth = 500;
    var testControl = new NumberControl( title, property, range, _.extend( {}, numberControlOptions, {
      trackSize: new Dimension2( trackWidth, PendulumLabConstants.TRACK_HEIGHT )
    } ) );

    var testWidth = testControl.width;
    testControl.dispose();

    NumberControl.call( this, title, property, range, _.extend( {}, numberControlOptions, {
      trackSize: new Dimension2( trackWidth + PendulumLabConstants.RIGHT_CONTENT_WIDTH - testWidth, PendulumLabConstants.TRACK_HEIGHT )
    } ) );
  }

  pendulumLab.register( 'PendulumNumberControl', PendulumNumberControl );

  return inherit( NumberControl, PendulumNumberControl );
} );
