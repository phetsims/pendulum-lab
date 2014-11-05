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
  var EnergyGraphNode = require( 'PENDULUM_LAB/energy/view/EnergyGraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var FrictionSliderNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/FrictionSliderNode' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function LabView( pendulumLabModel, mvt, screenshotImage ) {
    PendulumLabView.call( this, pendulumLabModel, mvt, screenshotImage );

    // add friction slider into slider control panel node
    this.sliderControlPanelNode.addSlider( new FrictionSliderNode( pendulumLabModel.property( 'friction' ), pendulumLabModel.frictionRange ) );

    // add arrow panel node to the bottom layer
    var arrowsPanelNode = new ArrowsPanelNode( pendulumLabModel.property( 'isVelocityVisible' ),
      pendulumLabModel.property( 'isAccelerationVisible' ) );
    arrowsPanelNode.centerX = arrowsPanelNode.width / 2 + SCREEN_PADDING.LEFT;
    arrowsPanelNode.centerY = arrowsPanelNode.height / 2 + SCREEN_PADDING.TOP;
    this.insertChild( 1, arrowsPanelNode );

    // add energy graph node to the bottom layer
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.pendulumModels, pendulumLabModel.property( 'energyGraphMode' ), pendulumLabModel.property( 'numberOfPendulums' ) );
    energyGraphNode.centerX = energyGraphNode.width / 2 + SCREEN_PADDING.LEFT;
    energyGraphNode.centerY = arrowsPanelNode.bounds.maxY + energyGraphNode.height / 2 + 8;
    this.insertChild( 1, energyGraphNode );
  }

  return inherit( PendulumLabView, LabView );
} );