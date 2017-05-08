// Copyright 2014-2015, University of Colorado Boulder

/**
 * Ruler model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );

  /**
   * creates a ruler with length of 1 meter
   * @constructor
   */
  function Ruler() {
    Movable.call( this );

    // @public {Property.<boolean>}
    // flag to control ruler visibility
    this.isVisibleProperty = new BooleanProperty( true );

    this.length = 1; // @public (read-only) length of ruler in meters

  }

  pendulumLab.register( 'Ruler', Ruler );

  return inherit( Movable, Ruler, {
    /**
     * reset
     * @public
     */
    reset: function() {
      Movable.prototype.reset.call( this );
      this.isVisibleProperty.reset();
    }
  } );
} );
