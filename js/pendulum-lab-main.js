// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import EnergyScreen from './energy/EnergyScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import PendulumLabStrings from './PendulumLabStrings.js';

const pendulumLabTitleStringProperty = PendulumLabStrings[ 'pendulum-lab' ].titleStringProperty;

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

simLauncher.launch( () => {
  const sim = new Sim( pendulumLabTitleStringProperty, [ new IntroScreen(), new EnergyScreen(), new LabScreen() ], simOptions );
  sim.start();
} );