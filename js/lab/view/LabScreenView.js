// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main view node for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const ArrowVisibilityPanel = require( 'PENDULUM_LAB/lab/view/ArrowVisibilityPanel' );
  const EnergyScreenView = require( 'PENDULUM_LAB/energy/view/EnergyScreenView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const PeriodTimerNode = require( 'PENDULUM_LAB/lab/view/PeriodTimerNode' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   */
  function LabScreenView( model ) {
    EnergyScreenView.call( this, model, {
      hasGravityTweakers: true,
      hasPeriodTimer: true
    } );

    // create arrow panel node to the bottom layer
    var arrowsPanelNode = new ArrowVisibilityPanel( model.isVelocityVisibleProperty, model.isAccelerationVisibleProperty, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );
    this.arrowsPanelLayer.addChild( arrowsPanelNode );

    var periodTimerNode = new PeriodTimerNode( model.periodTimer, model.pendula[ 1 ].isVisibleProperty, this.layoutBounds );
    this.periodTimerLayer.addChild( periodTimerNode );

    // layout the nodes
    periodTimerNode.right = this.rightPanelsContainer.left - 10;
    periodTimerNode.centerY = this.stopwatchNode.centerY;
    // move energyGraphNode to the bottom
    this.energyGraphNode.top = arrowsPanelNode.bottom + PendulumLabConstants.PANEL_PADDING;

    model.periodTimer.setInitialLocationValue( periodTimerNode.center );

    // set dynamical dragBounds to keep the periodTimer within the visibleBounds
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      periodTimerNode.movableDragHandler.dragBounds = visibleBounds.erodedXY( periodTimerNode.width / 2, periodTimerNode.height / 2 );
    } );

    this.resizeEnergyGraphToFit();
  }

  pendulumLab.register( 'LabScreenView', LabScreenView );

  return inherit( EnergyScreenView, LabScreenView );
} );
