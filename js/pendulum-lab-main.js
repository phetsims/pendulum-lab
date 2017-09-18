// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var IntroScreen = require( 'PENDULUM_LAB/intro/IntroScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var pendulumLabTitleString = require( 'string!PENDULUM_LAB/pendulum-lab.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Amy Rouinfar',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ethan Johnson, Elise Morgan, Liam Mulhall, Oliver Orejola, Ben Roberts, Bryan Yoelin',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this ' +
              'simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( pendulumLabTitleString, [ new IntroScreen() ], simOptions );
    sim.start();
  } );
} );
