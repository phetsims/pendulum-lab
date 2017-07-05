// Copyright 2014-2015, University of Colorado Boulder

/**
 * Length/mass panel and gravity/friction panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var FrictionSliderNode = require( 'PENDULUM_LAB/common/view/FrictionSliderNode' );
  var GravityControlNode = require( 'PENDULUM_LAB/common/view/GravityControlNode' );
  var LengthMassControlNode = require( 'PENDULUM_LAB/common/view/LengthMassControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var frictionString = require( 'string!PENDULUM_LAB/friction' );
  var gravityString = require( 'string!PENDULUM_LAB/gravity' );

  // constants
  var FONT_TITLE = new PhetFont( { size: 12, weight: 'bold' } );
  var SPACING_CONTENT = 4; // spacing in between slider elements

  /**
   * @param {PendulumLabModel} pendulumLabModel - Main model of pendulum lab simulation.
   * @param {Node} popupLayer
   * @param {Object} [options] for control panel node.
   * @constructor
   */
  function PendulumSystemControlPanels( pendulumLabModel, popupLayer, options ) {

    var lengthMassControls = [ 0, 1 ].map( function( index ) {
      return new LengthMassControlNode( pendulumLabModel.pendula[ index ], index );
    } );

    var lengthMassContentNode = new VBox( { spacing: SPACING_CONTENT, align: 'center', children: lengthMassControls } );

    var gravityFrictionContentNode = new VBox( { spacing: SPACING_CONTENT, align: 'center' } );

    // TODO: cleanup
    // create and add gravity slider with title and body list menu
    // TODO: reduce number of parameters
    this.gravitySlider = new GravityControlNode( pendulumLabModel.gravityProperty, pendulumLabModel.gravityRange, pendulumLabModel.bodyProperty, popupLayer, { y: SPACING_CONTENT } );
    var gravitySliderLabel = new Text( gravityString, { font: FONT_TITLE, pickable: false } );
    gravityFrictionContentNode.addChild( new Node( {
      children: [
        gravitySliderLabel,
        this.gravitySlider
      ]
    } ) );

    if ( options.includeGravityTweakers ) {
      // add tweakers for gravity slider slider
      this.gravitySlider.addTweakers( pendulumLabModel.gravityProperty, pendulumLabModel.gravityRange );
    }

    // create and add friction slider with title when necessary
    if ( pendulumLabModel.frictionProperty ) {
      var frictionSliderNode = new FrictionSliderNode( pendulumLabModel.frictionProperty, pendulumLabModel.frictionRange, { y: SPACING_CONTENT } );
      var frictionSliderLabel = new Text( frictionString, { font: FONT_TITLE, pickable: false } );
      frictionSliderNode.top = frictionSliderLabel.bottom + 4;
      gravityFrictionContentNode.addChild( new Node( {
        children: [
          frictionSliderLabel,
          frictionSliderNode
        ]
      } ) );
    }

    var maxWidth = Math.max( lengthMassContentNode.width, gravityFrictionContentNode.width );

    pendulumLabModel.numberOfPendulaProperty.link( function( numberOfPendula ) {
      lengthMassContentNode.children = lengthMassControls.slice( 0, numberOfPendula );
    } );

    var panelOptions = _.extend( {
      // TODO: margins not included in minWidth?
      minWidth: maxWidth + PendulumLabConstants.PANEL_OPTIONS.xMargin * 2,
      align: 'center'
    }, PendulumLabConstants.PANEL_OPTIONS );

    VBox.call( this, _.extend( {
      spacing: 5,
      children: [
        new Panel( lengthMassContentNode, panelOptions ),
        new Panel( gravityFrictionContentNode, panelOptions )
      ]
    }, options ) );
  }

  pendulumLab.register( 'PendulumSystemControlPanels', PendulumSystemControlPanels );

  return inherit( VBox, PendulumSystemControlPanels );
} );
