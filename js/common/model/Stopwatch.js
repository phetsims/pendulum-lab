// Copyright 2014-2020, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import pendulumLab from '../../pendulumLab.js';
import MovableComponent from './MovableComponent.js';

/**
 * @constructor
 *
 * @param {boolean} initiallyVisible
 */
function Stopwatch( initiallyVisible ) {
  assert && assert( typeof initiallyVisible === 'boolean' );

  MovableComponent.call( this, initiallyVisible );

  // @public {Property.<boolean>}
  this.isRunningProperty = new BooleanProperty( false );

  // @public {Property.<number>} passed time
  this.elapsedTimeProperty = new NumberProperty( 0 );
}

pendulumLab.register( 'Stopwatch', Stopwatch );

inherit( MovableComponent, Stopwatch, {
  /**
   * Resets the stopwatch
   * @public
   */
  reset: function() {
    MovableComponent.prototype.reset.call( this );

    this.isRunningProperty.reset();
    this.elapsedTimeProperty.reset();
  }
} );

export default Stopwatch;