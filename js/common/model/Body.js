// Copyright 2002-2014, University of Colorado Boulder

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
   * @param {string} title of body.
   * @param {number} gravity acceleration of body.
   * @constructor
   */
  function Body( title, gravity ) {
    // set title
    this.title = title;

    // set gravity acceleration
    this.gravity = gravity;
  }

  return {
    MOON: new Body( moonString, 1.62 ),
    EARTH: new Body( earthString, 9.81 ),
    JUPITER: new Body( jupiterString, 24.79 ),
    PLANET_X: new Body( planetXString, 14.2 ),
    CUSTOM: new Body( customString )
  };
} );