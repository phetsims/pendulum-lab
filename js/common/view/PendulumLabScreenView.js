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
  var GlobalControlPanel = require( 'PENDULUM_LAB/common/view/GlobalControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulaNode = require( 'PENDULUM_LAB/common/view/PendulaNode' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumControlPanel = require( 'PENDULUM_LAB/common/view/PendulumControlPanel' );
  var PendulumLabRulerNode = require( 'PENDULUM_LAB/common/view/PendulumLabRulerNode' );
  var PeriodTraceNode = require( 'PENDULUM_LAB/common/view/PeriodTraceNode' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var PlaybackControlsNode = require( 'PENDULUM_LAB/common/view/PlaybackControlsNode' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ReturnButtonNode = require( 'PENDULUM_LAB/common/view/ReturnButtonNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StopwatchNode = require( 'PENDULUM_LAB/common/view/StopwatchNode' );
  var ToolsPanel = require( 'PENDULUM_LAB/common/view/ToolsPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   * @param {ModelViewTransform2} modelViewTransform
   */
  function PendulumLabScreenView( model, options ) {
    ScreenView.call( this );

    // @private {PendulumLabModel}
    this.model = model;

    options = _.extend( {
      hasGravityTweakers: false,
      hasPeriodTimer: false
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
    this.firstPeriodTraceNode = new PeriodTraceNode( model.pendula[ 0 ], modelViewTransform );
    this.secondPeriodTraceNode = new PeriodTraceNode( model.pendula[ 1 ], modelViewTransform );

    // create protractor node
    var protractorNode = new ProtractorNode( model.pendula, modelViewTransform );

    // create a node to keep track of combo box
    var popupLayer = new Node();

    var pendulumControlPanel = new PendulumControlPanel( model.pendula, model.numberOfPendulaProperty );
    var globalControlPanel = new GlobalControlPanel( model, popupLayer, !!options.hasGravityTweakers );
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
    var toolsControlPanelNode = new ToolsPanel( model.ruler.isVisibleProperty, model.stopwatch.isVisibleProperty, model.isPeriodTraceVisibleProperty, options.hasPeriodTimer, {
      maxWidth: 180,
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      bottom: this.layoutBounds.bottom - PendulumLabConstants.PANEL_PADDING
    } );

    // @protected {Node}
    this.toolsControlPanelNode = toolsControlPanelNode;

    // create pendulum system control panel (controls the length and mass of the pendula)
    //TODO: pass in model? :P
    var playbackControls = new PlaybackControlsNode( model.numberOfPendulaProperty, model.isPlayingProperty, model.timeSpeedProperty, model.stepManual.bind( model ), {
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - PendulumLabConstants.PANEL_PADDING
    } );

    // create reset all button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      touchAreaDilation: 6,
      right: this.layoutBounds.right - PendulumLabConstants.PANEL_PADDING,
      bottom: this.layoutBounds.bottom - PendulumLabConstants.PANEL_PADDING
    } );

    // create ruler node
    var rulerNode = new PendulumLabRulerNode( model.ruler, modelViewTransform, this.layoutBounds );
    rulerNode.left = this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING;
    rulerNode.top = this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING;
    model.ruler.setInitialLocationValue( rulerNode.center );

    // @protected
    this.rulerNode = rulerNode;

    // create timer node
    var stopwatchNode = new StopwatchNode( model.stopwatch, this.layoutBounds );
    stopwatchNode.bottom = rulerNode.bottom;
    stopwatchNode.right = Math.max( 167.75, toolsControlPanelNode.right ); // If we are only on this screen
    model.stopwatch.setInitialLocationValue( stopwatchNode.center );

    // @protected
    this.stopwatchNode = stopwatchNode;

    // create return button
    var returnButtonNode = new ReturnButtonNode( {
      listener: model.returnPendula.bind( model ),
      maxWidth: 120,
      left: this.rightPanelsContainer.left,
      centerY: resetAllButton.centerY
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
        this.rightPanelsContainer,
        resetAllButton,
        returnButtonNode,
        popupLayer
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
    this.addChild( playbackControls );
    this.addChild( this.firstPeriodTraceNode );
    this.addChild( this.secondPeriodTraceNode );
    this.addChild( pendulaNode );
    this.addChild( rulerNode );
    this.addChild( this.periodTimerLayer );
    this.addChild( stopwatchNode );
  }

  pendulumLab.register( 'PendulumLabScreenView', PendulumLabScreenView );

  return inherit( ScreenView, PendulumLabScreenView, {
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
} );
