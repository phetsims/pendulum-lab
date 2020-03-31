// Copyright 2014-2020, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

const periodTimerString = pendulumLabStrings.periodTimer;
const periodTraceString = pendulumLabStrings.periodTrace;
const rulerString = pendulumLabStrings.ruler;
const stopwatchString = pendulumLabStrings.stopwatch;

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

inherit( Panel, ToolsPanel );
export default ToolsPanel;