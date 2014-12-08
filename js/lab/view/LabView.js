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

  // strings
  var PeriodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );

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
    this.insertChild( 3, arrowsPanelNode );

    // move energyGraphNode on the bottom
    this.energyGraphNode.centerY += (arrowsPanelNode.height + 8);

    // add period timer node
    var periodTimerNode = new PeriodTimerNode( pendulumLabModel.periodTimerModel, mvt, this.layoutBounds );
    periodTimerNode.centerX = this.slidersPanelNode.bounds.minX - periodTimerNode.width / 2 - 10;
    periodTimerNode.centerY = this.stopwatchNode.centerY;
    this.insertChild( this.indexOfChild( this.stopwatchNode ), periodTimerNode );

    // change label for period timer
    this.toolsControlPanelNode.setLabelText( 2, PeriodTimerString );

    pendulumLabModel.periodTimerModel.setInitialLocationValue( periodTimerNode.center );
  }

  return inherit( EnergyView, LabView );
} );