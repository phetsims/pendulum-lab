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
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @constructor
   */
  function LabView( pendulumLabModel, screenshotImage ) {
    PendulumLabView.call( this, pendulumLabModel, screenshotImage );

    // add friction slider into slider control panel node
    this.sliderControlPanelNode.addSlider( new FrictionSliderNode( pendulumLabModel.property( 'friction' ), pendulumLabModel.frictionRange ) );

    // add energy graph node
    this.addChild( new VBox( {
      spacing: 10,
      children: [
        new ArrowsPanelNode(
          pendulumLabModel.property( 'isVelocityVisible' ),
          pendulumLabModel.property( 'isAccelerationVisible' )
        ),
        new EnergyGraphNode( pendulumLabModel.property( 'energyGraphMode' ) )
      ],
      x: 23,
      y: 21
    } ) );
  }

  return inherit( PendulumLabView, LabView );
} );