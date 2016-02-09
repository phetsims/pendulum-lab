// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main view node for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowsPanelNode = require( 'PENDULUM_LAB/lab/view/ArrowsPanelNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function LabView( pendulumLabModel, modelViewTransform, energyGraphHeight ) {
    EnergyView.call( this, pendulumLabModel, modelViewTransform, energyGraphHeight );

    // add arrow panel node to the bottom layer
    var arrowsPanelNode = new ArrowsPanelNode( pendulumLabModel.isVelocityVisibleProperty,
      pendulumLabModel.isAccelerationVisibleProperty );
    arrowsPanelNode.centerX = arrowsPanelNode.width / 2 + SCREEN_PADDING.LEFT;
    arrowsPanelNode.centerY = arrowsPanelNode.height / 2 + SCREEN_PADDING.TOP;
    this.arrowsPanelLayer.addChild( arrowsPanelNode );

    // move energyGraphNode on the bottom
    this.energyGraphNode.centerY += (arrowsPanelNode.height + 8);

    // add tweakers for gravity slider slider
    this.systemSlidersNode.gravitySlider.addTweakers( pendulumLabModel.gravityProperty, pendulumLabModel.gravityRange );
  }

  return inherit( EnergyView, LabView );
} );