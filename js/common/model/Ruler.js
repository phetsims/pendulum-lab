// Copyright 2014-2026, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import MovableComponent from './MovableComponent.js';

class Ruler extends MovableComponent {
  /**
   * @param {boolean} isInitiallyVisible
   */
  constructor( isInitiallyVisible ) {
    super( isInitiallyVisible );

    // @public (read-only) - Meters
    this.length = 1;
  }
}

export default Ruler;
