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
  var PeriodTimerNode = require( 'PENDULUM_LAB/lab/view/PeriodTimerNode' );
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

    var periodTraceNode = new PeriodTimerNode( pendulumLabModel.periodTraceModel, mvt, this.layoutBounds );
    periodTraceNode.centerX = this.energyGraphNode.bounds.maxX + periodTraceNode.width / 2 + 10;
    periodTraceNode.centerY = this.stopwatchNode.centerY;
    this.insertChild( this.indexOfChild( this.stopwatchNode ), periodTraceNode );

    pendulumLabModel.periodTraceModel.setInitialLocationValue( periodTraceNode.center );
  }

  return inherit( EnergyView, LabView );
} );