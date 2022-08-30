// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main view node for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import PendulumLabConstants from '../../common/PendulumLabConstants.js';
import EnergyScreenView from '../../energy/view/EnergyScreenView.js';
import pendulumLab from '../../pendulumLab.js';
import ArrowVisibilityPanel from './ArrowVisibilityPanel.js';
import PeriodTimerNode from './PeriodTimerNode.js';

class LabScreenView extends EnergyScreenView {

  /**
   * @param {PendulumLabModel} model
   */
  constructor( model ) {
    super( model, {
      hasGravityTweakers: true,
      hasPeriodTimer: true
    } );

    // create arrow panel node to the bottom layer
    const arrowsPanelNode = new ArrowVisibilityPanel( model.isVelocityVisibleProperty, model.isAccelerationVisibleProperty, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );
    this.arrowsPanelLayer.addChild( arrowsPanelNode );

    const periodTimerNode = new PeriodTimerNode( model.periodTimer, model.pendula[ 1 ].isVisibleProperty, this.layoutBounds );
    this.periodTimerLayer.addChild( periodTimerNode );

    // layout the nodes
    periodTimerNode.right = this.rightPanelsContainer.left - 10;
    periodTimerNode.centerY = this.stopwatchNode.centerY;
    // move energyGraphAccordionBox to the bottom
    this.energyGraphAccordionBox.top = arrowsPanelNode.bottom + PendulumLabConstants.PANEL_PADDING;

    model.periodTimer.setInitialPositionValue( periodTimerNode.center );

    // set dynamical dragBounds to keep the periodTimer within the visibleBounds
    this.visibleBoundsProperty.link( visibleBounds => {
      periodTimerNode.dragListener.dragBoundsProperty = visibleBounds.erodedXY( periodTimerNode.width / 2, periodTimerNode.height / 2 );
    } );

    this.resizeEnergyGraphToFit();
  }
}

pendulumLab.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
