// Copyright 2014-2026, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import MovableComponent from './MovableComponent.js';

class Stopwatch extends MovableComponent {
  /**
   * @param {boolean} initiallyVisible
   */
  constructor( initiallyVisible ) {
    assert && assert( typeof initiallyVisible === 'boolean' );

    super( initiallyVisible );

    // @public {Property.<boolean>}
    this.isRunningProperty = new BooleanProperty( false );

    // @public {Property.<number>} passed time
    this.elapsedTimeProperty = new NumberProperty( 0 );
  }

  /**
   * Resets the stopwatch
   * @public
   */
  reset() {
    super.reset();

    this.isRunningProperty.reset();
    this.elapsedTimeProperty.reset();
  }
}

export default Stopwatch;
