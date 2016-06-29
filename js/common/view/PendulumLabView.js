// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ClosestDragListener = require( 'SUN/ClosestDragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabRulerNode = require( 'PENDULUM_LAB/common/view/PendulumLabRulerNode' );
  var PendulumsNode = require( 'PENDULUM_LAB/common/view/PendulumsNode' );
  var PendulumSlidersNode = require( 'PENDULUM_LAB/common/view/PendulumSlidersNode' );
  var PendulumSystemControlPanelNode = require( 'PENDULUM_LAB/common/view/PendulumSystemControlPanelNode' );
  var PeriodTraceNode = require( 'PENDULUM_LAB/common/view/PeriodTraceNode' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ReturnButtonNode = require( 'PENDULUM_LAB/common/view/ReturnButtonNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StopwatchNode = require( 'PENDULUM_LAB/common/view/StopwatchNode' );
  var SystemSlidersNode = require( 'PENDULUM_LAB/common/view/SystemSlidersNode' );
  var ToolsControlPanelNode = require( 'PENDULUM_LAB/common/view/ToolsControlPanelNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function PendulumLabView( pendulumLabModel, modelViewTransform ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );
    var width = this.layoutBounds.width;
    var height = this.layoutBounds.height;

    // create protractor node
    var protractorNode = new ProtractorNode( pendulumLabModel.pendulums, modelViewTransform );
    protractorNode.centerX = width / 2;
    protractorNode.top = SCREEN_PADDING.TOP - 5;

    // create pendulums
    var pendulumsNode = new PendulumsNode( pendulumLabModel.pendulums, modelViewTransform, {
      isAccelerationVisibleProperty: pendulumLabModel.isAccelerationVisibleProperty,
      isVelocityVisibleProperty: pendulumLabModel.isVelocityVisibleProperty
    } );

    // place pendulums
    pendulumsNode.centerX = width / 2;
    pendulumsNode.top = SCREEN_PADDING.TOP;

    // create drag listener
    var backgroundDragNode = new Plane();
    var dragListener = new ClosestDragListener( 0.15, 0 ); // 15cm from mass is OK for touch
    pendulumsNode.draggableItems.forEach( function( draggableItem ) { dragListener.addDraggableItem( draggableItem ); } );
    backgroundDragNode.addInputListener( dragListener );

    // create period trace node
    var periodTraceNode = new PeriodTraceNode( pendulumLabModel.pendulums, modelViewTransform, {
      x: width / 2,
      y: SCREEN_PADDING.TOP
    } );

    // add panel with sliders for pendulums
    var bodiesListNode = new Node();
    var pendulumSlidersNode = new PendulumSlidersNode( pendulumLabModel );

    // @protected
    this.systemSlidersNode = new SystemSlidersNode( pendulumLabModel, bodiesListNode );

    // adjust width of panels
    var panelWidth = Math.max( pendulumSlidersNode.localBounds.width, this.systemSlidersNode.localBounds.width );
    if ( pendulumSlidersNode.localBounds.width < panelWidth ) {
      pendulumSlidersNode.setContentWidth( panelWidth );
    }
    if ( this.systemSlidersNode.localBounds.width < panelWidth ) {
      this.systemSlidersNode.setContentWidth( panelWidth );
    }

    var maxLeftWidthPanel = 180;
    pendulumSlidersNode.maxWidth = maxLeftWidthPanel;
    this.systemSlidersNode.maxWidth = maxLeftWidthPanel;

    var slidersPanelNode = new VBox( {
      spacing: 8, children: [
        pendulumSlidersNode,
        this.systemSlidersNode
      ]
    } );
    slidersPanelNode.right = width - SCREEN_PADDING.RIGHT - 5;
    slidersPanelNode.top = SCREEN_PADDING.TOP - 2;
    this.slidersPanelNode = slidersPanelNode;

    // add tools control panel
    var toolsControlPanelNode = new ToolsControlPanelNode( pendulumLabModel.ruler.isVisibleProperty,
      pendulumLabModel.stopwatch.isVisibleProperty, pendulumLabModel.isPeriodTraceVisibleProperty, { maxWidth: 180 } );
    toolsControlPanelNode.left = SCREEN_PADDING.LEFT;
    toolsControlPanelNode.bottom = height - SCREEN_PADDING.BOTTOM;

    // @protected
    this.toolsControlPanelNode = toolsControlPanelNode;

    // add pendulum system control panel
    var pendulumSystemControlPanelNode = new PendulumSystemControlPanelNode( pendulumLabModel.numberOfPendulumsProperty,
      pendulumLabModel.playProperty, pendulumLabModel.timeSpeedProperty, pendulumLabModel.stepManual.bind( pendulumLabModel ) );
    pendulumSystemControlPanelNode.centerX = width / 2;
    pendulumSystemControlPanelNode.bottom = height - SCREEN_PADDING.BOTTOM;

    // add reset all button
    var resetAllButton = new ResetAllButton( {
      listener: pendulumLabModel.reset.bind( pendulumLabModel ),
      touchAreaDilation: 6
    } );
    resetAllButton.right = width - SCREEN_PADDING.RIGHT;
    resetAllButton.centerY = height - SCREEN_PADDING.BOTTOM - 8;
    resetAllButton.scale( 0.75 );

    // add ruler node
    var rulerNode = new PendulumLabRulerNode( pendulumLabModel.ruler, modelViewTransform, this.layoutBounds );

    // @protected
    this.rulerNode = rulerNode;

    // add timer node
    var stopwatchNode = new StopwatchNode( pendulumLabModel.stopwatch, this.layoutBounds, toolsControlPanelNode.bounds );

    // @protected
    this.stopwatchNode = stopwatchNode;

    // add return button
    var returnButtonNode = new ReturnButtonNode( {
      listener: pendulumLabModel.returnHandler.bind( pendulumLabModel ),
      centerX: resetAllButton.bounds.minX - 75,
      centerY: height - SCREEN_PADDING.BOTTOM - 8,
      maxWidth: 120
    } );

    // @protected
    this.arrowsPanelLayer = new Node();
    this.energyGraphLayer = new Node();
    this.periodTimerLayer = new Node();

    var leftFloatingLayer = new Node( {
      children: [
        this.energyGraphLayer, this.arrowsPanelLayer, toolsControlPanelNode
      ]
    } );
    var rightFloatingLayer = new Node( {
      children: [
        slidersPanelNode, bodiesListNode, resetAllButton, returnButtonNode
      ]
    } );

    // Layout for https://github.com/phetsims/pendulum-lab/issues/98
    this.visibleBoundsProperty.lazyLink( function( visibleBounds ) {
      var dx = -visibleBounds.x;
      dx = Math.min( 200, dx );
      leftFloatingLayer.x = -dx;
      rightFloatingLayer.x = dx;
      rulerNode.movableDragHandler.setDragBounds( visibleBounds.erodedXY( rulerNode.width / 2, rulerNode.height / 2 ) );
      stopwatchNode.movableDragHandler.setDragBounds( visibleBounds.erodedXY( stopwatchNode.width / 2, stopwatchNode.height / 2 ) );
    } );

    // render order
    this.addChild( backgroundDragNode );
    this.addChild( protractorNode );
    this.addChild( leftFloatingLayer );
    this.addChild( rightFloatingLayer );
    this.addChild( pendulumSystemControlPanelNode );
    this.addChild( periodTraceNode );
    this.addChild( pendulumsNode );
    this.addChild( rulerNode );
    this.addChild( this.periodTimerLayer );
    this.addChild( stopwatchNode );

    // set initial value for ruler and stopwatch 'location' property
    pendulumLabModel.ruler.setInitialLocationValue( rulerNode.center );
    pendulumLabModel.stopwatch.setInitialLocationValue( stopwatchNode.center );

  }

  pendulumLab.register( 'PendulumLabView', PendulumLabView );

  return inherit( ScreenView, PendulumLabView );
} );