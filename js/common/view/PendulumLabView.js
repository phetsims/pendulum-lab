//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView node that contains all other nodes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
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

  // constants
  var SCREEN_PADDING = PendulumLabConstants.SCREEN_PADDING;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PendulumLabView( pendulumLabModel, mvt, screenshotImage ) {
    var pendulumLabView = this, width, height;

    ScreenView.call( this, {renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 768, 504 )} );
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
    var periodTraceNode = new PeriodTraceNode( pendulumLabModel.pendulumModels, pendulumLabModel.metersToPixels, {
      x: width / 2,
      y: SCREEN_PADDING.TOP - 5
    } );

    // add panel with sliders for pendulums
    var planetsListNode = new Node();
    this.systemSlidersNode = new SystemSlidersNode( pendulumLabModel, planetsListNode );
    var slidersPanelNode = new VBox( {
      spacing: 8, children: [
        new PendulumSlidersNode( pendulumLabModel ),
        this.systemSlidersNode
      ]
    } );
    slidersPanelNode.centerX = width - slidersPanelNode.width / 2 - SCREEN_PADDING.RIGHT - 5;
    slidersPanelNode.centerY = slidersPanelNode.height / 2 + SCREEN_PADDING.TOP - 2;
    this.slidersPanelNode = slidersPanelNode;

    // add tools control panel
    var toolsControlPanelNode = new ToolsControlPanelNode( pendulumLabModel.rulerModel.property( 'isVisible' ),
      pendulumLabModel.stopwatchModel.property( 'isVisible' ), pendulumLabModel.property( 'isPeriodTraceVisible' ) );
    toolsControlPanelNode.centerX = toolsControlPanelNode.width / 2 + SCREEN_PADDING.LEFT;
    toolsControlPanelNode.centerY = height - toolsControlPanelNode.height / 2 - SCREEN_PADDING.BOTTOM;
    this.toolsControlPanelNode = toolsControlPanelNode;

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
    this.rulerNode = rulerNode;

    // add timer node
    var stopwatchNode = new StopwatchNode( pendulumLabModel.stopwatchModel, mvt, this.layoutBounds, toolsControlPanelNode.bounds );
    this.stopwatchNode = stopwatchNode;

    var returnButtonNode = new ReturnButtonNode( {
      listener: function() {
        pendulumLabModel.pendulumModels.forEach( function( pendulumModel ) {
          pendulumModel.resetMotion();
        } );
      }
    } );
    returnButtonNode.centerX = resetAllButton.bounds.minX - 75;
    returnButtonNode.centerY = height - SCREEN_PADDING.BOTTOM - 5;

    // render order
    this.addChild( rulerNode );
    this.addChild( protractorNode );
    this.addChild( pendulumsNode );
    this.addChild( periodTraceNode );
    this.addChild( slidersPanelNode );
    this.addChild( planetsListNode );
    this.addChild( toolsControlPanelNode );
    this.addChild( pendulumSystemControlPanelNode );
    this.addChild( resetAllButton );
    this.addChild( returnButtonNode );
    this.addChild( stopwatchNode );

    // set initial value for ruler and stopwatch 'location' property
    pendulumLabModel.rulerModel.setInitialLocationValue( rulerNode.center );
    pendulumLabModel.stopwatchModel.setInitialLocationValue( stopwatchNode.center );
  }

  return inherit( ScreenView, PendulumLabView, {
    reset: function() {
      this.systemSlidersNode.reset();
    }
  } );
} );