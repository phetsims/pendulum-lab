// Copyright 2014-2015, University of Colorado Boulder

/**
 * Energy graph modes in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

  var EnergyGraphMode = Object.freeze( {
    ONE: 'One',
    TWO: 'Two'
  } );

  pendulumLab.register( 'EnergyGraphMode', EnergyGraphMode );

  return EnergyGraphMode;
} );