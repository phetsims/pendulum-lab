// Copyright 2002-2014, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HStrut = require( 'SUN/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var RulerString = require( 'string!PENDULUM_LAB/ruler' );
  var StopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );
  var PeriodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );

  // constants
  var FONT = new PhetFont( 11 );
  var CHECK_BOX_OPTIONS = {
    boxWidth: 15
  };
  var PANEL_WIDTH = 122;

  /**
   * {Property} isRulerProperty - property to control visibility of ruler
   * {Property} isStopwatchProperty - property to control visibility of stopwatch
   * {Property} isPeriodTrace - property to control visibility of period trace tool
   * {Object} options for tools control panel node
   * @constructor
   */
  function ToolsControlPanelNode( isRulerProperty, isStopwatchProperty, isPeriodTrace, options ) {
    Panel.call( this,
      new Node( {children: [
        // necessary to expand panel
        new HStrut( PANEL_WIDTH ),

        // contains checkboxes
        new VBox( {
          align: 'left',
          spacing: 5,
          children: [
            // ruler checkbox
            new CheckBox(
              new Text( RulerString, {font: FONT} ),
              isRulerProperty,
              CHECK_BOX_OPTIONS
            ),

            // stopwatch checkbox
            new CheckBox(
              new Text( StopwatchString, {font: FONT} ),
              isStopwatchProperty,
              CHECK_BOX_OPTIONS
            ),

            // period trace
            new CheckBox(
              new Text( PeriodTraceString, {font: FONT} ),
              isPeriodTrace,
              CHECK_BOX_OPTIONS
            )
          ]} )
      ]} ), _.extend( {
        cornerRadius: 5,
        fill: PendulumLabConstants.CONTROL_PANEL_BACKGROUND_COLOR,
        xMargin: 10,
        yMargin: 10
      }, options ) );
  }

  return inherit( Panel, ToolsControlPanelNode );
} );