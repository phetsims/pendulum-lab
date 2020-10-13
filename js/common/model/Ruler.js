// Copyright 2014-2020, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import pendulumLab from '../../pendulumLab.js';
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

pendulumLab.register( 'Ruler', Ruler );

export default Ruler;