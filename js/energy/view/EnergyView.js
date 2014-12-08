//  Copyright 2002-2014, University of Colorado Boulder

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
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function EnergyView( pendulumLabModel, mvt, screenshotImage ) {
    PendulumLabView.call( this, pendulumLabModel, mvt, screenshotImage );

    // add energy graph node to the bottom layer
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.pendulumModels, pendulumLabModel.property( 'isEnergyGraphExpanded' ), pendulumLabModel.property( 'energyGraphMode' ), pendulumLabModel.property( 'numberOfPendulums' ) );
    energyGraphNode.centerX = energyGraphNode.width / 2 + SCREEN_PADDING.LEFT;
    energyGraphNode.centerY = energyGraphNode.height / 2 + SCREEN_PADDING.TOP;
    this.energyGraphNode = energyGraphNode;
    this.insertChild( 3, energyGraphNode );

    // move ruler and stopwatch on the right side
    this.rulerNode.centerX += (energyGraphNode.width + 10);
    pendulumLabModel.rulerModel.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.centerX = this.rulerNode.bounds.maxX + this.stopwatchNode.width / 2 + 10;
    pendulumLabModel.stopwatchModel.setInitialLocationValue( this.stopwatchNode.center );
  }

  return inherit( PendulumLabView, EnergyView );
} );