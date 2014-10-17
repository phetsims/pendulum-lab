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
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Planet = require( 'PENDULUM_LAB/common/model/Planet' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );

  // strings
  var EarthString = require( 'string!PENDULUM_LAB/earth' );
  var JupiterString = require( 'string!PENDULUM_LAB/jupiter' );
  var MoonString = require( 'string!PENDULUM_LAB/moon' );
  var PlanetXString = require( 'string!PENDULUM_LAB/planetX' );

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
      new Pendulum( 1, 2, PendulumLabConstants.FIRST_PENDULUM_COLOR ),
      new Pendulum( 0.5, 1, PendulumLabConstants.SECOND_PENDULUM_COLOR )
    ];

    this.planetModels = [
      new Planet( MoonString, 1.62 ), // moon
      new Planet( EarthString, 9.81 ), // earth
      new Planet( JupiterString, 24.79 ), // jupiter
      new Planet( PlanetXString, 14.2 ) // planet X
    ];

    this.gravityRange = new Range( 0, 25, 9.81 );
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