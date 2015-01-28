// Copyright 2002-2014, University of Colorado Boulder

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
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  // strings
  var rulerUnitsString = require( 'string!PENDULUM_LAB/rulerUnits' );

  // constants
  var FONT = new PhetFont( 10 );
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;
  var TICK_INTERVAL = 10; // tick interval in cm

  /**
   * @param {PropertySet} rulerModel - Model for ruler.
   * @param {Function} metersToPixels - Function to convert meters to pixels.
   * @param {ModelViewTransform2} mvt
   * @param {Bounds2} layoutBounds - Bounds of screen view
   * @constructor
   */
  function PendulumLabRulerNode( rulerModel, metersToPixels, mvt, layoutBounds ) {
    var self = this;

    // create tick labels
    var rulerTicks = [ '' ]; // zero tick is not labeled
    for ( var currentTick = TICK_INTERVAL, tickLabel; currentTick < rulerModel.length * 100; currentTick += TICK_INTERVAL ) {
      tickLabel = currentTick % (2 * TICK_INTERVAL) ? '' : currentTick.toString();
      rulerTicks.push( tickLabel );
    }
    rulerTicks.push( '' );

    // define ruler params in pixels
    var rulerWidth = metersToPixels( rulerModel.length );
    var tickWidth = rulerWidth / (rulerTicks.length - 1);

    RulerNode.call( this, rulerWidth, 34, tickWidth, rulerTicks, rulerUnitsString, { // -1px to
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

    this.rotate( Math.PI / 2 );

    this.centerX = layoutBounds.minX + SCREEN_PADDING.TOP + this.width / 2;
    this.centerY = layoutBounds.minY + SCREEN_PADDING.LEFT + this.height / 2 + 10;

    // add drag and drop events
    this.addInputListener( new MovableDragHandler( {
      locationProperty: rulerModel.property( 'location' ),
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
    }, mvt ) );

    // add update of node location
    rulerModel.property( 'location' ).lazyLink( function( location ) {
      self.center = location;
    } );

    // set visibility observer
    rulerModel.property( 'isVisible' ).linkAttribute( this, 'visible' );
  }

  return inherit( RulerNode, PendulumLabRulerNode );
} );