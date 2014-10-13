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
  var ScreenView = require( 'JOIST/ScreenView' );

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

    this.addChild( new ProtractorNode( {x: this.layoutBounds.width / 2, y: this.layoutBounds.height * 0.045} ) );
  }

  return inherit( ScreenView, PendulumLabView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );