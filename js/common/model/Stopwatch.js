// Copyright 2014-2019, University of Colorado Boulder

/**
 * Stopwatch model in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MovableComponent = require( 'PENDULUM_LAB/common/model/MovableComponent' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );

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
