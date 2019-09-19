// Copyright 2014-2017, University of Colorado Boulder

/**
 * Body model for gravitational acceleration
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

  // strings
  const customString = require( 'string!PENDULUM_LAB/custom' );
  const earthString = require( 'string!PENDULUM_LAB/earth' );
  const jupiterString = require( 'string!PENDULUM_LAB/jupiter' );
  const moonString = require( 'string!PENDULUM_LAB/moon' );
  const planetXString = require( 'string!PENDULUM_LAB/planetX' );

  /**
   * @constructor
   *
   * @param {string} title
   * @param {number|null} gravity - Gravitational acceleration on body (m/s^2) if defined.
   */
  function Body( title, gravity ) {
    // @public {string} (read-only)
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
  Body.BODIES = [
    Body.MOON,
    Body.EARTH,
    Body.JUPITER,
    Body.PLANET_X,
    Body.CUSTOM
  ];

  // verify that enumeration is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Body ); }

  return Body;
} );
