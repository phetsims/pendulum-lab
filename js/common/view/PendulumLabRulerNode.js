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
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );

  // strings
  var rulerUnitsString = require( 'string!PENDULUM_LAB/rulerUnits' );

  // constants
  var FONT = new PhetFont( 12 );
  var RULER_TICK_WIDTH = 34;
  var RULER_TICKS = ['', '20', '40', '60', '80', '100', '120', '140', '180'];
  var RULER_SIZE = new Dimension2( RULER_TICK_WIDTH * RULER_TICKS.length, 38 );

  /**
   * @param {PropertySet} rulerModel - Model for ruler.
   * @param {ModelViewTransform2} mvt
   * @param {Bounds2} layoutBounds - Bounds of screen view
   * @param {Bounds2} toolsControlPanelNodeBounds - Bounds of tool control panel. Necessary to set relative position of ruler.
   * @constructor
   */
  function PendulumLabRulerNode( rulerModel, mvt, layoutBounds, toolsControlPanelNodeBounds ) {
    var self = this;

    RulerNode.call( this, RULER_SIZE.width, RULER_SIZE.height, RULER_TICK_WIDTH, RULER_TICKS, rulerUnitsString, {
      majorTickFont: FONT,
      unitsFont: FONT,
      insetsWidth: 0,
      unitsMajorTickIndex: RULER_TICKS.length - 1,
      minorTicksPerMajorTick: 1,
      backgroundFill: 'rgb( 231, 232, 233 )'
    } );

    this.cursor = 'pointer';
    this.rotate( Math.PI / 2 );

    this.centerX = toolsControlPanelNodeBounds.minX + this.width / 2;
    this.centerY = toolsControlPanelNodeBounds.minY - this.height / 2 - 10;

    // set initial value for ruler 'location' property
    rulerModel.setInitialLocationValue( this.center );

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