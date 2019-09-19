// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const EnergyScreen = require( 'PENDULUM_LAB/energy/EnergyScreen' );
  const IntroScreen = require( 'PENDULUM_LAB/intro/IntroScreen' );
  const LabScreen = require( 'PENDULUM_LAB/lab/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const pendulumLabTitleString = require( 'string!PENDULUM_LAB/pendulum-lab.title' );

  const simOptions = {
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
    const sim = new Sim( pendulumLabTitleString, [ new IntroScreen(), new EnergyScreen(), new LabScreen() ], simOptions );
    sim.start();
  } );
} );
