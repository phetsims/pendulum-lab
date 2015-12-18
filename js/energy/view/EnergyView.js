// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main view node for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyGraphNode = require( 'PENDULUM_LAB/energy/view/EnergyGraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function EnergyView( pendulumLabModel, modelViewTransform, energyGraphHeight ) {
    PendulumLabView.call( this, pendulumLabModel, modelViewTransform );

    // add energy graph node to the bottom layer
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.pendulums, pendulumLabModel.isEnergyGraphExpandedProperty,
      pendulumLabModel.energyGraphModeProperty, pendulumLabModel.numberOfPendulumsProperty, energyGraphHeight );
    energyGraphNode.centerX = energyGraphNode.width / 2 + SCREEN_PADDING.LEFT;
    energyGraphNode.centerY = energyGraphNode.height / 2 + SCREEN_PADDING.TOP;
    this.energyGraphNode = energyGraphNode;
    this.energyGraphLayer.addChild( energyGraphNode );

    // move ruler and stopwatch on the right side
    this.rulerNode.centerX += (energyGraphNode.width + 10);
    pendulumLabModel.ruler.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.centerX = this.rulerNode.bounds.maxX + this.stopwatchNode.width / 2 + 10;
    pendulumLabModel.stopwatch.setInitialLocationValue( this.stopwatchNode.center );
  }

  return inherit( PendulumLabView, EnergyView );
} );