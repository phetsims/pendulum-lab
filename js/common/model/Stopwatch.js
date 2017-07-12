// Copyright 2014-2015, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableComponent = require( 'PENDULUM_LAB/common/model/MovableComponent' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

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

  return inherit( MovableComponent, Stopwatch, {
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
} );
