// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main view node for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var EnergyGraphNode = require( 'PENDULUM_LAB/energy/view/EnergyGraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING; // {Object}

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   * @constructor
   */
  function EnergyView( pendulumLabModel, modelViewTransform, energyGraphHeight ) {

    PendulumLabView.call( this, pendulumLabModel, modelViewTransform );

    // create and add energy graph node to the bottom layer
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.pendulums, pendulumLabModel.isEnergyGraphExpandedProperty,
      pendulumLabModel.energyGraphModeProperty, pendulumLabModel.numberOfPendulumsProperty, energyGraphHeight );
    energyGraphNode.left = SCREEN_PADDING.LEFT;
    energyGraphNode.top = SCREEN_PADDING.TOP;
    this.energyGraphLayer.addChild( energyGraphNode );

    this.energyGraphNode = energyGraphNode; // @public

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += (energyGraphNode.width + 10);
    pendulumLabModel.ruler.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.left = this.rulerNode.bounds.maxX  + 10;
    pendulumLabModel.stopwatch.setInitialLocationValue( this.stopwatchNode.center );
  }

  pendulumLab.register( 'EnergyView', EnergyView );

  return inherit( PendulumLabView, EnergyView );
} );