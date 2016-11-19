// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main view node for Lab screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var ArrowsPanelNode = require( 'PENDULUM_LAB/lab/view/ArrowsPanelNode' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PeriodTimerNode = require( 'PENDULUM_LAB/lab/view/PeriodTimerNode' );

  // strings
  var periodTimerString = require( 'string!PENDULUM_LAB/periodTimer' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} energyGraphHeight - Height tuned number for the energy graph
   * @constructor
   */
  function LabView( pendulumLabModel, modelViewTransform, energyGraphHeight ) {
    EnergyView.call( this, pendulumLabModel, modelViewTransform, energyGraphHeight, {
      includeGravityTweakers: true
    } );

    // create arrow panel node to the bottom layer
    var arrowsPanelNode = new ArrowsPanelNode( pendulumLabModel.isVelocityVisibleProperty,
      pendulumLabModel.isAccelerationVisibleProperty );

    // create period timer node
    var periodTimerNode = new PeriodTimerNode( pendulumLabModel.periodTimer, pendulumLabModel.pendulums[ 1 ].isVisibleProperty, this.layoutBounds );

    // add the various nodes
    this.arrowsPanelLayer.addChild( arrowsPanelNode );
    this.periodTimerLayer.addChild( periodTimerNode );

    // layout the nodes
    periodTimerNode.right = this.slidersPanelNode.left - 10;
    periodTimerNode.centerY = this.stopwatchNode.centerY;
    arrowsPanelNode.left = PendulumLabConstants.SCREEN_PADDING;
    arrowsPanelNode.top = PendulumLabConstants.SCREEN_PADDING;
    this.energyGraphNode.top = arrowsPanelNode.bottom + 8; // move energyGraphNode to the bottom

    // change label for period timer
    this.toolsControlPanelNode.setLabelText( 2, periodTimerString );

    pendulumLabModel.periodTimer.setInitialLocationValue( periodTimerNode.center );

    // set dynamical dragBounds to keep the periodTimer within the visibleBounds
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      periodTimerNode.movableDragHandler.setDragBounds( visibleBounds.erodedXY( periodTimerNode.width / 2, periodTimerNode.height / 2 ) );
    } );
  }

  pendulumLab.register( 'LabView', LabView );

  return inherit( EnergyView, LabView );
} );
