// Copyright 2014-2022, University of Colorado Boulder

/**
 *  Ruler node in 'Pendulum Lab' simulation.
 *  Ruler is rotated 90 degrees.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';
import PendulumLabConstants from '../PendulumLabConstants.js';

const rulerUnitsString = PendulumLabStrings.rulerUnits;

// constants
const RULER_HEIGHT = 34;
const TICK_INTERVAL = 5; // tick interval in cm

class PendulumLabRulerNode extends RulerNode {
  /**
   * @param {Ruler} ruler - Model for ruler.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} layoutBounds - Bounds of screen view
   */
  constructor( ruler, modelViewTransform, layoutBounds ) {

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

    super( rulerWidth, RULER_HEIGHT, tickWidth, rulerTicks, rulerUnitsString, {
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
    this.dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      useParentOffset: true,
      dragBoundsProperty: new Property( layoutBounds.erodedXY( this.width / 2, this.height / 2 ) )
    } );

    // add drag and drop events
    this.addInputListener( this.dragListener );

    // add update of node position
    ruler.positionProperty.lazyLink( position => {
      // because it's initially null, and will be null on a reset
      if ( position ) {
        this.center = position;
      }
    } );

    // set visibility observer
    ruler.isVisibleProperty.linkAttribute( this, 'visible' );
  }
}

pendulumLab.register( 'PendulumLabRulerNode', PendulumLabRulerNode );
export default PendulumLabRulerNode;
