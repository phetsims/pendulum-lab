// Copyright 2014-2015, University of Colorado Boulder

/**
 * Length/mass panel and gravity/friction panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var FrictionSliderNode = require( 'PENDULUM_LAB/common/view/FrictionSliderNode' );
  var GravityControlNode = require( 'PENDULUM_LAB/common/view/GravityControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var frictionString = require( 'string!PENDULUM_LAB/friction' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model - Main model of pendulum lab simulation.
   * @param {Node} popupLayer
   * @param {boolean} hasGravityTweakers
   */
  function GlobalControlPanel( model, popupLayer, hasGravityTweakers ) {

    var gravityControlNode = new GravityControlNode( model.gravityProperty, model.gravityRange, model.bodyProperty, popupLayer, {
      useTextSliderLabels: !hasGravityTweakers
    } );
    var frictionSlider = new FrictionSliderNode( model.frictionProperty, model.frictionRange );

    var content = new VBox( {
      spacing: 10,
      children: [
        new VBox( {
          align: 'left',
          children: [
            new AlignBox( gravityControlNode, { group: PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP } )
          ],
          spacing: 4
        } ),
        new VBox( {
          align: 'left',
          children: [
            new Text( frictionString, { font: PendulumLabConstants.TITLE_FONT_BOLD, maxWidth: PendulumLabConstants.TITLE_MAX_WIDTH } ),
            new AlignBox( frictionSlider, { group: PendulumLabConstants.RIGHT_CONTENT_ALIGN_GROUP } )
          ],
          spacing: 4
        } )
      ]
    } );

    Panel.call( this, content, PendulumLabConstants.PANEL_OPTIONS );
  }

  pendulumLab.register( 'GlobalControlPanel', GlobalControlPanel );

  return inherit( Panel, GlobalControlPanel );
} );
