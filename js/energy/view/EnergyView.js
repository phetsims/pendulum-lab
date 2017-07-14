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
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   */
  function EnergyView( model, energyGraphHeight, options ) {

    PendulumLabView.call( this, model, options );

    // create and add energy graph node to the bottom layer
    var energyGraphNode = new EnergyGraphNode( model, energyGraphHeight );
    energyGraphNode.left = PendulumLabConstants.SCREEN_PADDING;
    energyGraphNode.top = PendulumLabConstants.SCREEN_PADDING;
    this.energyGraphLayer.addChild( energyGraphNode );

    this.energyGraphNode = energyGraphNode; // @public

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += ( energyGraphNode.width + 10 );
    model.ruler.setInitialLocationValue( this.rulerNode.center );

    this.stopwatchNode.left = this.rulerNode.right + 10;
    model.stopwatch.setInitialLocationValue( this.stopwatchNode.center );
  }

  pendulumLab.register( 'EnergyView', EnergyView );

  return inherit( PendulumLabView, EnergyView );
} );
