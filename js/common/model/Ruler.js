// Copyright 2014-2017, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableComponent = require( 'PENDULUM_LAB/common/model/MovableComponent' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

  /**
   * @constructor
   *
   * @param {boolean} isInitiallyVisible
   */
  function Ruler( isInitiallyVisible ) {
    MovableComponent.call( this, isInitiallyVisible );

    // @public (read-only) - Meters
    this.length = 1;
  }

  pendulumLab.register( 'Ruler', Ruler );

  return inherit( MovableComponent, Ruler );
} );
