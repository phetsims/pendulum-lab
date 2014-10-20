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
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @constructor
   */
  function EnergyView( pendulumLabModel, screenshotImage ) {
    PendulumLabView.call( this, pendulumLabModel, screenshotImage );

    // add friction slider into slider control panel node
    this.sliderControlPanelNode.addSlider( new FrictionSliderNode( pendulumLabModel.property( 'friction' ), pendulumLabModel.frictionRange ) );

    // add energy graph node
    this.addChild( new EnergyGraphNode( pendulumLabModel.property( 'energyGraphMode' ), {
      x: 23,
      y: 21
    } ) );
  }

  return inherit( PendulumLabView, EnergyView );
} );