// Copyright 2014-2015, University of Colorado Boulder

/**
 * Controls the length and mass of a pendulum
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumOptionSliderNode = require( 'PENDULUM_LAB/common/view/PendulumOptionSliderNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lengthString = require( 'string!PENDULUM_LAB/length' );
  var massString = require( 'string!PENDULUM_LAB/mass' );
  var pattern0LengthValueLengthUnitsMetricString = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern0MassValueMassUnitsMetricString = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );

  /**
   * TODO: doc
   * TODO: get rid of having to pass pendulumIndex around
   */
  function LengthMassControlNode( pendulum, pendulumIndex ) {
    var pendulumNumberString = '' + ( pendulumIndex + 1 );

    var labelOptions = {
      pickable: false,
      font: PendulumLabConstants.TITLE_FONT
    };

    VBox.call( this, {
      spacing: 4,
      align: 'left',
      children: [
        new Text( StringUtils.fillIn( lengthString, {
          pendulumNumber: pendulumNumberString
        } ), labelOptions ),
        new PendulumOptionSliderNode(
          pendulum.lengthProperty,
          pendulum.lengthRange,
          pattern0LengthValueLengthUnitsMetricString,
          pendulum.color
        ),
        new Text( StringUtils.fillIn( massString, {
          pendulumNumber: pendulumNumberString
        } ), labelOptions ),
        new PendulumOptionSliderNode(
          pendulum.massProperty,
          pendulum.massRange,
          pattern0MassValueMassUnitsMetricString,
          pendulum.color
        )
      ]
    } );
  }

  pendulumLab.register( 'LengthMassControlNode', LengthMassControlNode );

  return inherit( VBox, LengthMassControlNode );
} );
