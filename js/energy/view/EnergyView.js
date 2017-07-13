// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main view node for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var EnergyGraphNode = require( 'PENDULUM_LAB/energy/view/EnergyGraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   * @constructor
   */
  function EnergyView( pendulumLabModel, energyGraphHeight, options ) {

    PendulumLabView.call( this, pendulumLabModel, options );

    // create and add energy graph node to the bottom layer
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.pendula, pendulumLabModel.isEnergyGraphExpandedProperty,
      pendulumLabModel.energyGraphModeProperty, pendulumLabModel.numberOfPendulaProperty, energyGraphHeight );
    energyGraphNode.left = PendulumLabConstants.SCREEN_PADDING;
    energyGraphNode.top = PendulumLabConstants.SCREEN_PADDING;
    this.energyGraphLayer.addChild( energyGraphNode );

    this.energyGraphNode = energyGraphNode; // @public

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += ( energyGraphNode.width + 10 );
    pendulumLabModel.ruler.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.left = this.rulerNode.right + 10;
    pendulumLabModel.stopwatch.setInitialLocationValue( this.stopwatchNode.center );
  }

  pendulumLab.register( 'EnergyView', EnergyView );

  return inherit( PendulumLabView, EnergyView );
} );
