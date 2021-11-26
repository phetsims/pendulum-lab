// Copyright 2017-2021, University of Colorado Boulder

/**
 * Length/mass panel and gravity/friction panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import { VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import FrictionSliderNode from './FrictionSliderNode.js';
import GravityControlNode from './GravityControlNode.js';

class GlobalControlPanel extends Panel {

  /**
   * @param {PendulumLabModel} model - Main model of pendulum lab simulation.
   * @param {Node} popupLayer
   * @param {boolean} hasGravityTweakers
   */
  constructor( model, popupLayer, hasGravityTweakers ) {

    const gravityControlNode = new GravityControlNode( model.gravityProperty, model.gravityRange, model.bodyProperty, popupLayer, {
      useTextSliderLabels: !hasGravityTweakers
    } );
    const frictionSlider = new FrictionSliderNode( model.frictionProperty, model.frictionRange );

    const content = new VBox( {
      spacing: 10,
      children: [
        gravityControlNode,
        frictionSlider
      ]
    } );

    super( content, PendulumLabConstants.PANEL_OPTIONS );
  }
}

pendulumLab.register( 'GlobalControlPanel', GlobalControlPanel );
export default GlobalControlPanel;