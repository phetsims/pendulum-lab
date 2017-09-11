// Copyright 2017, University of Colorado Boulder

/**
 * Panel with length/mass controls for all available pendula
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumNumberControl = require( 'PENDULUM_LAB/common/view/PendulumNumberControl' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var kilogramsPatternString = require( 'string!PENDULUM_LAB/kilogramsPattern' );
  var lengthString = require( 'string!PENDULUM_LAB/length' );
  var massString = require( 'string!PENDULUM_LAB/mass' );
  var metersPatternString = require( 'string!PENDULUM_LAB/metersPattern' );

  /**
   * @constructor
   *
   * @param {Array.<Pendulum>} pendula
   * @param {Property.<number>} numberOfPendulaProperty
   */
  function PendulumControlPanel( pendula, numberOfPendulaProperty ) {

    var content = new VBox( {
      spacing: 16
    } );

    var separator = new Line( {
      stroke: 'rgb(160,160,160)',
      lineWidth: 0.3,
      x2: PendulumLabConstants.RIGHT_CONTENT_WIDTH
    } );

    var pendulumSliderGroups = pendula.map( function( pendulum ) {
      var pendulumNumberString = '' + ( pendulum.index + 1 );
      var lengthTitle = StringUtils.fillIn( lengthString, {
        pendulumNumber: pendulumNumberString
      } );
      var massTitle = StringUtils.fillIn( massString, {
        pendulumNumber: pendulumNumberString
      } );

      var lengthPattern = StringUtils.fillIn( metersPatternString, { meters: '{0}' } );
      var massPattern = StringUtils.fillIn( kilogramsPatternString, { kilograms: '{0}' } );

      return new VBox( {
        spacing: 14,
        align: 'left',
        children: [
          new PendulumNumberControl( lengthTitle, pendulum.lengthProperty, pendulum.lengthRange, lengthPattern, pendulum.color ),
          new PendulumNumberControl( massTitle, pendulum.massProperty, pendulum.massRange, massPattern, pendulum.color )
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
