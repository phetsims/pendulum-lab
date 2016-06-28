// Copyright 2014-2015, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );

  /**
   * creates a ruler with length of 2 meters
   * @constructor
   */
  function Ruler() {
    Movable.call( this, {
      isVisible: true // flag to control ruler visibility
    } );


    this.length = 2; // @public (read-only) length of ruler in meters
    
  }

  pendulumLab.register( 'Ruler', Ruler );

  return inherit( Movable, Ruler );
} );