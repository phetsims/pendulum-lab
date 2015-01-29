// Copyright 2002-2014, University of Colorado Boulder

/**
 * Single planet model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function() {
  'use strict';

  /**
   * @param {string} name of planet.
   * @param {string} title of planet.
   * @param {number} gravity acceleration of planet.
   * @constructor
   */
  function Planet( name, title, gravity ) {
    // set name
    this.name = name;

    // set title
    this.title = title;

    // set gravity acceleration
    this.gravity = gravity;
  }

  return Planet;
} );