//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
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
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function LabView( pendulumLabModel, mvt, screenshotImage ) {
    EnergyView.call( this, pendulumLabModel, mvt, screenshotImage );

    // add arrow panel node to the bottom layer
    var arrowsPanelNode = new ArrowsPanelNode( pendulumLabModel.property( 'isVelocityVisible' ),
      pendulumLabModel.property( 'isAccelerationVisible' ) );
    arrowsPanelNode.centerX = arrowsPanelNode.width / 2 + SCREEN_PADDING.LEFT;
    arrowsPanelNode.centerY = arrowsPanelNode.height / 2 + SCREEN_PADDING.TOP;
    this.insertChild( 1, arrowsPanelNode );

    // move energyGraphNode on the bottom
    this.energyGraphNode.centerY += (arrowsPanelNode.height + 8);
  }

  return inherit( EnergyView, LabView );
} );