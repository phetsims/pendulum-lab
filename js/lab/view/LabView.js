//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FrictionSliderNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/FrictionSliderNode' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @constructor
   */
  function LabView( pendulumLabModel, screenshotImage ) {
    PendulumLabView.call( this, pendulumLabModel, screenshotImage );

    this.sliderControlPanelNode.addSlider( new FrictionSliderNode( pendulumLabModel.property( 'friction' ), pendulumLabModel.frictionRange ) );
  }

  return inherit( PendulumLabView, LabView );
} );