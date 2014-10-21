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
  function EnergyView( pendulumLabModel, mvt, screenshotImage ) {
    PendulumLabView.call( this, pendulumLabModel, mvt, screenshotImage );

    // add friction slider into slider control panel node
    this.sliderControlPanelNode.addSlider( new FrictionSliderNode( pendulumLabModel.property( 'friction' ), pendulumLabModel.frictionRange ) );

    // add energy graph node
    var energyGraphNode = new EnergyGraphNode( pendulumLabModel.property( 'energyGraphMode' ) );
    energyGraphNode.centerX = energyGraphNode.width / 2 + SCREEN_PADDING.LEFT;
    energyGraphNode.centerY = energyGraphNode.height / 2 + SCREEN_PADDING.TOP;
    this.addChild( energyGraphNode );
  }

  return inherit( PendulumLabView, EnergyView );
} );