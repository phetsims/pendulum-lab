// Copyright 2014-2015, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // strings
  var rulerString = require( 'string!PENDULUM_LAB/ruler' );
  var stopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );
  var periodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );
  var periodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );

  // constants
  var PANEL_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;
  var TEXT_OPTIONS = {
    font: PendulumLabConstants.TITLE_FONT,
    pickable: false,
    maxWidth: PANEL_WIDTH * 0.80 // the maximum width of the text is 80% of the panel width
  };

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isRulerProperty - property to control visibility of ruler.
   * @param {Property.<boolean>} isStopwatchProperty - property to control visibility of stopwatch.
   * @param {Property.<boolean>} isPeriodTraceProperty - property to control visibility of period trace tool.
   * @param {boolean} hasPeriodTimer
   * @param {Object} [options]
   */
  function ToolsControlPanelNode( isRulerProperty, isStopwatchProperty, isPeriodTraceProperty, hasPeriodTimer, options ) {

    // @private
    this._labels = [
      new Text( rulerString, TEXT_OPTIONS ),
      new Text( stopwatchString, TEXT_OPTIONS ),
      new Text( hasPeriodTimer ? periodTimerString : periodTraceString, TEXT_OPTIONS )
    ];

    var items = [ {
      content: this._labels[ 0 ],
      property: isRulerProperty
    }, {
      content: this._labels[ 1 ],
      property: isStopwatchProperty
    }, {
      content: this._labels[ 2 ],
      property: isPeriodTraceProperty
    } ];

    var content = new AlignBox( new VerticalCheckBoxGroup( items, {
      spacing: 7,
      boxWidth: this._labels[ 0 ].height
    } ), { group: PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP } );

    Panel.call( this, content, _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options ) );
  }

  pendulumLab.register( 'ToolsControlPanelNode', ToolsControlPanelNode );

  return inherit( Panel, ToolsControlPanelNode );
} );
