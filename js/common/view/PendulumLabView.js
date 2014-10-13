//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
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

    // add tools control panel
    this.addChild( new ToolsControlPanelNode(
      pendulumLabModel.property( 'isRuler' ),
      pendulumLabModel.property( 'isStopwatch' ),
      pendulumLabModel.property( 'isPeriodTrace' ),
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