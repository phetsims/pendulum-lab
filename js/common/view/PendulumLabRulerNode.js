// Copyright 2014-2015, University of Colorado Boulder

/**
 *  Ruler node in 'Pendulum Lab' simulation.
 *  Ruler is rotated 90 degrees.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  // strings
  var rulerUnitsString = require( 'string!PENDULUM_LAB/rulerUnits' );

  // constants
  var FONT = new PhetFont( 10 );
  var RULER_HEIGHT = 34;
  var TICK_INTERVAL = 5; // tick interval in cm

  /**
   * @constructor
   *
   * @param {Ruler} ruler - Model for ruler.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} layoutBounds - Bounds of screen view
   */
  function PendulumLabRulerNode( ruler, modelViewTransform, layoutBounds ) {
    var self = this;

    // create tick labels
    var tickLabel;
    var rulerTicks = [ '' ]; // zero tick is not labeled
    for ( var currentTick = TICK_INTERVAL; currentTick < ruler.length * 100; currentTick += TICK_INTERVAL ) {
      // if the current tick is a multiple of twice the Tick interval then label it as such otherwise it is not labeled.
      tickLabel = currentTick % ( 2 * TICK_INTERVAL ) ? '' : currentTick.toString();
      rulerTicks.push( tickLabel );
    }
    rulerTicks.push( '' ); // last tick is not labeled

    // define ruler params in view coordinates
    var rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );
    var tickWidth = rulerWidth / ( rulerTicks.length - 1 );

    RulerNode.call( this, rulerWidth, RULER_HEIGHT, tickWidth, rulerTicks, rulerUnitsString, {
      backgroundFill: 'rgb( 237, 225, 121 )',
      cursor: 'pointer',
      insetsWidth: 0,
      majorTickFont: FONT,
      majorTickHeight: 12,
      minorTickHeight: 6,
      unitsFont: FONT,
      unitsMajorTickIndex: rulerTicks.length - 3,
      minorTicksPerMajorTick: 4,
      tickMarksOnBottom: false
    } );

    // make it a vertical ruler
    this.rotate( Math.PI / 2 );

    // @public
    this.movableDragHandler = new MovableDragHandler( ruler.locationProperty, {
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    } );

    // add drag and drop events
    this.addInputListener( this.movableDragHandler );

    // add update of node location
    ruler.locationProperty.lazyLink( function( location ) {
      // because it's initially null, and will be null on a reset
      if ( location ) {
        self.center = location;
      }
    } );

    // set visibility observer
    ruler.isVisibleProperty.linkAttribute( this, 'visible' );
  }

  pendulumLab.register( 'PendulumLabRulerNode', PendulumLabRulerNode );

  return inherit( RulerNode, PendulumLabRulerNode );
} );
