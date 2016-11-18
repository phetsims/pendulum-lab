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
  var ClosestDragListener = require( 'SUN/ClosestDragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabRulerNode = require( 'PENDULUM_LAB/common/view/PendulumLabRulerNode' );
  var PendulumsNode = require( 'PENDULUM_LAB/common/view/PendulumsNode' );
  var PlaybackControlsNode = require( 'PENDULUM_LAB/common/view/PlaybackControlsNode' );
  var PeriodTraceNode = require( 'PENDULUM_LAB/common/view/PeriodTraceNode' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ReturnButtonNode = require( 'PENDULUM_LAB/common/view/ReturnButtonNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StopwatchNode = require( 'PENDULUM_LAB/common/view/StopwatchNode' );
  var PendulumSystemControlPanels = require( 'PENDULUM_LAB/common/view/PendulumSystemControlPanels' );
  var ToolsControlPanelNode = require( 'PENDULUM_LAB/common/view/ToolsControlPanelNode' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function PendulumLabView( pendulumLabModel, modelViewTransform, options ) {
    ScreenView.call( this, { layoutBounds: PendulumLabConstants.SIM_BOUNDS } );

    options = _.extend( {
      includeGravityTweakers: false
    }, options );

    // create pendula
    var pendulumsNode = new PendulumsNode( pendulumLabModel.pendulums, modelViewTransform, {
      isAccelerationVisibleProperty: pendulumLabModel.isAccelerationVisibleProperty,
      isVelocityVisibleProperty: pendulumLabModel.isVelocityVisibleProperty
    } );

    // create drag listener for the pendula
    var backgroundDragNode = new Plane();
    var dragListener = new ClosestDragListener( 0.15, 0 ); // 15cm from mass is OK for touch
    pendulumsNode.draggableItems.forEach( function( draggableItem ) { dragListener.addDraggableItem( draggableItem ); } );
    backgroundDragNode.addInputListener( dragListener );

    // create period trace node
    var periodTraceNode = new PeriodTraceNode( pendulumLabModel.pendulums, modelViewTransform );

    // create protractor node
    var protractorNode = new ProtractorNode( pendulumLabModel.pendulums, modelViewTransform );

    // create a node to keep track of combo box
    var bodiesListNode = new Node();

    var slidersPanelNode = new PendulumSystemControlPanels( pendulumLabModel, bodiesListNode, {
      includeGravityTweakers: !!options.includeGravityTweakers
      // TODO: layout here
    } );

    this.slidersPanelNode = slidersPanelNode;

    // create tools control panel (which controls the visibility of the ruler and stopwatch)
    var toolsControlPanelNode = new ToolsControlPanelNode( pendulumLabModel.ruler.isVisibleProperty,
      pendulumLabModel.stopwatch.isVisibleProperty, pendulumLabModel.isPeriodTraceVisibleProperty, { maxWidth: 180 } );

    // @protected
    this.toolsControlPanelNode = toolsControlPanelNode;

    // create pendulum system control panel (controls the length and mass of the pendula)
    var pendulumSystemControlPanelNode = new PlaybackControlsNode( pendulumLabModel.numberOfPendulumsProperty,
      pendulumLabModel.playProperty, pendulumLabModel.timeSpeedProperty, pendulumLabModel.stepManual.bind( pendulumLabModel ) );

    // create reset all button
    var resetAllButton = new ResetAllButton( {
      listener: pendulumLabModel.reset.bind( pendulumLabModel ),
      touchAreaDilation: 6
    } );
    resetAllButton.scale( 0.75 );

    // create ruler node
    var rulerNode = new PendulumLabRulerNode( pendulumLabModel.ruler, modelViewTransform, this.layoutBounds );

    // @protected
    this.rulerNode = rulerNode;

    // create timer node
    var stopwatchNode = new StopwatchNode( pendulumLabModel.stopwatch, this.layoutBounds );

    // @protected
    this.stopwatchNode = stopwatchNode;

    // create return button
    var returnButtonNode = new ReturnButtonNode( {
      listener: pendulumLabModel.returnHandler.bind( pendulumLabModel ),
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
      // set the drag bounds of the ruler and stopwatch
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

    // layout of nodes
    slidersPanelNode.right = this.layoutBounds.maxX - SCREEN_PADDING.RIGHT;
    slidersPanelNode.top = SCREEN_PADDING.TOP;
    pendulumSystemControlPanelNode.centerX = this.layoutBounds.centerX;
    pendulumSystemControlPanelNode.bottom = this.layoutBounds.maxY - SCREEN_PADDING.BOTTOM;
    toolsControlPanelNode.left = SCREEN_PADDING.LEFT;
    toolsControlPanelNode.bottom = pendulumSystemControlPanelNode.bottom;
    rulerNode.left = toolsControlPanelNode.left;
    rulerNode.top = SCREEN_PADDING.TOP + 10;
    stopwatchNode.left = rulerNode.right + 15;
    stopwatchNode.bottom = rulerNode.bottom;
    resetAllButton.right = slidersPanelNode.right;
    resetAllButton.bottom = pendulumSystemControlPanelNode.bottom;
    returnButtonNode.centerX = resetAllButton.left - 75;
    returnButtonNode.centerY = resetAllButton.centerY;

    // set initial value for ruler and stopwatch 'location' property
    pendulumLabModel.ruler.setInitialLocationValue( rulerNode.center );
    pendulumLabModel.stopwatch.setInitialLocationValue( stopwatchNode.center );

  }

  pendulumLab.register( 'PendulumLabView', PendulumLabView );

  return inherit( ScreenView, PendulumLabView );
} );