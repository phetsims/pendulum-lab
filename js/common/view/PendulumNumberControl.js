// Copyright 2017-2018, University of Colorado Boulder

/**
 * NumberControl with custom Pendulum Lab options
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
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
   * @param {string|Color} color
   * @param {string} pattern
   * @param {Object} [options]
   */
  function PendulumNumberControl( title, property, range, pattern, color, options ) {
    options = _.extend( {
      excludeTweakers: false,
      hasReadoutProperty: null,
      minTick: null,
      maxTick: null,
      sliderPadding: 0,
      createBottomContent: null
    }, options );

    var numberControlOptions = _.extend( {
      titleFont: PendulumLabConstants.TITLE_FONT_BOLD,
      valueFont: PendulumLabConstants.READOUT_FONT,
      titleMaxWidth: 70,
      valuePattern: pattern,
      valueMaxWidth: 100,
      decimalPlaces: 2,
      delta: 0.01,
      layoutFunction: NumberControl.createLayoutFunction4( options ),
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
