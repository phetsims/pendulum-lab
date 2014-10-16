//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumOptionsControlPanelNode = require( 'PENDULUM_LAB/common/view/pendulum-options-control-panel/PendulumOptionsControlPanelNode' );
  var PendulumSystemControlPanelNode = require( 'PENDULUM_LAB/common/view/PendulumSystemControlPanelNode' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ToolsControlPanelNode = require( 'PENDULUM_LAB/common/view/ToolsControlPanelNode' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @constructor
   */
  function PendulumLabView( pendulumLabModel, screenshotImage ) {
    ScreenView.call( this );

    var image = new Image( screenshotImage );
    image.scale( this.layoutBounds.width / image.width );
    //image.opacity = 0.25;
    this.addChild( image );

    // add protractor node
    this.addChild( new ProtractorNode( pendulumLabModel.pendulumModels, {
      x: this.layoutBounds.width / 2,
      y: this.layoutBounds.height * 0.045
    } ) );

    // add pendulum options control panel
    // TODO: fix x and y values
    this.addChild( new PendulumOptionsControlPanelNode(
      pendulumLabModel.pendulumModels,
      pendulumLabModel.property( 'numberOfPendulums' ),
      {
        x: this.layoutBounds.width * 0.965 - 135 - 135,
        y: this.layoutBounds.height * 0.045
      }
    ) );

    // add pendulum system control panel
    // TODO: fix x and y values
    this.addChild( new PendulumSystemControlPanelNode(
      pendulumLabModel.property( 'numberOfPendulums' ),
      pendulumLabModel.property( 'play' ),
      pendulumLabModel.property( 'timeSpeed' ),
      pendulumLabModel.stepManual.bind( pendulumLabModel ),
      {
        x: this.layoutBounds.width / 2 - 144,
        y: this.layoutBounds.height * 0.895 - 36
      }
    ) );

    // add tools control panel
    this.addChild( new ToolsControlPanelNode(
      pendulumLabModel.property( 'isRulerVisible' ),
      pendulumLabModel.property( 'isStopwatchVisible' ),
      pendulumLabModel.property( 'isPeriodTraceVisible' ),
      {
        x: this.layoutBounds.width * 0.03,
        bottom: this.layoutBounds.height * 0.895
      }
    ) );

    // add reset all button
    this.addChild( new ResetAllButton( {
      listener: function() {pendulumLabModel.reset();},
      right: this.layoutBounds.width * 0.965,
      bottom: this.layoutBounds.height * 0.915,
      scale: 0.75
    } ) );
  }

  return inherit( ScreenView, PendulumLabView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );