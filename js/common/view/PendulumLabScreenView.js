// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Plane from '../../../../scenery/js/nodes/Plane.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ClosestDragListener from '../../../../sun/js/ClosestDragListener.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import GlobalControlPanel from './GlobalControlPanel.js';
import PendulaNode from './PendulaNode.js';
import PendulumControlPanel from './PendulumControlPanel.js';
import PendulumLabProtractorNode from './PendulumLabProtractorNode.js';
import PendulumLabRulerNode from './PendulumLabRulerNode.js';
import PeriodTraceNode from './PeriodTraceNode.js';
import PlaybackControlsNode from './PlaybackControlsNode.js';
import ToolsPanel from './ToolsPanel.js';

/**
 * @constructor
 *
 * @param {PendulumLabModel} model
 * @param {Object} [options]
 */
function PendulumLabScreenView( model, options ) {
  ScreenView.call( this );

  // @private {PendulumLabModel}
  this.model = model;

  options = merge( {
    hasGravityTweakers: false,
    hasPeriodTimer: false
  }, options );

  const modelViewTransform = PendulumLabConstants.MODEL_VIEW_TRANSFORM;

  const pendulaNode = new PendulaNode( model.pendula, modelViewTransform, {
    isAccelerationVisibleProperty: model.isAccelerationVisibleProperty,
    isVelocityVisibleProperty: model.isVelocityVisibleProperty
  } );

  // create drag listener for the pendula
  const backgroundDragNode = new Plane();
  const dragListener = new ClosestDragListener( 0.15, 0 ); // 15cm from mass is OK for touch
  pendulaNode.draggableItems.forEach( function( draggableItem ) {
    dragListener.addDraggableItem( draggableItem );
  } );
  backgroundDragNode.addInputListener( dragListener );

  // @private {PeriodTraceNode}
  this.firstPeriodTraceNode = new PeriodTraceNode( model.pendula[ 0 ], modelViewTransform );
  this.secondPeriodTraceNode = new PeriodTraceNode( model.pendula[ 1 ], modelViewTransform );

  // create protractor node
  const protractorNode = new PendulumLabProtractorNode( model.pendula, modelViewTransform );

  // create a node to keep track of combo box
  const popupLayer = new Node();

  const pendulumControlPanel = new PendulumControlPanel( model.pendula, model.numberOfPendulaProperty );
  const globalControlPanel = new GlobalControlPanel( model, popupLayer, !!options.hasGravityTweakers );

  // @protected
  this.rightPanelsContainer = new VBox( {
    spacing: PendulumLabConstants.PANEL_PADDING,
    children: [
      pendulumControlPanel,
      globalControlPanel
    ],
    right: this.layoutBounds.right - PendulumLabConstants.PANEL_PADDING,
    top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
  } );

  // create tools control panel (which controls the visibility of the ruler and stopwatch)
  const toolsControlPanelNode = new ToolsPanel( model.ruler.isVisibleProperty,
    model.stopwatch.isVisibleProperty,
    model.isPeriodTraceVisibleProperty,
    options.hasPeriodTimer, {
      maxWidth: 180,
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      bottom: this.layoutBounds.bottom - PendulumLabConstants.PANEL_PADDING
    } );

  // @protected {Node}
  this.toolsControlPanelNode = toolsControlPanelNode;

  // create pendulum system control panel (controls the length and mass of the pendula)
  const playbackControls = new PlaybackControlsNode( model.numberOfPendulaProperty,
    model.isPlayingProperty,
    model.timeSpeedProperty,
    model.stepManual.bind( model ),
    model.returnPendula.bind( model ), {
      x: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - PendulumLabConstants.PANEL_PADDING
    } );

  // create reset all button
  const resetAllButton = new ResetAllButton( {
    listener: model.reset.bind( model ),
    right: this.layoutBounds.right - PendulumLabConstants.PANEL_PADDING,
    bottom: this.layoutBounds.bottom - PendulumLabConstants.PANEL_PADDING
  } );

  // create ruler node
  const rulerNode = new PendulumLabRulerNode( model.ruler, modelViewTransform, this.layoutBounds );
  rulerNode.left = this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING;
  rulerNode.top = this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING;
  model.ruler.setInitialPositionValue( rulerNode.center );

  // @protected
  this.rulerNode = rulerNode;

  // create timer node
  const stopwatchNode = new StopwatchNode( model.stopwatch, {
    visibleBoundsProperty: this.visibleBoundsProperty
  } );

  // @protected
  this.stopwatchNode = stopwatchNode;

  this.setStopwatchInitialPosition();

  // @protected
  this.arrowsPanelLayer = new Node();
  this.energyGraphLayer = new Node();
  this.periodTimerLayer = new Node();

  const leftFloatingLayer = new Node( {
    children: [
      this.energyGraphLayer, this.arrowsPanelLayer, toolsControlPanelNode
    ]
  } );
  const rightFloatingLayer = new Node( {
    children: [
      this.rightPanelsContainer,
      resetAllButton,
      popupLayer
    ]
  } );

  // Layout for https://github.com/phetsims/pendulum-lab/issues/98
  this.visibleBoundsProperty.lazyLink( function( visibleBounds ) {
    let dx = -visibleBounds.x;
    dx = Math.min( 200, dx );
    leftFloatingLayer.x = -dx;
    rightFloatingLayer.x = dx;
    // set the drag bounds of the ruler
    rulerNode.movableDragHandler.setDragBounds( visibleBounds.erodedXY( rulerNode.width / 2, rulerNode.height / 2 ) );
  } );

  this.children = [
    backgroundDragNode,
    protractorNode,
    leftFloatingLayer,
    rightFloatingLayer,
    playbackControls,
    this.firstPeriodTraceNode,
    this.secondPeriodTraceNode,
    pendulaNode,
    rulerNode,
    this.periodTimerLayer,
    stopwatchNode
  ];
}

pendulumLab.register( 'PendulumLabScreenView', PendulumLabScreenView );

inherit( ScreenView, PendulumLabScreenView, {

  /**
   * Position the stopwatch next to the ruler.
   * @protected
   */
  setStopwatchInitialPosition() {
    const stopwatchInitialPosition = new Vector2(
      this.rulerNode.right + 10,
      this.rulerNode.bottom - this.stopwatchNode.height
    );
    this.model.stopwatch.positionProperty.value = stopwatchInitialPosition;
    this.model.stopwatch.positionProperty.setInitialValue( stopwatchInitialPosition );
  },
  /**
   * Steps the view.
   * @public
   *
   * @param {number} dt
   */
  step: function( dt ) {
    if ( this.model.isPlayingProperty.value ) {
      this.firstPeriodTraceNode.step( dt );
      this.secondPeriodTraceNode.step( dt );
    }
  }
} );

export default PendulumLabScreenView;
