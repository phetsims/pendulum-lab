// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main view node for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PendulumLabConstants from '../../common/PendulumLabConstants.js';
import PendulumLabScreenView from '../../common/view/PendulumLabScreenView.js';
import pendulumLab from '../../pendulumLab.js';
import EnergyGraphAccordionBox from './EnergyGraphAccordionBox.js';

class EnergyScreenView extends PendulumLabScreenView {
  /**
   * @param {PendulumLabModel} model
   */
  constructor( model, options ) {

    super( model, options );

    // @protected {Property.<number>}
    this.chartHeightProperty = new NumberProperty( 200 );

    // create and add energy graph node to the bottom layer
    const energyGraphAccordionBox = new EnergyGraphAccordionBox( model, this.chartHeightProperty, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );
    this.energyGraphLayer.addChild( energyGraphAccordionBox );

    // @protected {EnergyGraphAccordionBox}
    this.energyGraphAccordionBox = energyGraphAccordionBox;

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += ( energyGraphAccordionBox.width + 10 );
    model.ruler.setInitialPositionValue( this.rulerNode.center );

    this.setStopwatchInitialPosition();

    this.resizeEnergyGraphToFit();
  }

  /**
   * Changes the chart height so that the energy graph fits all available size
   * @protected
   */
  resizeEnergyGraphToFit() {
    const currentSpace = this.toolsControlPanelNode.top - this.energyGraphAccordionBox.bottom;
    const desiredSpace = PendulumLabConstants.PANEL_PADDING;

    this.chartHeightProperty.value += currentSpace - desiredSpace;
  }
}

pendulumLab.register( 'EnergyScreenView', EnergyScreenView );
export default EnergyScreenView;
