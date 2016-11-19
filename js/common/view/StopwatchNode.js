// Copyright 2014-2015, University of Colorado Boulder

/**
 * Stopwatch node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Timer = require( 'SCENERY_PHET/Timer' );

  /**
   * @param {Stopwatch} stopwatch - Model of stopwatch.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @constructor
   */
  function StopwatchNode( stopwatch, layoutBounds ) {
    var self = this;
    Timer.call( this, stopwatch.elapsedTimeProperty, stopwatch.isRunningProperty, { touchAreaDilation: 5 } );

    // @public
    this.movableDragHandler = new MovableDragHandler( stopwatch.locationProperty, {
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    } );

    // add drag and drop events
    this.addInputListener( this.movableDragHandler );

    // add update of node location
    stopwatch.locationProperty.lazyLink( function( location ) {
      // because it's initially null, and will be null on a reset
      if ( location ) {
        self.center = location;
      }
    } );

    // set visibility observer
    stopwatch.isVisibleProperty.linkAttribute( this, 'visible' );
  }

  pendulumLab.register( 'StopwatchNode', StopwatchNode );

  return inherit( Timer, StopwatchNode );
} );
