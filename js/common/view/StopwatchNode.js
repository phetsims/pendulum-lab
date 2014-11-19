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
   * @param {PropertySet} stopwatchModel - Model of stopwatch
   * @param {ModelViewTransform2} mvt
   * @param {Bounds2} layoutBounds - Bounds of screen view
   * @param {Bounds2} toolsControlPanelNodeBounds - Bounds of tool control panel. Necessary to set relative position of stopwatch.
   * @constructor
   */
  function StopwatchNode( stopwatchModel, mvt, layoutBounds, toolsControlPanelNodeBounds ) {
    var self = this;
    Timer.call( this, stopwatchModel.property( 'elapsedTime' ), stopwatchModel.property( 'isRunning' ) );

    this.centerX = toolsControlPanelNodeBounds.maxX - this.width / 2;
    this.centerY = toolsControlPanelNodeBounds.minY - this.height / 2 - 5;

    // add drag and drop events
    this.addInputListener( new MovableDragHandler( {
      locationProperty: stopwatchModel.property( 'location' ),
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    }, mvt ) );

    // add update of node location
    stopwatchModel.property( 'location' ).lazyLink( function( location ) {
      self.center = location;
    } );

    // set visibility observer
    stopwatchModel.property( 'isVisible' ).linkAttribute( this, 'visible' );
  }

  return inherit( Timer, StopwatchNode );
} );