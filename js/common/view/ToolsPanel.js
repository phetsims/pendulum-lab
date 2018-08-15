// Copyright 2014-2017, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of ruler, stopwatch and period trace tools.
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
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // strings
  var periodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );
  var periodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );
  var rulerString = require( 'string!PENDULUM_LAB/ruler' );
  var stopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );

  // constants
  var TEXT_OPTIONS = {
    font: PendulumLabConstants.TITLE_FONT,
    pickable: false,
    maxWidth: 100
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
  function ToolsPanel( isRulerProperty, isStopwatchProperty, isPeriodTraceProperty, hasPeriodTimer, options ) {
    options = _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    // @private
    this._labels = [
      new Text( rulerString, TEXT_OPTIONS ),
      new Text( stopwatchString, TEXT_OPTIONS ),
      new Text( hasPeriodTimer ? periodTimerString : periodTraceString, TEXT_OPTIONS )
    ];

    var items = [ {
      node: this._labels[ 0 ],
      property: isRulerProperty
    }, {
      node: this._labels[ 1 ],
      property: isStopwatchProperty
    }, {
      node: this._labels[ 2 ],
      property: isPeriodTraceProperty
    } ];

    var content = new AlignBox( new VerticalCheckboxGroup( items, {
      spacing: PendulumLabConstants.CHECK_RADIO_SPACING,
      boxWidth: this._labels[ 0 ].height
    } ), {
      group: PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP,
      xAlign: 'left'
    } );

    Panel.call( this, content, options );
  }

  pendulumLab.register( 'ToolsPanel', ToolsPanel );

  return inherit( Panel, ToolsPanel );
} );
