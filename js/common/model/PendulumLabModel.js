//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulumModel = require( 'PENDULUM_LAB/common/model/PendulumModel' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function PendulumLabModel() {
    PropertySet.call( this, {
      g: 9.81, // gravitational acceleration
      timeSpeed: 1, // speed of time ticking
      numberOfPendulums: 1, // number of visible pendulums
      isRuler: true, // flag: controls visibility of ruler
      isStopwatch: false, // flag: controls visibility of stopwatch
      isPeriodTrace: false // flag: controls visibility of period trace timer
    } );

    this.pendulumModels = [
      new PendulumModel( 1, 2, 'rgb( 0, 0, 255 )' ), // blue pendulum
      new PendulumModel( 0.5, 1, 'rgb( 255, 0, 0 )') // red pendulum
    ];
  }

  return inherit( PropertySet, PendulumLabModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    }
  } );
} );