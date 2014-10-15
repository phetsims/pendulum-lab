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
  var Range = require( 'DOT/Range' );

  /**
   * @param {number} mass of pendulum, kg
   * @param {number} length of pendulum, m
   * @param {string} color of pendulum
   * @constructor
   */
  function Pendulum( mass, length, color ) {
    var self = this;

    PropertySet.call( this, {
      angle: 0, // value of the angular displacement
      length: length, // length of pendulum
      mass: mass, // mass of pendulum
      isUserControlled: false, // flag: is pendulum currently dragging
      isTickVisible: false  // flag: is pendulum tick visible on protractor
    } );

    this.color = color;

    // additional properties for pendulum length
    this.lengthOptions = {
      range: new Range( 0.5, 2.5, length ), // possible length range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // additional properties for pendulum mass
    this.massOptions = {
      range: new Range( 0.1, 2.1, mass ), // possible mass range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // make tick on protractor visible after first drag
    this.property( 'isUserControlled' ).once( function() {
      self.isTickVisible = true;
    } );
  }

  return inherit( PropertySet, Pendulum );
} );