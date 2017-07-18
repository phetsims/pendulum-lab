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
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumPropertySlider = require( 'PENDULUM_LAB/common/view/PendulumPropertySlider' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lengthString = require( 'string!PENDULUM_LAB/length' );
  var massString = require( 'string!PENDULUM_LAB/mass' );
  var pattern0LengthValueLengthUnitsMetricString = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern0MassValueMassUnitsMetricString = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );

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
      return new VBox( {
        spacing: 7,
        align: 'left',
        children: [
          new Text( StringUtils.fillIn( lengthString, {
            pendulumNumber: pendulumNumberString
          } ), { font: PendulumLabConstants.TITLE_FONT_BOLD } ),
          new AlignBox( new PendulumPropertySlider(
            pendulum.lengthProperty,
            pendulum.lengthRange,
            pattern0LengthValueLengthUnitsMetricString,
            pendulum.color
          ), { group: PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP } ),
          new Text( StringUtils.fillIn( massString, {
            pendulumNumber: pendulumNumberString
          } ), { font: PendulumLabConstants.TITLE_FONT_BOLD } ),
          new AlignBox( new PendulumPropertySlider(
            pendulum.massProperty,
            pendulum.massRange,
            pattern0MassValueMassUnitsMetricString,
            pendulum.color
          ), { group: PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP } )
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
