// Copyright 2014-2019, University of Colorado Boulder

/**
 * Stopwatch node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );

  /**
   * @constructor
   *
   * @param {Stopwatch} stopwatch - Model of stopwatch.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   */
  function StopwatchNode( stopwatch, layoutBounds ) {
    const self = this;
    TimerNode.call( this, stopwatch.elapsedTimeProperty, stopwatch.isRunningProperty );
    this.touchArea = this.localBounds.dilated( 5 );

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

  return inherit( TimerNode, StopwatchNode );
} );
