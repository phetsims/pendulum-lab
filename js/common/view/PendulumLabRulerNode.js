// Copyright 2014-2020, University of Colorado Boulder

/**
 *  Ruler node in 'Pendulum Lab' simulation.
 *  Ruler is rotated 90 degrees.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import pendulumLabStrings from '../../pendulumLabStrings.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

const rulerUnitsString = pendulumLabStrings.rulerUnits;

// constants
const RULER_HEIGHT = 34;
const TICK_INTERVAL = 5; // tick interval in cm

/**
 * @constructor
 *
 * @param {Ruler} ruler - Model for ruler.
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Bounds2} layoutBounds - Bounds of screen view
 */
function PendulumLabRulerNode( ruler, modelViewTransform, layoutBounds ) {
  const self = this;

  // create tick labels
  let tickLabel;
  const rulerTicks = [ '' ]; // zero tick is not labeled
  for ( let currentTick = TICK_INTERVAL; currentTick < ruler.length * 100; currentTick += TICK_INTERVAL ) {
    // if the current tick is a multiple of twice the Tick interval then label it as such otherwise it is not labeled.
    tickLabel = currentTick % ( 2 * TICK_INTERVAL ) ? '' : currentTick.toString();
    rulerTicks.push( tickLabel );
  }
  rulerTicks.push( '' ); // last tick is not labeled

  // define ruler params in view coordinates
  const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );
  const tickWidth = rulerWidth / ( rulerTicks.length - 1 );

  RulerNode.call( this, rulerWidth, RULER_HEIGHT, tickWidth, rulerTicks, rulerUnitsString, {
    backgroundFill: 'rgb( 237, 225, 121 )',
    cursor: 'pointer',
    insetsWidth: 0,
    majorTickFont: PendulumLabConstants.RULER_FONT,
    majorTickHeight: 12,
    minorTickHeight: 6,
    unitsFont: PendulumLabConstants.RULER_FONT,
    unitsMajorTickIndex: rulerTicks.length - 3,
    minorTicksPerMajorTick: 4,
    tickMarksOnBottom: false
  } );

  // make it a vertical ruler
  this.rotate( Math.PI / 2 );

  // @public
  this.movableDragHandler = new MovableDragHandler( ruler.positionProperty, {
    dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 )
  } );

  // add drag and drop events
  this.addInputListener( this.movableDragHandler );

  // add update of node position
  ruler.positionProperty.lazyLink( function( position ) {
    // because it's initially null, and will be null on a reset
    if ( position ) {
      self.center = position;
    }
  } );

  // set visibility observer
  ruler.isVisibleProperty.linkAttribute( this, 'visible' );
}

pendulumLab.register( 'PendulumLabRulerNode', PendulumLabRulerNode );

inherit( RulerNode, PendulumLabRulerNode );
export default PendulumLabRulerNode;
