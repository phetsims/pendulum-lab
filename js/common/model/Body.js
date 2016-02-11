// Copyright 2014-2015, University of Colorado Boulder

/**
 * Single body model.
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
   * @constructor
   *
   * @param {string} Title of body.
   * @param {number|null} Gravity acceleration of body (m/s^2) if defined.
   */
  function Body( title, gravity ) {
    // @public [read-only]
    this.title = title;
    this.gravity = gravity;
  }

  Body.MOON = new Body( moonString, 1.62 );
  Body.EARTH = new Body( earthString, 9.81 );
  Body.JUPITER = new Body( jupiterString, 24.79 );
  Body.PLANET_X = new Body( planetXString, 14.2 );
  Body.CUSTOM = new Body( customString, null );

  Body.bodies = [
    Body.MOON,
    Body.EARTH,
    Body.JUPITER,
    Body.PLANET_X,
    Body.CUSTOM
  ];

  return Body;
} );