// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyScreen = require( 'PENDULUM_LAB/energy/EnergyScreen' );
  var IntroScreen = require( 'PENDULUM_LAB/intro/IntroScreen' );
  var LabScreen = require( 'PENDULUM_LAB/lab/LabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var pendulumLabTitleString = require( 'string!PENDULUM_LAB/pendulum-lab.title' );

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
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( pendulumLabTitleString, [ new IntroScreen(), new EnergyScreen(), new LabScreen() ], simOptions );
    sim.start();
  } );
} );