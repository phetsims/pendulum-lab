// Copyright 2002-2014, University of Colorado Boulder

/**
 * Stopwatch node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Timer = require( 'SCENERY_PHET/Timer' );

  /**
   * @param {PropertySet} stopwatch - Model of stopwatch.
   * @param {ModelViewTransform2} mvt
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Bounds2} toolsControlPanelNodeBounds - Bounds of tool control panel. Necessary to set relative position of stopwatch.
   * @constructor
   */
  function StopwatchNode( stopwatch, mvt, layoutBounds, toolsControlPanelNodeBounds ) {
    var self = this;
    Timer.call( this, stopwatch.elapsedTimeProperty, stopwatch.isRunningProperty );

    this.centerX = toolsControlPanelNodeBounds.maxX - this.width / 2;
    this.centerY = toolsControlPanelNodeBounds.minY - this.height / 2 - 5;

    // add drag and drop events
    this.addInputListener( new MovableDragHandler( {
      locationProperty: stopwatch.locationProperty,
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    }, mvt ) );

    // add update of node location
    stopwatch.locationProperty.lazyLink( function( location ) {
      self.center = location;
    } );

    // set visibility observer
    stopwatch.isVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Timer, StopwatchNode );
} );