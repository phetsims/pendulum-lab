// Copyright 2002-2013, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {number} mass of pendulum, kg
   * @param {number} length of pendulum, m
   * @param {string} color of pendulum
   * @constructor
   */
  function PendulumModel( mass, length, color ) {
    var self = this;

    PropertySet.call( this, {
      mass: mass, // mass of pendulum
      length: length, // length of pendulum
      angle: 0, // value of the angular displacement
      isDragging: false, // flag: is pendulum currently dragging
      isTickVisible: false  // flag: is pendulum tick visible on protractor
    } );

    this.color = color;

    // make tick on protractor visible after first drag
    this.property( 'isDragging' ).once( function() {
      self.isTickVisible = true;
    } );
  }

  return inherit( PropertySet, PendulumModel );
} );