// Copyright 2002-2014, University of Colorado Boulder

/**
 * Single planet model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // strings
  var customString = require( 'string!PENDULUM_LAB/custom' );
  var earthString = require( 'string!PENDULUM_LAB/earth' );
  var jupiterString = require( 'string!PENDULUM_LAB/jupiter' );
  var moonString = require( 'string!PENDULUM_LAB/moon' );
  var planetXString = require( 'string!PENDULUM_LAB/planetX' );

  /**
   * @param {string} title of planet.
   * @param {number} gravity acceleration of planet.
   * @constructor
   */
  function Planet( title, gravity ) {
    // set title
    this.title = title;

    // set gravity acceleration
    this.gravity = gravity;
  }

  return {
    MOON: new Planet( moonString, 1.62 ),
    EARTH: new Planet( earthString, 9.81 ),
    JUPITER: new Planet( jupiterString, 24.79 ),
    PLANET_X: new Planet( planetXString, 14.2 ),
    CUSTOM: new Planet( customString )
  };
} );