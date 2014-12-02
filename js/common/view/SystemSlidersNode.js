// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control panel node for system options in 'Pendulum Lab' simulation.
 * Contains friction slider and gravity slider with dropdown menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var FrictionSliderNode = require( 'PENDULUM_LAB/common/view/FrictionSliderNode' );
  var GravitySliderWithListNode = require( 'PENDULUM_LAB/common/view/GravitySliderWithListNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var FrictionString = require( 'string!PENDULUM_LAB/friction' );
  var GravityString = require( 'string!PENDULUM_LAB/gravity' );

  // constants
  var FONT_TITLE = new PhetFont( {size: 12, weight: 'bold'} );
  var SPACING_CONTENT = 5;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {Node} planetsListNode - Node for planets list. Should be displayed above all other layers
   * @param {Object} options for control panel node
   * @constructor
   */
  function SystemSlidersNode( pendulumLabModel, planetsListNode, options ) {
    var content = new VBox( {spacing: SPACING_CONTENT, align: 'center'} );

    // add gravity slider with title and planet list menu
    content.addChild( new Node( {
      children: [
        new Text( GravityString, {font: FONT_TITLE, x: -PendulumLabConstants.THUMB_SIZE.width / 2} ),
        new GravitySliderWithListNode(
          pendulumLabModel.property( 'gravity' ),
          pendulumLabModel.gravityRange,
          pendulumLabModel.property( 'planet' ),
          pendulumLabModel.planetModels,
          planetsListNode,
          {y: SPACING_CONTENT} )
      ]
    } ) );

    // add friction slider with title when necessary
    if ( pendulumLabModel.property( 'friction' ) ) {
      this.frictionSlider = new FrictionSliderNode( pendulumLabModel.property( 'friction' ), pendulumLabModel.frictionRange, {y: SPACING_CONTENT} );

      content.addChild( new Node( {
        children: [
          new Text( FrictionString, {font: FONT_TITLE, x: -PendulumLabConstants.THUMB_SIZE.width / 2} ),
          this.frictionSlider
        ]
      } ) );
    }

    PanelPendulumAbstract.call( this, content, options );
  }

  return inherit( PanelPendulumAbstract, SystemSlidersNode, {
    reset: function() {
      if ( this.frictionSlider ) {
        this.frictionSlider.reset();
      }
    }
  } );
} );