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
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.pendulumModels, pendulumLabModel.property( 'energyGraphMode' ), pendulumLabModel.property( 'numberOfPendulums' ) );
    energyGraphNode.centerX = energyGraphNode.width / 2 + SCREEN_PADDING.LEFT;
    energyGraphNode.centerY = energyGraphNode.height / 2 + SCREEN_PADDING.TOP;
    this.insertChild( 1, energyGraphNode );
  }

  return inherit( PendulumLabView, EnergyView );
} );