// Copyright 2014-2015, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   */
  function Stopwatch() {
    Movable.call( this );

    // @public {Property.<boolean>} flag to determine stopwatch state
    this.isVisibleProperty = new BooleanProperty( false );

    // @public {Property.<boolean>}
    this.isRunningProperty = new BooleanProperty( false );

    // @public {Property.<number>} passed time
    this.elapsedTimeProperty = new NumberProperty( 0 );

  }

  pendulumLab.register( 'Stopwatch', Stopwatch );

  return inherit( Movable, Stopwatch, {
    /**
     * Resets the stopwatch
     * @public
     */
    reset: function() {
      Movable.prototype.reset.call( this );
      this.isVisibleProperty.reset();
      this.isRunningProperty.reset();
      this.elapsedTimeProperty.reset();
    }
  } );
} );
