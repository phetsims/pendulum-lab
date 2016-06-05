// Copyright 2014-2015, University of Colorado Boulder

/**
 * Stopwatch node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Timer = require( 'SCENERY_PHET/Timer' );

  /**
   * @param {Stopwatch} stopwatch - Model of stopwatch.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Bounds2} toolsControlPanelNodeBounds - Bounds of tool control panel. Necessary to set relative position of stopwatch.
   * @constructor
   */
  function StopwatchNode( stopwatch, layoutBounds, toolsControlPanelNodeBounds ) {
    var self = this;
    Timer.call( this, stopwatch.elapsedTimeProperty, stopwatch.isRunningProperty );

    this.centerX = toolsControlPanelNodeBounds.maxX - this.width / 2;
    this.centerY = toolsControlPanelNodeBounds.minY - this.height / 2 - 5;

    // add drag and drop events
    this.addInputListener( new MovableDragHandler( stopwatch.locationProperty, {
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    } ) );

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