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
  var PeriodTimerNode = require( 'PENDULUM_LAB/lab/view/PeriodTimerNode' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );

  // strings
  var periodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function LabView( pendulumLabModel, modelViewTransform ) {
    EnergyView.call( this, pendulumLabModel, modelViewTransform );

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

    // add period timer node
    var periodTimerNode = new PeriodTimerNode( pendulumLabModel.periodTimer, pendulumLabModel.pendulums[ 1 ].isVisibleProperty, this.layoutBounds );
    periodTimerNode.centerX = this.slidersPanelNode.bounds.minX - periodTimerNode.width / 2 - 10;
    periodTimerNode.centerY = this.stopwatchNode.centerY;
    this.periodTimerLayer.addChild( periodTimerNode );

    // change label for period timer
    this.toolsControlPanelNode.setLabelText( 2, periodTimerString );

    pendulumLabModel.periodTimer.setInitialLocationValue( periodTimerNode.center );
  }

  return inherit( EnergyView, LabView );
} );