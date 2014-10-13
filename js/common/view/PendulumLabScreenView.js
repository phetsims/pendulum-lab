//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @constructor
   */
  function PendulumLabScreenView( pendulumLabModel, screenshotImage ) {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 1024, 618 )
    } );

    var image = new Image( screenshotImage );
    image.scale( this.layoutBounds.width / image.width );
    this.addChild( image );
  }

  return inherit( ScreenView, PendulumLabScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );