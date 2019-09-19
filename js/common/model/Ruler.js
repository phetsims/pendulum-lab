// Copyright 2014-2017, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const MovableComponent = require( 'PENDULUM_LAB/common/model/MovableComponent' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

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
