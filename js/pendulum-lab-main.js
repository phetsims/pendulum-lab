//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author 0
 */
define( function( require ) {
  'use strict';

  // modules
  var PendulumLabScreen = require( 'PENDULUM_LAB/pendulum-lab/PendulumLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // images
  var screenshot1 = require( 'image!PENDULUM_LAB/pendulum-lab-screen-1.png' );
  var screenshot2 = require( 'image!PENDULUM_LAB/pendulum-lab-screen-2.png' );
  var screenshot3 = require( 'image!PENDULUM_LAB/pendulum-lab-screen-3.png' );

  // strings
  var simTitle = require( 'string!PENDULUM_LAB/pendulum-lab.name' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new PendulumLabScreen( screenshot1 ), new PendulumLabScreen( screenshot2 ), new PendulumLabScreen( screenshot3 ) ], simOptions );
    sim.start();
  } );
} );