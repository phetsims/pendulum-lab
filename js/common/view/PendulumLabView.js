//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumLabRulerNode = require( 'PENDULUM_LAB/common/view/PendulumLabRulerNode' );
  var PendulumsNode = require( 'PENDULUM_LAB/common/view/PendulumsNode' );
  var PendulumSystemControlPanelNode = require( 'PENDULUM_LAB/common/view/PendulumSystemControlPanelNode' );
  var PeriodTraceNode = require( 'PENDULUM_LAB/common/view/PeriodTraceNode' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidersControlPanelNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/SlidersControlPanelNode' );
  var StopwatchNode = require( 'PENDULUM_LAB/common/view/StopwatchNode' );
  var ToolsControlPanelNode = require( 'PENDULUM_LAB/common/view/ToolsControlPanelNode' );

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PendulumLabView( pendulumLabModel, mvt, screenshotImage ) {
    var pendulumLabView = this, width, height;

    ScreenView.call( this );
    width = this.layoutBounds.width;
    height = this.layoutBounds.height;

    var image = new Image( screenshotImage );
    image.scale( this.layoutBounds.width / image.width );
    // this.addChild( image );

    // add protractor node
    var protractorNode = new ProtractorNode( pendulumLabModel.pendulumModels, pendulumLabModel.metersToPixels );
    protractorNode.centerX = width / 2;
    protractorNode.centerY = protractorNode.height / 2 + SCREEN_PADDING.TOP - 5;

    // add pendulums
    var pendulumsNode = new PendulumsNode( pendulumLabModel.pendulumModels, pendulumLabModel.metersToPixels, {
      isAccelerationVisibleProperty: pendulumLabModel.property( 'isAccelerationVisible' ),
      isVelocityVisibleProperty: pendulumLabModel.property( 'isVelocityVisible' )
    } );
    pendulumsNode.centerX = width / 2;
    pendulumsNode.centerY = pendulumsNode.height / 2 + SCREEN_PADDING.TOP;

    // add period trace node
    var periodTraceNode = new PeriodTraceNode( pendulumLabModel.pendulumModels, pendulumLabModel.metersToPixels, pendulumLabModel.property( 'isPeriodTraceVisible' ), {
      x: width / 2,
      y: SCREEN_PADDING.TOP - 5
    } );

    // add control panel with sliders
    var planetsListNode = new Node();
    var sliderControlPanelNode = new SlidersControlPanelNode( pendulumLabModel, planetsListNode );
    sliderControlPanelNode.centerX = width - sliderControlPanelNode.width / 2 - SCREEN_PADDING.RIGHT - 5;
    sliderControlPanelNode.centerY = sliderControlPanelNode.height / 2 + SCREEN_PADDING.TOP - 2;
    this.sliderControlPanelNode = sliderControlPanelNode;

    // add tools control panel
    var toolsControlPanelNode = new ToolsControlPanelNode( pendulumLabModel.rulerModel.property( 'isVisible' ),
      pendulumLabModel.stopwatchModel.property( 'isVisible' ), pendulumLabModel.property( 'isPeriodTraceVisible' ) );
    toolsControlPanelNode.centerX = toolsControlPanelNode.width / 2 + SCREEN_PADDING.LEFT;
    toolsControlPanelNode.centerY = height - toolsControlPanelNode.height / 2 - SCREEN_PADDING.BOTTOM;

    // add pendulum system control panel
    var pendulumSystemControlPanelNode = new PendulumSystemControlPanelNode( pendulumLabModel.property( 'numberOfPendulums' ),
      pendulumLabModel.property( 'play' ), pendulumLabModel.property( 'timeSpeed' ), pendulumLabModel.stepManual.bind( pendulumLabModel ) );
    pendulumSystemControlPanelNode.centerX = width / 2;
    pendulumSystemControlPanelNode.centerY = height - pendulumSystemControlPanelNode.height / 2 - SCREEN_PADDING.BOTTOM;

    // add reset all button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        pendulumLabModel.reset();
        pendulumLabView.reset();
      }
    } );
    resetAllButton.centerX = width - resetAllButton.width / 2 - SCREEN_PADDING.RIGHT;
    resetAllButton.centerY = height - SCREEN_PADDING.BOTTOM - 5;
    resetAllButton.scale( 0.75 );

    // add ruler node
    var rulerNode = new PendulumLabRulerNode( pendulumLabModel.rulerModel, pendulumLabModel.metersToPixels, mvt, this.layoutBounds );

    // add timer node
    var stopwatchNode = new StopwatchNode( pendulumLabModel.stopwatchModel, mvt, this.layoutBounds, toolsControlPanelNode.bounds );

    // render order
    this.addChild( rulerNode );
    this.addChild( protractorNode );
    this.addChild( pendulumsNode );
    this.addChild( periodTraceNode );
    this.addChild( sliderControlPanelNode );
    this.addChild( planetsListNode );
    this.addChild( toolsControlPanelNode );
    this.addChild( pendulumSystemControlPanelNode );
    this.addChild( resetAllButton );
    this.addChild( stopwatchNode );
  }

  return inherit( ScreenView, PendulumLabView, {
    reset: function() {
      this.sliderControlPanelNode.reset();
    }
  } );
} );