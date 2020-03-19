// Copyright 2017-2020, University of Colorado Boulder

/**
 * NumberControl with custom Pendulum Lab options
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

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
  options = merge( {
    hasReadoutProperty: null,
    minTick: null,
    maxTick: null,
    sliderPadding: 0,
    createBottomContent: null
  }, options );

  const numberControlOptions = merge( {
    delta: 0.01,
    layoutFunction: NumberControl.createLayoutFunction4( options ),

    // subcomponent options
    titleNodeOptions: {
      font: PendulumLabConstants.TITLE_FONT_BOLD,
      maxWidth: 70
    },
    numberDisplayOptions: {
      textOptions: {
        font: PendulumLabConstants.READOUT_FONT
      },
      valuePattern: pattern,
      maxWidth: 100,
      decimalPlaces: 2,
      useRichText: true
    },
    arrowButtonOptions: { scale: 0.56 },
    sliderOptions: null
  }, options );

  const sliderOptions = merge( {
    majorTickLength: 5,
    constrainValue: function( value ) {
      return Utils.roundSymmetric( value * 10 ) / 10;
    },
    thumbSize: PendulumLabConstants.THUMB_SIZE,
    thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
    thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
    thumbFill: color,
    thumbFillHighlighted: Color.toColor( color ).colorUtilsBrighter( 0.6 ),
    majorTicks: [ {
      value: range.min,
      label: new Text( options.minTick || range.min, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
    }, {
      value: range.max,
      label: new Text( options.maxTick || range.max, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
    } ]
  }, options.sliderOptions );

  const trackWidth = 500;
  const testControlSliderOptions = merge( {}, sliderOptions, {
    trackSize: new Dimension2( trackWidth, PendulumLabConstants.TRACK_HEIGHT )
  } );
  numberControlOptions.sliderOptions = testControlSliderOptions;
  const testControl = new NumberControl( title, property, range, numberControlOptions );

  const testWidth = testControl.width;
  testControl.dispose();
  const numberControlSliderOptions = merge( {}, sliderOptions, {
    trackSize: new Dimension2( trackWidth + PendulumLabConstants.RIGHT_CONTENT_WIDTH - testWidth, PendulumLabConstants.TRACK_HEIGHT )
  } );
  numberControlOptions.sliderOptions = numberControlSliderOptions;
  NumberControl.call( this, title, property, range, numberControlOptions );
}

pendulumLab.register( 'PendulumNumberControl', PendulumNumberControl );

inherit( NumberControl, PendulumNumberControl );
export default PendulumNumberControl;