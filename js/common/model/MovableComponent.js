// Copyright 2014-2020, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Andrey Zelenkov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import pendulumLab from '../../pendulumLab.js';

class MovableComponent {
  /**
   * @param {boolean} isInitiallyVisible
   */
  constructor( isInitiallyVisible ) {
    // @public {Property.<Vector2|null>} - Initial value will be set in view, after calculating all bounds of nodes
    this.positionProperty = new Property( null );

    // @public {Property.<boolean>} flag to determine stopwatch state
    this.isVisibleProperty = new BooleanProperty( isInitiallyVisible );
  }

  /**
   * Function that sets the initial position of a movable object and keeps an internal copy of it.
   * @public
   *
   * @param {Vector2} initialPosition
   */
  setInitialPositionValue( initialPosition ) {

    // position to use for resetting
    // make a copy of the initial position vector
    this.initialPosition = initialPosition.copy();

    // set the position to the initial position
    this.positionProperty.value = this.initialPosition.copy();
  }

  /**
   * Reset function
   * @public
   */
  reset() {
    // Reset the position to the initial position
    this.positionProperty.value = this.initialPosition ? this.initialPosition.copy() : null;

    this.isVisibleProperty.reset();
  }
}

pendulumLab.register( 'MovableComponent', MovableComponent );

export default MovableComponent;
