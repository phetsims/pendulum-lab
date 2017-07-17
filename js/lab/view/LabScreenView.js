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
  var EnergyScreenView = require( 'PENDULUM_LAB/energy/view/EnergyScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PeriodTimerNode = require( 'PENDULUM_LAB/lab/view/PeriodTimerNode' );

  // strings
  var periodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   */
  function LabScreenView( model, energyGraphHeight ) {
    EnergyScreenView.call( this, model, energyGraphHeight, {
      includeGravityTweakers: true
    } );

    // create arrow panel node to the bottom layer
    var arrowsPanelNode = new ArrowsPanelNode( model.isVelocityVisibleProperty, model.isAccelerationVisibleProperty, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );

    // create period timer node
    var periodTimerNode = new PeriodTimerNode( model.periodTimer, model.pendula[ 1 ].isVisibleProperty, this.layoutBounds );

    // add the various nodes
    this.arrowsPanelLayer.addChild( arrowsPanelNode );
    this.periodTimerLayer.addChild( periodTimerNode );

    // layout the nodes
    periodTimerNode.right = this.slidersPanelNode.left - 10;
    periodTimerNode.centerY = this.stopwatchNode.centerY;
    this.energyGraphNode.top = arrowsPanelNode.bottom + PendulumLabConstants.PANEL_PADDING; // move energyGraphNode to the bottom

    // change label for period timer
    this.toolsControlPanelNode.setLabelText( 2, periodTimerString );

    model.periodTimer.setInitialLocationValue( periodTimerNode.center );

    // set dynamical dragBounds to keep the periodTimer within the visibleBounds
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      periodTimerNode.movableDragHandler.setDragBounds( visibleBounds.erodedXY( periodTimerNode.width / 2, periodTimerNode.height / 2 ) );
    } );
  }

  pendulumLab.register( 'LabScreenView', LabScreenView );

  return inherit( EnergyScreenView, LabScreenView );
} );
