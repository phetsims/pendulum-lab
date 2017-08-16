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
      leadDesign: 'Michael Dubson, Amy Rouinfar',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this ' +
              'simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( pendulumLabTitleString, [ new IntroScreen(), new EnergyScreen(), new LabScreen() ], simOptions );
    sim.start();
  } );
} );
