// Copyright 2014-2015, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Andrey Zelenkov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * Constructor for movable objects.
   * @constructor
   */
  function Movable(  ) {
    // @public {Property.<Vector2||null>}
    // initial value will be set in view, after calculating all bounds of nodes
    this.locationProperty = new Property( null );
  }

  pendulumLab.register( 'Movable', Movable );

  return inherit( Object, Movable, {
    /**
     * Function that sets the initial location of a movable object and keeps an internal copy of it.
     * @public
     * @param {Vector2} initialLocation
     */
    setInitialLocationValue: function( initialLocation ) {

      // position to use for resetting
      // make a copy of the initial location vector
      this.initialLocation = initialLocation.copy();

      // set the location to the initial location
      this.locationProperty.value = this.initialLocation.copy();
    },

    /**
     * Reset function
     * @public
     */
    reset: function() {

      // Reset the location to the initial location
      this.locationProperty.value = this.initialLocation ? this.initialLocation.copy() : null;
    }
  } );
} );
