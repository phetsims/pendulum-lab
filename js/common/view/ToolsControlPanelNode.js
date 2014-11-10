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
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HStrut = require( 'SUN/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // strings
  var RulerString = require( 'string!PENDULUM_LAB/ruler' );
  var StopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );
  var PeriodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );

  // constants
  var FONT = new PhetFont( 11 );
  var PANEL_WIDTH = 122;

  /**
   * {Property} isRulerProperty - property to control visibility of ruler
   * {Property} isStopwatchProperty - property to control visibility of stopwatch
   * {Property} isPeriodTraceProperty - property to control visibility of period trace tool
   * {Object} options for tools control panel node
   * @constructor
   */
  function ToolsControlPanelNode( isRulerProperty, isStopwatchProperty, isPeriodTraceProperty, options ) {
    PanelPendulumAbstract.call( this,
      new Node( {
        children: [
          // necessary to expand panel
          new HStrut( PANEL_WIDTH ),

          new VerticalCheckBoxGroup( [{
            content: new Text( RulerString, {font: FONT} ),
            property: isRulerProperty
          }, {
            content: new Text( StopwatchString, {font: FONT} ),
            property: isStopwatchProperty
          }, {
            content: new Text( PeriodTraceString, {font: FONT} ),
            property: isPeriodTraceProperty
          }
          ], {spacing: 5, boxWidth: 15} )
        ]
      } ), options );
  }

  return inherit( PanelPendulumAbstract, ToolsControlPanelNode );
} );