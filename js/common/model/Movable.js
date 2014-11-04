// Copyright 2002-2014, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Constructor
   * @constructor
   */
  function Movable( properties ) {
    PropertySet.call( this, _.extend( {
      location: null // initial value will be set in view, after calculating all bounds of nodes (type: Vector2)
    }, properties ) );
  }

  return inherit( PropertySet, Movable, {
    setInitialLocationValue: function( initialLocation ) {
      this.property( 'location' ).storeInitialValue( initialLocation.copy() );
      this.property( 'location' ).storeValue( initialLocation.copy() );
    }
  } );
} );
