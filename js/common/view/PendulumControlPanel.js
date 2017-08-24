// Copyright 2017, University of Colorado Boulder

/**
 * Panel with length/mass controls for all available pendula
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lengthString = require( 'string!PENDULUM_LAB/length' );
  var massString = require( 'string!PENDULUM_LAB/mass' );
  var metersPatternString = require( 'string!PENDULUM_LAB/metersPattern' );
  var kilogramsPatternString = require( 'string!PENDULUM_LAB/kilogramsPattern' );

  /**
   * @constructor
   *
   * @param {Array.<Pendulum>} pendula
   * @param {Property.<number>} numberOfPendulaProperty
   */
  function PendulumControlPanel( pendula, numberOfPendulaProperty ) {

    var content = new VBox( {
      spacing: 13
    } );

    var separator = new Line( {
      stroke: 'rgb(160,160,160)',
      lineWidth: 0.3
    } );
    PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP.maxWidthProperty.link( function( width ) {
      separator.x2 = width;
    } );

    var pendulumSliderGroups = pendula.map( function( pendulum ) {
      var pendulumNumberString = '' + ( pendulum.index + 1 );
      var lengthTitle = StringUtils.fillIn( lengthString, {
        pendulumNumber: pendulumNumberString
      } );
      var massTitle = StringUtils.fillIn( massString, {
        pendulumNumber: pendulumNumberString
      } );

      var numberControlOptions = {
        titleFont: PendulumLabConstants.TITLE_FONT_BOLD,
        valueFont: PendulumLabConstants.READOUT_FONT,
        titleMaxWidth: PendulumLabConstants.TITLE_MAX_WIDTH,
        valueMaxWidth: 80,
        decimalPlaces: 2,
        delta: 0.01,
        layoutFunction: PendulumLabConstants.NUMBER_CONTROL_LAYOUT,
        majorTickLength: 5,
        arrowButtonScale: 0.56,
        constrainValue: function( value ) {
          return Util.roundSymmetric( value * 10 ) / 10;
        },
        trackSize: PendulumLabConstants.PENDULUM_TRACK_SIZE,
        thumbSize: PendulumLabConstants.THUMB_SIZE,
        thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
        thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
        thumbFillEnabled: pendulum.color,
        thumbFillHighlighted: Color.toColor( pendulum.color ).colorUtilsBrighter( 0.6 ),
      };

      return new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          new AlignBox( new NumberControl( lengthTitle, pendulum.lengthProperty, pendulum.lengthRange, _.extend( {}, numberControlOptions, {
            valuePattern: StringUtils.fillIn( metersPatternString, { meters: '{0}' } ),
            majorTicks: [ {
              value: pendulum.lengthRange.min,
              label: new Text( pendulum.lengthRange.min, { font: PendulumLabConstants.TICK_FONT } )
            }, {
              value: pendulum.lengthRange.max,
              label: new Text( pendulum.lengthRange.max, { font: PendulumLabConstants.TICK_FONT } )
            } ]
          } ) ), {
            group: PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP
          } ),

          new AlignBox( new NumberControl( massTitle, pendulum.massProperty, pendulum.massRange, _.extend( {}, numberControlOptions, {
            valuePattern: StringUtils.fillIn( kilogramsPatternString, { kilograms: '{0}' } ),
            majorTicks: [ {
              value: pendulum.massRange.min,
              label: new Text( pendulum.massRange.min, { font: PendulumLabConstants.TICK_FONT } )
            }, {
              value: pendulum.massRange.max,
              label: new Text( pendulum.massRange.max, { font: PendulumLabConstants.TICK_FONT } )
            } ]
          } ) ), {
            group: PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP
          } )
        ]
      } );
    } );

    numberOfPendulaProperty.link( function( numberOfPendula ) {
      content.children = numberOfPendula === 1 ? [
        pendulumSliderGroups[ 0 ]
      ] : [
        pendulumSliderGroups[ 0 ],
        separator,
        pendulumSliderGroups[ 1 ]
      ];
    } );

    Panel.call( this, content, PendulumLabConstants.PANEL_OPTIONS );
  }

  pendulumLab.register( 'PendulumControlPanel', PendulumControlPanel );

  return inherit( Panel, PendulumControlPanel );
} );
