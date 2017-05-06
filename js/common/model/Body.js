// Copyright 2014-2015, University of Colorado Boulder

/**
 * Body model for gravitational acceleration
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

  // strings
  var customString = require( 'string!PENDULUM_LAB/custom' );
  var earthString = require( 'string!PENDULUM_LAB/earth' );
  var jupiterString = require( 'string!PENDULUM_LAB/jupiter' );
  var moonString = require( 'string!PENDULUM_LAB/moon' );
  var planetXString = require( 'string!PENDULUM_LAB/planetX' );

  /**
   * Constructor for bodies
   *
   * @param {string} title - Title of body.
   * @param {number|null} gravity - Gravity acceleration on body (m/s^2) if defined.
   * @constructor
   */
  function Body( title, gravity ) {
    // @public {string} (read-only) - Name of the body
    this.title = title;

    // @public {number|null} (read-only) - Gravitation acceleration (if available) in meters/second^2
    this.gravity = gravity;
  }

  pendulumLab.register( 'Body', Body );

  Body.MOON = new Body( moonString, 1.62 );
  Body.EARTH = new Body( earthString, 9.81 );
  Body.JUPITER = new Body( jupiterString, 24.79 );
  Body.PLANET_X = new Body( planetXString, 14.2 );
  Body.CUSTOM = new Body( customString, null );

  // array of all the bodies used in the simulation.
  Body.bodies = [
    Body.MOON,
    Body.EARTH,
    Body.JUPITER,
    Body.PLANET_X,
    Body.CUSTOM
  ];

  return Body;
} );
