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
   * @param {Number} mass of pendulum, kg
   * @param {Number} length of pendulum, m
   * @param {String} color of pendulum
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