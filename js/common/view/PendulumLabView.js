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
  var PendulumSystemControlPanelNode = require( 'PENDULUM_LAB/common/view/PendulumSystemControlPanelNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ProtractorNode = require( 'PENDULUM_LAB/common/view/ProtractorNode' );
  //var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidersControlPanelNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/SlidersControlPanelNode' );
  var StopwatchNode = require( 'PENDULUM_LAB/common/view/StopwatchNode' );
  var ToolsControlPanelNode = require( 'PENDULUM_LAB/common/view/ToolsControlPanelNode' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PendulumLabView( pendulumLabModel, mvt, screenshotImage ) {
    var width, height, padding = {top: 23, left: 23, right: 23, bottom: 55};

    ScreenView.call( this );
    width = this.layoutBounds.width;
    height = this.layoutBounds.height;

    var image = new Image( screenshotImage );
    image.scale( this.layoutBounds.width / image.width );
    this.addChild( image );

    // add protractor node
    var protractorNode = new ProtractorNode( pendulumLabModel.pendulumModels );
    protractorNode.centerX = width / 2;
    protractorNode.centerY = protractorNode.height / 2 + padding.top;
    this.addChild( protractorNode );

    // add control panel with sliders
    var planetsListNode = new Node();
    this.sliderControlPanelNode = new SlidersControlPanelNode( pendulumLabModel, planetsListNode );
    this.sliderControlPanelNode.centerX = width - this.sliderControlPanelNode.width / 2 - padding.right;
    this.sliderControlPanelNode.centerY = this.sliderControlPanelNode.height / 2 + padding.top;
    this.addChild( this.sliderControlPanelNode );
    this.addChild( planetsListNode );

    // add tools control panel
    var toolsControlPanelNode = new ToolsControlPanelNode(
      pendulumLabModel.property( 'isRulerVisible' ),
      pendulumLabModel.property( 'isStopwatchVisible' ),
      pendulumLabModel.property( 'isPeriodTraceVisible' )
    );
    toolsControlPanelNode.centerX = toolsControlPanelNode.width / 2 + padding.left;
    toolsControlPanelNode.centerY = height - toolsControlPanelNode.height / 2 - padding.bottom;
    this.addChild( toolsControlPanelNode );

    // add pendulum system control panel
    var pendulumSystemControlPanelNode = new PendulumSystemControlPanelNode(
      pendulumLabModel.property( 'numberOfPendulums' ),
      pendulumLabModel.property( 'play' ),
      pendulumLabModel.property( 'timeSpeed' ),
      pendulumLabModel.stepManual.bind( pendulumLabModel )
    );
    pendulumSystemControlPanelNode.centerX = width / 2;
    pendulumSystemControlPanelNode.centerY = height - pendulumSystemControlPanelNode.height / 2 - padding.bottom;
    this.addChild( pendulumSystemControlPanelNode );

    // add reset all button
    var resetAllButton = new ResetAllButton( {listener: function() {pendulumLabModel.reset();}} );
    resetAllButton.centerX = width - resetAllButton.width / 2 - padding.right;
    resetAllButton.centerY = height - resetAllButton.height / 2 - padding.bottom;
    resetAllButton.scale( 0.75 );
    this.addChild( resetAllButton );

    // add timer node
    var stopwatch = new StopwatchNode( pendulumLabModel.stopwatchModel, pendulumLabModel.property( 'isStopwatchVisible' ), mvt, this.layoutBounds, toolsControlPanelNode.bounds );
    this.addChild( stopwatch );
  }

  return inherit( ScreenView, PendulumLabView );
} );