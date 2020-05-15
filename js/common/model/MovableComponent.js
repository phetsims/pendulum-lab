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
import inherit from '../../../../phet-core/js/inherit.js';
import pendulumLab from '../../pendulumLab.js';

/**
 * @constructor
 *
 * @param {boolean} isInitiallyVisible
 */
function MovableComponent( isInitiallyVisible ) {
  // @public {Property.<Vector2|null>} - Initial value will be set in view, after calculating all bounds of nodes
  this.positionProperty = new Property( null );

  // @public {Property.<boolean>} flag to determine stopwatch state
  this.isVisibleProperty = new BooleanProperty( isInitiallyVisible );
}

pendulumLab.register( 'MovableComponent', MovableComponent );

inherit( Object, MovableComponent, {
  /**
   * Function that sets the initial position of a movable object and keeps an internal copy of it.
   * @public
   *
   * @param {Vector2} initialPosition
   */
  setInitialPositionValue: function( initialPosition ) {

    // position to use for resetting
    // make a copy of the initial position vector
    this.initialPosition = initialPosition.copy();

    // set the position to the initial position
    this.positionProperty.value = this.initialPosition.copy();
  },

  /**
   * Reset function
   * @public
   */
  reset: function() {

    // Reset the position to the initial position
    this.positionProperty.value = this.initialPosition ? this.initialPosition.copy() : null;

    this.isVisibleProperty.reset();
  }
} );

export default MovableComponent;
