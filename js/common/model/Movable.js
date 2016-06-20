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
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Constructor for movable objects.
   *
   * @param {Object} [properties] for extending by this constructor.
   * @constructor
   */
  function Movable( properties ) {
    PropertySet.call( this, _.extend( {
      location: null // {Vector2} initial value will be set in view, after calculating all bounds of nodes
    }, properties ) );
  }

  pendulumLab.register( 'Movable', Movable );

  return inherit( PropertySet, Movable, {
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
      this.location = this.initialLocation.copy();
    },

    /**
     * Reset function
     * @public
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );

      // Reset the location to the initial location
      this.location = this.initialLocation ? this.initialLocation.copy() : null;
    }
  } );
} );
