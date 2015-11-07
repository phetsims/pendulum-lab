// Copyright 2014-2015, University of Colorado Boulder

/**
 * Sliders node for system options in 'Pendulum Lab' simulation.
 * Contains friction slider and gravity slider with dropdown menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var FrictionSliderNode = require( 'PENDULUM_LAB/common/view/FrictionSliderNode' );
  var GravitySliderWithListNode = require( 'PENDULUM_LAB/common/view/GravitySliderWithListNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var frictionString = require( 'string!PENDULUM_LAB/friction' );
  var gravityString = require( 'string!PENDULUM_LAB/gravity' );

  // constants
  var FONT_TITLE = new PhetFont( { size: 12, weight: 'bold' } );
  var SPACING_CONTENT = 5;

  /**
   * @param {PendulumLabModel} pendulumLabModel - Main model of pendulum lab simulation.
   * @param {Node} bodiesListNode - Node for bodies list. Should be displayed above all other layers.
   * @param {Object} [options] for control panel node.
   * @constructor
   */
  function SystemSlidersNode( pendulumLabModel, bodiesListNode, options ) {
    var content = new VBox( { spacing: SPACING_CONTENT, align: 'center' } );
    this._content = content;

    // add gravity slider with title and body list menu
    this.gravitySlider = new GravitySliderWithListNode( pendulumLabModel.gravityProperty,
      pendulumLabModel.gravityRange, pendulumLabModel.bodyTitleProperty, pendulumLabModel.bodies, bodiesListNode, { y: SPACING_CONTENT } );
    content.addChild( new Node( {
      children: [
        new Text( gravityString, { font: FONT_TITLE, pickable: false } ),
        this.gravitySlider
      ]
    } ) );

    // add friction slider with title when necessary
    if ( pendulumLabModel.frictionProperty ) {
      var frictionSliderNode = new FrictionSliderNode( pendulumLabModel.frictionProperty, pendulumLabModel.frictionRange, { y: SPACING_CONTENT } );
      var frictionSliderLabel = new Text( frictionString, { font: FONT_TITLE, x: -PendulumLabConstants.THUMB_SIZE.width / 2, pickable: false } );
      frictionSliderLabel.centerY = -(frictionSliderNode.height + frictionSliderLabel.height) / 2 - 4;

      content.addChild( new Node( {
        children: [
          frictionSliderLabel,
          frictionSliderNode
        ]
      } ) );
    }

    PanelPendulumAbstract.call( this, content, options );
  }

  return inherit( PanelPendulumAbstract, SystemSlidersNode, {
    setContentWidth: function( width ) {
      this._content.addChild( new HStrut( width - PendulumLabConstants.PANEL_MARGIN ) );
    }
  } );
} );