// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ClosestDragListener = require( 'SUN/ClosestDragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulaNode = require( 'PENDULUM_LAB/common/view/PendulaNode' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabRulerNode = require( 'PENDULUM_LAB/common/view/PendulumLabRulerNode' );
  var PendulumSystemControlPanels = require( 'PENDULUM_LAB/common/view/PendulumSystemControlPanels' );
  var PeriodTraceNode = require( 'PENDULUM_LAB/common/view/PeriodTraceNode' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var PlaybackControlsNode = require( 'PENDULUM_LAB/common/view/PlaybackControlsNode' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ReturnButtonNode = require( 'PENDULUM_LAB/common/view/ReturnButtonNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StopwatchNode = require( 'PENDULUM_LAB/common/view/StopwatchNode' );
  var ToolsControlPanelNode = require( 'PENDULUM_LAB/common/view/ToolsControlPanelNode' );

  /**
   * @param {PendulumLabModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function PendulumLabView( model, options ) {
    ScreenView.call( this, { layoutBounds: PendulumLabConstants.LAYOUT_BOUNDS } );

    // @private {PendulumLabModel}
    this.model = model;

    options = _.extend( {
      includeGravityTweakers: false
    }, options );

    var modelViewTransform = PendulumLabConstants.MODEL_VIEW_TRANSFORM;

    var pendulaNode = new PendulaNode( model.pendula, modelViewTransform, {
      isAccelerationVisibleProperty: model.isAccelerationVisibleProperty,
      isVelocityVisibleProperty: model.isVelocityVisibleProperty
    } );

    // create drag listener for the pendula
    var backgroundDragNode = new Plane();
    var dragListener = new ClosestDragListener( 0.15, 0 ); // 15cm from mass is OK for touch
    pendulaNode.draggableItems.forEach( function( draggableItem ) { dragListener.addDraggableItem( draggableItem ); } );
    backgroundDragNode.addInputListener( dragListener );

    // @private {PeriodTraceNode}
    this.periodTraceNode = new PeriodTraceNode( model.pendula, modelViewTransform );

    // create protractor node
    var protractorNode = new ProtractorNode( model.pendula, modelViewTransform );

    // create a node to keep track of combo box
    var popupLayer = new Node();

    var slidersPanelNode = new PendulumSystemControlPanels( model, popupLayer, {
      includeGravityTweakers: !!options.includeGravityTweakers
      // TODO: layout here
    } );

    this.slidersPanelNode = slidersPanelNode;

    // create tools control panel (which controls the visibility of the ruler and stopwatch)
    var toolsControlPanelNode = new ToolsControlPanelNode( model.ruler.isVisibleProperty,
      model.stopwatch.isVisibleProperty, model.isPeriodTraceVisibleProperty, { maxWidth: 180 } );

    // @protected
    this.toolsControlPanelNode = toolsControlPanelNode;

    // create pendulum system control panel (controls the length and mass of the pendula)
    var pendulumSystemControlPanelNode = new PlaybackControlsNode( model.numberOfPendulaProperty,
      model.isPlayingProperty, model.timeSpeedProperty, model.stepManual.bind( model ) );

    // create reset all button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      touchAreaDilation: 6
    } );

    // create ruler node
    var rulerNode = new PendulumLabRulerNode( model.ruler, modelViewTransform, this.layoutBounds );

    // @protected
    this.rulerNode = rulerNode;

    // create timer node
    var stopwatchNode = new StopwatchNode( model.stopwatch, this.layoutBounds );

    // @protected
    this.stopwatchNode = stopwatchNode;

    // create return button
    var returnButtonNode = new ReturnButtonNode( {
      listener: model.returnPendula.bind( model ),
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
        slidersPanelNode, resetAllButton, returnButtonNode, popupLayer
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
    //TODO: children
    this.addChild( backgroundDragNode );
    this.addChild( protractorNode );
    this.addChild( leftFloatingLayer );
    this.addChild( rightFloatingLayer );
    this.addChild( pendulumSystemControlPanelNode );
    this.addChild( this.periodTraceNode );
    this.addChild( pendulaNode );
    this.addChild( rulerNode );
    this.addChild( this.periodTimerLayer );
    this.addChild( stopwatchNode );

    // layout of nodes
    slidersPanelNode.right = this.layoutBounds.maxX - PendulumLabConstants.SCREEN_PADDING;
    slidersPanelNode.top = PendulumLabConstants.SCREEN_PADDING;
    pendulumSystemControlPanelNode.centerX = this.layoutBounds.centerX;
    pendulumSystemControlPanelNode.bottom = this.layoutBounds.maxY - PendulumLabConstants.SCREEN_PADDING;
    toolsControlPanelNode.left = PendulumLabConstants.SCREEN_PADDING;
    toolsControlPanelNode.bottom = pendulumSystemControlPanelNode.bottom;
    rulerNode.left = toolsControlPanelNode.left;
    rulerNode.top = PendulumLabConstants.SCREEN_PADDING + 10;
    stopwatchNode.left = rulerNode.right + 15;
    stopwatchNode.bottom = rulerNode.bottom;
    resetAllButton.right = slidersPanelNode.right;
    resetAllButton.bottom = pendulumSystemControlPanelNode.bottom;
    returnButtonNode.centerX = resetAllButton.left - 75;
    returnButtonNode.centerY = resetAllButton.centerY;

    // set initial value for ruler and stopwatch 'location' property
    model.ruler.setInitialLocationValue( rulerNode.center );
    model.stopwatch.setInitialLocationValue( stopwatchNode.center );

  }

  pendulumLab.register( 'PendulumLabView', PendulumLabView );

  return inherit( ScreenView, PendulumLabView, {
    /**
     * Steps the view.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      if ( this.model.isPlayingProperty.value ) {
        this.periodTraceNode.step( dt );
      }
    }
  } );
} );
