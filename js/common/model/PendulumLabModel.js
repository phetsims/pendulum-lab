//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model constructor for 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Pendulum = require( 'PENDULUM_LAB/common/model/Pendulum' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for PendulumLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function PendulumLabModel() {
    PropertySet.call( this, {
      gravity: 9.81, // gravitational acceleration
      timeSpeed: 1, // speed of time ticking
      numberOfPendulums: 1, // number of visible pendulums,
      play: false, // flag: controls running of time
      isRulerVisible: true, // flag: controls visibility of ruler
      isStopwatchVisible: false, // flag: controls visibility of stopwatch
      isPeriodTraceVisible: false // flag: controls visibility of period trace timer
    } );

    this.pendulumModels = [
      new Pendulum( 1, 2, 'rgb( 0, 0, 255 )' ), // blue pendulum
      new Pendulum( 0.5, 1, 'rgb( 255, 0, 0 )' ) // red pendulum
    ];
  }

  return inherit( PropertySet, PendulumLabModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    },

    // handler for step button
    stepManual: function() {

    }
  } );
} );