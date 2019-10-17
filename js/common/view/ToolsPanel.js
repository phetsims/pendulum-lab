// Copyright 2014-2019, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // strings
  const periodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );
  const periodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );
  const rulerString = require( 'string!PENDULUM_LAB/ruler' );
  const stopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );

  // constants
  const TEXT_OPTIONS = {
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
    options = merge( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    // @private
    this._labels = [
      new Text( rulerString, TEXT_OPTIONS ),
      new Text( stopwatchString, TEXT_OPTIONS ),
      new Text( hasPeriodTimer ? periodTimerString : periodTraceString, TEXT_OPTIONS )
    ];

    const items = [ {
      node: this._labels[ 0 ],
      property: isRulerProperty
    }, {
      node: this._labels[ 1 ],
      property: isStopwatchProperty
    }, {
      node: this._labels[ 2 ],
      property: isPeriodTraceProperty
    } ];

    const content = new AlignBox( new VerticalCheckboxGroup( items, {
      spacing: PendulumLabConstants.CHECK_RADIO_SPACING,
      checkboxOptions: { boxWidth: this._labels[ 0 ].height }
    } ), {
      group: PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP,
      xAlign: 'left'
    } );

    Panel.call( this, content, options );
  }

  pendulumLab.register( 'ToolsPanel', ToolsPanel );

  return inherit( Panel, ToolsPanel );
} );
