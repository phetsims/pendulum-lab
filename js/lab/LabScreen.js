//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'PENDULUM_LAB/lab/model/LabModel' );
  var LabView = require( 'PENDULUM_LAB/lab/view/LabView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var LabString = require( 'string!PENDULUM_LAB/tab.lab' );

  /**
   * @constructor
   */
  function LabScreen( screenshotImage ) {

    // icon for screen
    var icon = Rectangle.rect( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'white'
    } );

    // model coordinates are the same as view coordinates
    var mvt = ModelViewTransform2.createIdentity();

    Screen.call( this, LabString, icon,
      function() { return new LabModel(); },
      function( model ) { return new LabView( model, mvt, screenshotImage ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, LabScreen );
} );