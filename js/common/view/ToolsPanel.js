// Copyright 2014-2023, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains checkbox buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, Text } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

const periodTimerString = PendulumLabStrings.periodTimer;
const periodTraceString = PendulumLabStrings.periodTrace;
const rulerString = PendulumLabStrings.ruler;
const stopwatchString = PendulumLabStrings.stopwatch;

// constants
const TEXT_OPTIONS = {
  font: PendulumLabConstants.TITLE_FONT,
  pickable: false,
  maxWidth: 100
};

class ToolsPanel extends Panel {

  /**
   * @param {Property.<boolean>} isRulerProperty - property to control visibility of ruler.
   * @param {Property.<boolean>} isStopwatchProperty - property to control visibility of stopwatch.
   * @param {Property.<boolean>} isPeriodTraceProperty - property to control visibility of period trace tool.
   * @param {boolean} hasPeriodTimer
   * @param {Object} [options]
   */
  constructor( isRulerProperty, isStopwatchProperty, isPeriodTraceProperty, hasPeriodTimer, options ) {

    options = merge( {}, PendulumLabConstants.PANEL_OPTIONS, options );

    const items = [
      {
        createNode: () => new Text( rulerString, TEXT_OPTIONS ),
        property: isRulerProperty
      },
      {
        createNode: () => new Text( stopwatchString, TEXT_OPTIONS ),
        property: isStopwatchProperty
      },
      {
        createNode: () => new Text( hasPeriodTimer ? periodTimerString : periodTraceString, TEXT_OPTIONS ),
        property: isPeriodTraceProperty
      }
    ];

    const content = new AlignBox( new VerticalCheckboxGroup( items, {
      spacing: PendulumLabConstants.CHECK_RADIO_SPACING,
      checkboxOptions: { boxWidth: new Text( rulerString, TEXT_OPTIONS ).height }
    } ), {
      group: PendulumLabConstants.LEFT_CONTENT_ALIGN_GROUP,
      xAlign: 'left'
    } );

    super( content, options );
  }
}

pendulumLab.register( 'ToolsPanel', ToolsPanel );
export default ToolsPanel;