// Copyright 2017-2019, University of Colorado Boulder

/**
 * Length/mass panel and gravity/friction panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const FrictionSliderNode = require( 'PENDULUM_LAB/common/view/FrictionSliderNode' );
  const GravityControlNode = require( 'PENDULUM_LAB/common/view/GravityControlNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model - Main model of pendulum lab simulation.
   * @param {Node} popupLayer
   * @param {boolean} hasGravityTweakers
   */
  function GlobalControlPanel( model, popupLayer, hasGravityTweakers ) {

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

    Panel.call( this, content, PendulumLabConstants.PANEL_OPTIONS );
  }

  pendulumLab.register( 'GlobalControlPanel', GlobalControlPanel );

  return inherit( Panel, GlobalControlPanel );
} );
